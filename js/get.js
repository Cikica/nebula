(function ( window, module ) {

	if ( window.define && window.define.amd ) { 
		define(module)
	} else { 

		var current_scripts, this_script, module_name

		current_scripts     = document.getElementsByTagName("script")
		this_script         = current_scripts[current_scripts.length-1]
		module_name         = this_script.getAttribute("data-module-name") || module.define.name
		window[module_name] = module
	}
})( 
	window,
	{
		define : {
			name : "nebula_manager"
		},

		make : function ( require, nebula ) {
			
			var self = this
		
			if ( require.package && require.package.length > 0 ) { 
				this.loop({
					array    : require.package,
					into     : [],
					start_at : 0,
					if_done  : function () {},
					else_do  : function ( loop ) {
						
						nebula.module_is_loading({
							called : loop.array[loop.start_at] 
						})

						requirejs([ loop.array[loop.start_at] +"/configuration" ], function ( configuration ) {
							self.make( configuration, nebula )
							nebula.module_has_loaded({
								called   : configuration.name,
								returned : [].concat( configuration.main, configuration.module )
							})
						})
						loop.start_at += 1
						return loop
					}
				})
			}
		},

		load : function ( nebula ) {
			
			var module_paths, self

			self         = this
			module_paths = []
			for ( module in nebula.map ) { 
				module_paths = module_paths.concat( nebula.map[module] )
			}

			requirejs( module_paths, function () {
				
				var module_by_path, module_by_name

				module_by_path = self.sort_module_paths_and_objects_into_module_path_map({
					path   : module_paths,
					object : arguments
				})
				module_by_name = self.sort_module_path_map_to_module_by_name_map(module_by_path)
				for ( var path in module_by_path ) {

					var library
					library = self.get_required_modules_as_a_module_library_based_on_definition({
						define      : module_by_path[path].define || {},
						location    : path,
						map_by_name : module_by_name,
					})
					console.log( path )
					console.log( library )
				}
			})
		},

		is_path_allowed_to_access_module : function ( allow ) {

			return true
		},

		get_required_modules_as_a_module_library_based_on_definition : function ( module ) {
			if ( !module.define.require || module.define.require.length === 0 ) { 
				return {}
			} else {
				var required_modules
				required_modules = this.get_required_modules_from_map_by_name({
					require     : module.define.require,
					location    : module.location,
					map_by_name : module.map_by_name,
					into        : {
						name    : [],
						module  : []
					},
				})
				return this.get_an_object_from_combining_two_arrays({
					key   : required_modules.name,
					value : required_modules.module
				})
			}
		},

		get_an_object_from_combining_two_arrays : function ( object ) {

			var key, value
			object.set = object.set || {}
			key        = this.remove_last_member_of_array_and_return_leftover( object.key )
			value      = this.remove_last_member_of_array_and_return_leftover( object.value )
			if ( object.value[object.value.length-1].constructor === Array ) {
				object.set[object.key.slice(object.key.length-1)] = object.value[object.value.length-1].slice(0)
			} else { 
				object.set[object.key.slice(object.key.length-1)] = object.value[object.value.length-1]
			}

			if ( key.length === 0 ) { 
				return object.set
			} else {
				return this.get_an_object_from_combining_two_arrays({
					key   : key,
					value : value,
					set   : object.set
				})
			}
		},

		get_required_modules_from_map_by_name : function ( sort ) {

			var module, module_name, modules_left_to_require

			module_name             = sort.require.slice(sort.require.length-1)
			modules_left_to_require = this.remove_last_member_of_array_and_return_leftover( sort.require )
			module                  = this.get_module_from_library_if_it_exists({
				name     : module_name,
				location : sort.location,
				library  : sort.map_by_name
			})

			if ( module === false ) {
				throw new Error("Module "+ module_name +" does not exist in this library compilation check to see if it has been mis spelt")
			}

			var library = {
				name   : sort.into.name.concat( module_name ),
				module : sort.into.module.concat( module )
			}

			if ( modules_left_to_require.length > 0 ) { 
				return this.get_required_modules_from_map_by_name({
					require     : modules_left_to_require,
					location    : sort.location,
					map_by_name : sort.map_by_name,
					into        : library
				})
			} else { 
				return library
			}

		},

		get_module_from_library_if_it_exists : function ( module ) {
			if ( module.library.hasOwnProperty( module.name ) ) { 
				return this.get_the_closest_library_version_for_module_based_on_its_location({
					library           : module.library[ module.name ],
					location          : module.location,
					name              : module.name
				})				
			} else {
				return false
			}
		},

		get_the_closest_library_version_for_module_based_on_its_location : function ( module ) {
			
			if ( module.current_location === null ) { 
				throw new Error("The module \""+ module.name +"\" could not be found in the scope of the file \""+ module.location +"\"" )
			}

			var module_path
			module.current_location = module.current_location || module.location
			module_path             = module.current_location +"/"+ module.name

			if ( module.library.hasOwnProperty(module_path) ) {
				return module.library[module_path]
			} else {
				return this.get_the_closest_library_version_for_module_based_on_its_location({
					library           : module.library,
					location          : module.location,
					name              : module.name,
					current_location  : this.get_path_directory( module.current_location )
				})
			}
		},

		get_path_directory : function ( path ) {
			var split_path, split_directory_path
			split_path           = path.split("/")
			split_directory_path = split_path.slice( 0, split_path.length-1 )
			if ( split_directory_path.length > 0 ) {
				return split_directory_path.join("/")
			} else { 
				return null
			}
		},

		sort_module_path_map_to_module_by_name_map : function ( map ) {

			var path, module_by_name_map
			module_by_name_map = {}

			for ( path in map ) {
				var split_path, module_name
				split_path  = path.split("/")
				module_name = split_path[split_path.length-1]
				if ( !module_by_name_map.hasOwnProperty( module_name ) ) {
					module_by_name_map[module_name] = {}
				}
				module_by_name_map[module_name][path] = map[path]
			}

			return module_by_name_map
		},

		remove_last_member_of_array_and_return_leftover : function ( array ) {
			if ( array.length === 1 ) {
				return []
			} else {
				return array.slice(0, array.length-1 )
			}
		},

		sort_module_paths_and_objects_into_module_path_map : function ( map ) {
			
			return this.loop({
				array    : map.path,
				start_at : 0,
				into     : {},
				if_done  : function (loop) {
					return loop.into 
				},
				else_do  : function (loop) {
					var path
					
					path            = loop.array[loop.start_at]
					loop.into[path] = map.object[loop.start_at]

					return { 
						array    : loop.array,
						into     : loop.into,
						start_at : loop.start_at + 1,
						if_done  : loop.if_done,
						else_do  : loop.else_do
					}
				}
			})
		},

		loop : function (loop) {
			if ( loop.start_at >= loop.array.length ) {
				return loop.if_done(loop)
			} else {
				return this.loop(loop.else_do({
					array    : loop.array.slice( 0 ),
					start_at : loop.start_at,
					into     : loop.into,
					if_done  : loop.if_done,
					else_do  : loop.else_do
				}))
			}
		},
	}
)
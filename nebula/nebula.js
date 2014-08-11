(function ( window, module ) {

	if ( window.define && window.define.amd ) {
		define(module)
	} else { 

		var current_scripts, this_script, module_name

		current_scripts     = document.getElementsByTagName("script")
		this_script         = current_scripts[current_scripts.length-1]
		module_name         = this_script.getAttribute("data-module-name") || "nebula"
		window[module_name] = module
	}
})( 
	window,
	{	
		
		get_module_name_from_path : function ( path ) { 
			var split
			split = path.split("/")
			return split[split.length-1]
		},

		create_loaded_module_list_from_new_modules : function ( set ) { 
			set.modules.concat(set.module)
		},

		create_updated_load_completion_map : function ( create ) { 
			var path_index
			path_index                  = create.map.path.indexOf( create.path )
			create.map.load[path_index] = true
			return { 
				path : create.map.path.slice(0),
				load : create.map.load.slice(0)
			}
		},

		create_load_completion_map : function ( create ) {
			
			create.at     = create.at   || 0
			create.into   = create.into || { path : [], load : [] }
			create.module = ( create.added ? create.module.concat( create.added ) : create.module )

			if ( create.at >= create.module.length ) { 
				return create.into
			} else { 
				return this.create_load_completion_map({
					at     : create.at + 1,
					module : create.module.slice(0),
					into   : {
						path : create.into.path.concat( create.module[create.at] ),
						load : create.into.load.concat( false )
					}
				})
			}
		},

		make    : function () {
			var self
			self = this
			return {
				modules  : [],
				load_map : {
					name   : [],
					loaded : []
				},
				load_completion_method : {},
				loading_module : function ( module ) {

				},
				loaded_module  : function ( module ) {

				},				
				call_this_method_upon_load_completion : function ( method ) {
					this.load_completion_method = method
				},

				is_module_loading_done    : self.is_module_loading_done,
				get_module_name_from_path : self.get_module_name_from_path
			}
		}
	}
)
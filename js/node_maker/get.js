define({
	
	make : function ( require, make ) {
		
		var self, main_and_module_paths
		self                  = this
		main_and_module_paths = [].concat( require.main, require.module )
		console.log("get")
		requirejs( main_and_module_paths , function () {

			var modules, module_link_definition

			module_link_definition = self.create_module_link_definition({
				paths   : main_and_module_paths,
				objects : arguments
			})
			modules                = self.create_module_path_to_module_reference_object({
				paths   : main_and_module_paths,
				objects : arguments
			})

			make( main_and_module_paths )
		})

		if ( require.package.length > 0 ) { 
			this.loop({
				array    : require.package,
				into     : [],
				start_at : 0,
				if_done  : function () {},
				else_do  : function ( loop ) {
					
					requirejs([ 
						loop.array[loop.start_at] +"/get",
						loop.array[loop.start_at] +"/configuration",
					], function ( get, configuration ) {
						get.make( configuration, make )
					})
					loop.start_at += 1
					return loop
				}
			})
		}
	},

	create_module_link_definition : function ( module ) {
		return this.loop({
			array    : module.paths,
			start_at : 0,
			into     : {},
			if_done  : function (loop) {
				return loop.into
			},
			else_do  : function (loop) {
				
				var module_reference = module.objects[loop.start_at]
				if ( module_reference.define && module_reference.define.require ) { 
					loop.into[loop.array[loop.start_at]] = module_reference.define.require.slice( 0 )
				}
				loop.start_at += 1
				return loop
			}
		})
	},

	create_module_path_to_module_reference_object : function (module) {
		var self = this
		return this.loop({
			array    : module.paths,
			start_at : 0,
			into     : {},
			if_done  : function (loop) {
				return loop.into
			},
			else_do  : function (loop) {
				var module_name
				// module_name = self.get_module_name_from_path({
				// 	path     : loop.array[loop.start_at],
				// 	start_at : 1,
				// })
				module_name = loop.array[loop.start_at]
				loop.into[module_name] = module.objects[loop.start_at]
				loop.start_at += 1
				return loop
			}
		})
	},

	get_module_name_from_path : function (get) {

		var name

		name       = {}
		name.parts = get.path.split("/")
		name.parts = name.parts[name.parts.length-1].split(".")
		name.full  = name.parts[name.parts.length-1]
		name.parts = name.parts.slice(get.start_from)

		return name
	},

	fullfil_module_requirement : function (through) {
		return this.loop_array({
			array    : through.required,
			start_at : 0,
			into     : through.module_library,
			if_done  : function (loop) {
				return loop.into
			},
			else_do  : function (loop) {
				var required_module_name
				required_module_name = loop.array[loop.start_at]
				if ( through.library[required_module_name] ) {
					loop.into[required_module_name] = through.library[required_module_name]
				}
				loop.start_at += 1
				return loop
			}
		})
	},

	prepare_package_array_for_requirement : function ( package_array ) { 
		return this.loop({
			array    : package_array,
			into     : [],
			start_at : 0,
			if_done  : function (loop) { 
				return loop.into
			},
			else_do : function (loop) { 
				return { 
					array    : loop.array,
					into     : loop.into.concat([
						loop.array[loop.start_at] +"/get",
						loop.array[loop.start_at] +"/configuration"
					]),
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

})
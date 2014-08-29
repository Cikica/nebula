(function ( window, module ) {

	var loaded_scripts, last_loaded_script, root_directory

	loaded_scripts     = document.getElementsByTagName("script")
	last_loaded_script = loaded_scripts[loaded_scripts.length-1]
	root_directory     = module.get_the_root_directory_based_on_last_loaded_script( last_loaded_script )

	if ( typeof window.define === 'function' && window.define.amd) {
		moudle.begin_loading({
			directory : root_directory
		})
	} else {


		if ( typeof window.jasmine === "object" ) {

			var module_name
			module_name         = this_script.getAttribute("data-module-name") || "entry"
			window[module_name] = module

		} else { 
			var require_js
			require_js         = document.createElement("script")
			require_js.src     = root_directory + "/require.js"
			require_js.onload  = function () {

				require.config({
					baseUrl : root_directory
				})

				requirejs([
					"nebula/configuration",
					"library/morph/morph",
					"configuration"
				], function ( tool_configuration, morph, module_configuration ) {

					var tool_module_paths
					tool_module_paths = morph.index_loop({
						subject : [].concat( tool_configuration.main, tool_configuration.module ),
						else_do : function ( loop ) { 
							return loop.into.concat( "nebula/"+ loop.indexed )
						}
					})

					requirejs( tool_module_paths , function () {

						var tool_path_map, loaded_modules

						loaded_modules = Array.prototype.slice.call( arguments )
						tool_path_map  = morph.get_object_from_array({
							key   : [].concat( tool_configuration.module, "entry", "morph" ),
							value : loaded_modules.slice(1).concat( module, morph )
						})
						
						arguments[0].make({
							nebula        : tool_path_map,
							configuration : module_configuration,
							root          : root_directory
						})
					})
				})
			}

			document.head.appendChild(require_js)
		}
	}

})( 
	window,
	{

		get_the_root_directory_based_on_last_loaded_script : function ( last_loaded_script ) { 

			var directory_from_attribute

			directory_from_attribute = last_loaded_script.getAttribute("data-directory")
			if (  directory_from_attribute )  { 
				return directory_from_attribute
			} else {
				
				var root_path, script_source_from_attribute

				script_source_from_attribute = last_loaded_script.getAttribute("src")

				if ( last_loaded_script.src === script_source_from_attribute ) {
					return this.get_path_directory( script_source_from_attribute )
				}
				
				root_path = last_loaded_script.src.replace( script_source_from_attribute, "" )

				if ( root_path[root_path.length-1] === "/" ) {
					return root_path.slice( 0, root_path.length-1 )
				} else { 
					return root_path
				}
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
	}
)
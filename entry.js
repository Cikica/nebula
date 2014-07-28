window.nebula = (function ( nebula ) {

	var begin_loading, get_the_root_directory_based_on_last_loaded_script, root_directory

	get_the_root_directory_based_on_last_loaded_script = function () { 

		var loaded_scripts, directory_from_attribute, last_loaded_script

		loaded_scripts           = document.getElementsByTagName("script")
		last_loaded_script       = loaded_scripts[loaded_scripts.length-1]
		directory_from_attribute = last_loaded_script.getAttribute("data-directory")
		
		if (  directory_from_attribute )  { 
			return directory_from_attribute
		} else {
			var root_path
			root_path = last_loaded_script.src.replace( last_loaded_script.getAttribute("src"), "" )
			if ( root_path[root_path.length-1] === "/" ) {
				return root_path.slice( 0, root_path.length-1 )
			} else { 
				return root_path
			}
		}
	},
	
	begin_loading = function ( load ) {

		requirejs([ 
			load.directory +"/get.js", 
			load.directory +"/nebula.js", 
			load.directory +"/configuration.js"
		], function ( get, nebula, configuration ) {

			var sorter
			sorter = nebula.make()
			
			sorter.module_is_loading({
				called : configuration.name
			})

			sorter.call_this_method_upon_load_completion( function ( load_map ) {
				get.require_package_modules({
					load_map       : load_map,
					root_directory : load.directory
				})
			})

			get.make({
				require        : configuration, 
				sort           : sorter,
				root_directory : load.directory
			})

			sorter.module_has_loaded({
				called   : configuration.name,
				returned : [].concat( configuration.main, configuration.module )
			})
		})
	}
	root_directory = get_the_root_directory_based_on_last_loaded_script()
	
	if ( typeof window.define === 'function' && window.define.amd) {
		begin_loading({
			directory : root_directory
		})
	} else {
		var require_js
		require_js        = document.createElement("script")
		require_js.src    = "require.js"
		require_js.onload = function () {
			begin_loading({
				directory : root_directory
			})
		}
		document.head.appendChild(require_js)
	}

	return nebula

})( window.nebula || {} )
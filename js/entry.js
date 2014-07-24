window.nebula = (function ( nebula ) {

	var begin_loading = function ( load ) {

		requirejs([ 
			load.directory +"/get", 
			load.directory +"/nebula", 
			load.directory +"/configuration"
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

	if ( typeof window.define === 'function' && window.define.amd) {
		begin_loading({
			directory : "js"
		})
	} else {
		var require_js_script
		require_js_script        = document.createElement("script")
		require_js_script.src    = nebula.current_package.path +"/require.js"
		require_js_script.onload = function () {
			begin_loading()
		}
		document.head.appendChild(require_js_script)
	}

	return nebula

})( window.nebula || {} )
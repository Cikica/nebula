window.nebula = (function ( nebula ) {

	var begin_loading = function () {

		requirejs([ 
			"js/get", 
			"js/nebula", 
			"js/configuration"
		], function ( get, nebula, configuration ) {

			var sorter
			sorter = nebula.make()
			
			sorter.module_is_loading({
				called : configuration.name
			})

			sorter.call_this_method_upon_load_completion( function ( instructions ) {
				get.require_package_modules( instructions )
			})

			get.make( configuration, sorter )

			sorter.module_has_loaded({
				called   : configuration.name,
				returned : [].concat( configuration.main, configuration.module )
			})
		})
	}

	if ( typeof window.define === 'function' && window.define.amd) {
		begin_loading( )
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
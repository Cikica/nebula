window.nebula = (function ( nebula ) {
	
	if ( !nebula ) { 
		nebula = {
			map     : {},
			actions : {
				module_is_loading : function ( module ) { 
					nebula.map[module.called] = null
				},
				module_has_loaded : function ( module ) {
					nebula.map[module.called] = module.returned
					if ( this.is_module_loading_done() ) {
						nebula.load_completion_method({
							map         : nebula.map,
							set_modules : function () {
								
							}
						})
					}
				},
				is_module_loading_done : function () {

					var is_loading_done = true

					for ( module_name in nebula.map ) {
						if ( nebula.map[module_name] === null ) {
							is_loading_done = false
						}
					}

					return is_loading_done
				},
				call_this_method_upon_load_completion : function ( method ) { 
					nebula.load_completion_method = method
				}
			}
		}
	}

	var load_package = function () { 
		nebula.actions.module_is_loading({
			called : "main" 
		})
		requirejs([
			"js/get",
			"js/configuration"
		], function ( get, configuration ) {
			
			nebula.actions.call_this_method_upon_load_completion( function ( instructions ) {
				get.load( instructions )
			})

			get.make( configuration, nebula.actions )
			nebula.actions.module_has_loaded({
				called   : "main", 
				returned : [].concat( configuration.main, configuration.module )
			})

		})
	}

	if ( typeof window.define === 'function' && window.define.amd) {
		load_package()
	} else {
		var require_js_script
		require_js_script        = document.createElement("script")
		require_js_script.src    = nebula.current_package.path +"/require.js"
		require_js_script.onload = function () {
			load_package()
		}
		document.head.appendChild(require_js_script)
	}

	return nebula

})( window.nebula || false )
window.nebula = (function ( nebula ) {
	
	if ( !nebula ) { 
		nebula = {
			entry : {},
			current_package : {
				name : "entry",
				path : "js",
				root : {}
			}
		}
		nebula.current_package.root = nebula
	}

	var load_package = function () { 
		requirejs( [ 
			nebula.current_package.path +"/get",
			nebula.current_package.path +"/configuration"
		], function ( get, configuration ) {
			nebula.current_package.root[nebula.current_package.name] = get.make( configuration )
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
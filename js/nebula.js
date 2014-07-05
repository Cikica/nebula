define({
	make    : function () { 
		
	},
	methods : {
		module_is_loading : function ( module ) { 
			nebula.modules[module.called] = null
		},
		module_has_loaded : function ( module ) {
			nebula.modules[module.called] = module.returned
			if ( this.is_module_loading_done() ) {
				nebula.load_completion_method(nebula.modules)
			}
		},
		is_module_loading_done : function () {

			var is_loading_done = true

			for ( module_name in nebula.modules ) {
				if ( nebula.modules[module_name] === null ) {
					is_loading_done = false
				}
			}

			return is_loading_done
		},
		call_this_method_upon_load_completion : function ( method ) { 
			nebula.load_completion_method = method
		}
	}
});
define({
	
	define : { 
		allow   : "*",
		require : [
			"test_package"
		]
	},

	make_test : function (  ) {
		console.log("make test")
	}
})
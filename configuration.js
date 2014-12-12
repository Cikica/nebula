define({
	style  : "style/test_style_one",
	name   : "main",
	main   : "main",
	start  : { 
		base : {
			file : "",
			with : "",
		},
		test : {}
	},
	non_amd : [
		{ 
			module  : "library/ss",
			adapter : "library/ss2",
		}
	],
	module  : [
		// "library/test",
	],
	package : [
		// "library/test_package",
		// "library/test_package2",
	]
})
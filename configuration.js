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
	module : [
		"library/test"
	],
	package : [
		"library/test_package",
		"library/test_package2"
	]
})
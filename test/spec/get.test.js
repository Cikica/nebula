
var module, hash_map, module_by_name_map
module   = window.manager
hash_map = {
	"js/node_maker"             : {},
	"js/morph"                  : {},
	"js/node_maker/morph"       : {},
	"js/node_maker/other/morph" : {},
}
module_by_name_map = {
	"morph" : {
		"js/morph"                  : "module:js/morph",
		"js/node_maker/morph"       : "module:js/node_maker/morph",
		"js/node_maker/other/morph" : "module:js/node_maker/other/morph",
	},
	"node_maker" : {
		"js/node_maker"             : "module:js/node_maker",
	}
}

describe("get path directory ", function() {

	it("gets the path directory from a path", function() {
		expect( module.get_path_directory( "js/stuff/folder/stuff" ) ).toBe( "js/stuff/folder" )
	})

	it("returns null if the path has no directory specified", function() {
		expect( module.get_path_directory( "js.js" ) ).toBe( null )	
	})
})

describe("get the closest library version for module based on its location", function() {

	it("finds the first closest library version", function() {
		expect( module.get_the_closest_library_version_for_module_based_on_its_location({
			library      : module_by_name_map.morph,
			location     : "js/node_maker",
			name         : "morph"
		})).toEqual({
			path   : "js/node_maker/morph",
			object : module_by_name_map.morph["js/node_maker/morph"]
		})
	})

	it("finds the later closest library verison for module based on its location", function() {
		expect( module.get_the_closest_library_version_for_module_based_on_its_location({
			library      : module_by_name_map.morph,
			location     : "js/node_maker/other/somethingelse/some",
			name         : "morph"
		})).toEqual({
			path   : "js/node_maker/other/morph",
			object : module_by_name_map.morph["js/node_maker/other/morph"] 
		})	
	})

	it("finds the closest library verison for module based on its location in an unrelated context", function() {
		expect( module.get_the_closest_library_version_for_module_based_on_its_location({
			library      : module_by_name_map.morph,
			location     : "js/node_maker/some",
			name         : "morph"
		})).toEqual({ 
			path   : "js/node_maker/morph",
			object : module_by_name_map.morph["js/node_maker/morph"]
		})	
	})
	// supposed to test the error buts its being a punk
	// it("throws a fit if the module could not be found in the lexical scope of the file", function() {
	// 	expect(module.get_the_closest_library_version_for_module_based_on_its_location({
	// 		library      : module_by_name_map.morph,
	// 		location     : "js/node_maker/some",
	// 		name         : "some_stuff"
	// 	})).toThrow()
	// })

	// need to test here better
})

describe("gets module from library if it exists", function() {
	
	it("extracts the module", function() {
		expect( module.get_module_from_library_if_it_exists({
			library  : module_by_name_map,
			location : "js/node_maker",
			name     : "morph"
		})).toEqual({
			path   : "js/node_maker/morph",
			object : module_by_name_map.morph["js/node_maker/morph"]
		})
	})

	it("returns false if module does not exist", function() {
		expect( module.get_module_from_library_if_it_exists({
			library  : module_by_name_map,
			location : "js/node_maker",
			name     : "some_module"
		})).toBe( false )
	})
})

describe("remove the last member of an array and return the leftovers", function() {
	it("does what it says on the box", function() {
		expect( module.remove_last_member_of_array_and_return_leftover( 
			[1,2,3] ) 
		).toEqual( [1,2] )

		expect( 
			module.remove_last_member_of_array_and_return_leftover( [1] ) 
		).toEqual( [] )
	})
})

describe("get required modules from map by name", function() {
	it("return the desired modules", function() {
		expect(module.get_required_modules_from_map_by_name({
			require     : ["morph", "node_maker"],
			into        : {
				name   : [],
				module : []
			},
			location    : "js/node_maker",
			map_by_name : module_by_name_map,
		})).toEqual({
			name   : [
				"node_maker",
				"morph"
			],
			module : [
				{
					path   : "js/node_maker",
					object : "module:js/node_maker"
				},
				{
					path   : "js/node_maker/morph",
					object : "module:js/node_maker/morph"
				}
			]
		})
	})	
})

describe( "get an object from combining two arrays", function() {
	it("combines two arrays", function() {
		expect(module.get_an_object_from_combining_two_arrays({
			key   : ["a", "b"],
			value : ["1", "2"] 
		})).toEqual({
			"a" : "1",
			"b" : "2"
		})
	})

	it("has reference when combining a value of objects", function() {
		var value, key, result
		key    = ["a", "b"]
		value  = [{ a : 1 }, { b : 2 }]
		result = module.get_an_object_from_combining_two_arrays({
			key   : key,
			value : value,
		})
		expect(result["a"]).toBe(value[0])
	})

	it("has no reference when combining an value of arrays", function() {
		var value, key, result
		key    = ["a", "b"]
		value  = [["stuff", "1"], { b : 2 }]
		result = module.get_an_object_from_combining_two_arrays({
			key   : key,
			value : value,
		})
		expect(result["a"]).not.toBe(value[0])	
	})
})

describe("get required modules as module library based on definition", function() {

	it("returns an empty object if there are no modules required", function() {
		expect( module.get_required_modules_as_a_module_library_based_on_definition({
			define : {
				require : []
			},
			map_by_name : module_by_name_map
		})).toEqual({})
	})

	it("returns an empty object if the require key of the definition is not specified", function() {
		expect( module.get_required_modules_as_a_module_library_based_on_definition({
			define  : {
			},
		})).toEqual( {} )
	})

	it("retruns the desired modules", function() {
		expect( module.get_required_modules_as_a_module_library_based_on_definition({
			define  : {
				require : ["morph", "node_maker"]
			},
			location    : "js/node_maker",
			map_by_name : module_by_name_map,
		})).toEqual({
			"node_maker" : {
				path   : "js/node_maker",
				object : "module:js/node_maker"
			},
			"morph"      : {
				path   : "js/node_maker/morph",
				object : "module:js/node_maker/morph"
			}
		})	
	})
})

describe("is path allowed to access module", function() {

	it("has a default notatation that comes down to \".\" local notation", function() {
		expect(module.is_path_allowed_to_access_module({
			path   : "js/path/main",
			module : {
				location   : "js/path/stuff"
			}
		})).toBe(true)

		expect(module.is_path_allowed_to_access_module({
			path   : "js/stuff/main",
			module : {
				location   : "js/path/stuff"
			}
		})).toBe(false)	
	})

	it("understands the \"*\" global notation", function() {
		expect(module.is_path_allowed_to_access_module({
			path   : "js/path/main",
			module : {
				location   : "js/path/stuff",
				premission : "*"
			}
		})).toEqual(true)
	})

	it("understands the \".\" local notation", function() {
		expect(module.is_path_allowed_to_access_module({
			path   : "js/path/main",
			module : {
				location   : "js/path/stuff",
				premission : "."
			}
		})).toBe(true)

		expect(module.is_path_allowed_to_access_module({
			path   : "js/stuff/main",
			module : {
				location   : "js/path/stuff",
				premission : "."
			}
		})).toBe(false)
	})

	it("understands the \">\" children only notation", function() {

		expect(module.is_path_allowed_to_access_module({
			path   : "js/path/some/folder/main",
			module : {
				location   : "js/path/stuff",
				premission : ">"
			}
		})).toBe(true)

		expect(module.is_path_allowed_to_access_module({
			path   : "js/path/some/folder/main",
			module : {
				location   : "js/",
				premission : ">"
			}
		})).toBe(true)

		expect(module.is_path_allowed_to_access_module({
			path : "js/node_maker",
			module : { 
				location   : "js/node_maker/morph",
				premission : ">"
			}
		})).toBe(false)

		expect(module.is_path_allowed_to_access_module({
			path   : "js/folder/main",
			module : {
				location   : "js/path/stuff",
				premission : ">"
			}
		})).toBe(false)

		expect(module.is_path_allowed_to_access_module({
			path   : "js/main",
			module : {
				location   : "js/path/stuff",
				premission : ">"
			}
		})).toBe(false)
	})

	it("understands the \"module_name\" notation ", function() {

		expect(module.is_path_allowed_to_access_module({
			path   : "js/path/main",
			module : {
				location   : "js/path/stuff",
				premission : "main"
			}
		})).toBe(true)

		expect(module.is_path_allowed_to_access_module({
			path   : "js/path/some_name",
			module : {
				location   : "js/path/stuff",
				premission : "main"
			}
		})).toBe(false)

		expect(module.is_path_allowed_to_access_module({
			path   : "js/some_name",
			module : {
				location   : "js/path/stuff",
				premission : "main"
			}
		})).toBe(false)
	})
})

describe("get modules which are allowed from library based on location", function() {
	it("it gets the desired modules discards the others", function() {
		expect(module.get_modules_which_are_allowed_from_library_based_on_location({
			path    : "js/node_maker",
			library : {
				"node_maker" : {
					path   : "js/node_maker",
					object : {
						define : {
							allow : "."
						},
						stuff : "ss"
					}
				},
				"morph"      : {
					path   : "js/node_maker/morph",
					object : {
						define : {
							allow : "."
						}
					}
				}
			},
		})).toEqual({
			"node_maker" : {
				define : {
					allow : "."
				},
				stuff : "ss"
			}
		})
	})

	it("it gets all the modules", function() {
		expect(module.get_modules_which_are_allowed_from_library_based_on_location({
			path    : "js/node_maker",
			library : {
				"node_maker" : {
					path   : "js/node_maker",
					object : {
						define : {
							allow : "."
						},
						stuff : "ss"
					}
				},
				"morph"      : {
					path   : "js/node_maker/morph",
					object : {
						define : {
							allow : "*"
						}
					}
				}
			},
		})).toEqual({
			"node_maker" : {
				define : {
					allow : "."
				},
				stuff : "ss"
			},
			"morph" : {
				define : {
					allow : "*"
				}
			}
		})
	})

	it("gets none of the modules for they art invalid", function() {
		expect(module.get_modules_which_are_allowed_from_library_based_on_location({
			path    : "js/node_maker",
			library : {
				"node_maker" : {
					path   : "js/node_maker",
					object : {
						define : {
							allow : "some_name"
						},
						stuff : "ss"
					}
				},
				"morph"      : {
					path   : "js/node_maker/morph",
					object : {
						define : {
							allow : ">"
						}
					}
				}
			},
		})).toEqual({})		
	})
})
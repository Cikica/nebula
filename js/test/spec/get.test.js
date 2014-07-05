
var module, hash_map, module_by_name_map
module   = window.manager
hash_map = {
	"js/node_maker" : {},
	"js/nm/morph"   : {}
}
module_by_name_map = {
	"morph" : {
		"js/morph"                  : "module:js/morph",
		"js/node_maker/morph"       : "module:js/node_maker/morph",
		"js/node_maker/other/morph" : "module:js/node_maker/other/morph",
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
		})).toEqual( module_by_name_map.morph["js/node_maker/morph"] )
	})

	it("finds the later closest library verison for module based on its location", function() {
		expect( module.get_the_closest_library_version_for_module_based_on_its_location({
			library      : module_by_name_map.morph,
			location     : "js/node_maker/other/somethingelse/some",
			name         : "morph"
		})).toEqual( module_by_name_map.morph["js/node_maker/other/morph"] )	
	})

	it("finds the closest library verison for module based on its location in an unrelated context", function() {
		expect( module.get_the_closest_library_version_for_module_based_on_its_location({
			library      : module_by_name_map.morph,
			location     : "js/node_maker/some",
			name         : "morph"
		})).toEqual( module_by_name_map.morph["js/node_maker/morph"] )	
	})
})

describe("gets module from library if it exists", function() {
	
	it("extracts the module", function() {
		expect( module.get_module_from_library_if_it_exists({
			library  : module_by_name_map,
			location : "js/node_maker",
			name     : "morph"
		})).toBe( module_by_name_map.morph["js/node_maker/morph"] )
	})

	it("returns false if module does not exist", function() {
		expect( module.get_module_from_library_if_it_exists({
			library  : module_by_name_map,
			location : "js/node_maker",
			name     : "some_module"
		})).toBe( false )
	})
})
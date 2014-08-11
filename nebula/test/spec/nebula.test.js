var nebula

nebula = window.nebula_object

describe("create updated load completion map", function() {
	it("updates based on single load", function() {
		expect(nebula.create_updated_load_completion_map({
			path : "main/name/name",
			map  : {
				path   : [
					"some/name",
					"main/name/name",
					"main/some/some"
				],
				load : [
					false,
					false,
					false
				]
			}
		})).toEqual({
			path   : [
				"some/name",
				"main/name/name",
				"main/some/some"
			],
			load : [
				false,
				true,
				false
			]
		})
	})
})


describe("create load completion map", function() {
	it("creates a pure map from given to load modules", function() {
		expect(nebula.create_load_completion_map({
			module : [
				"some/name",
				"main/name/name",
				"main/some/some"
			],
		})).toEqual({
			path   : [
				"some/name",
				"main/name/name",
				"main/some/some"
			],
			load : [
				false,
				false,
				false
			]
		})
	})
	it("creates a map from an existing one", function() {
		expect(nebula.create_load_completion_map({
			module : [
				"some/name",
				"main/name/name"
			],
			added : [
				"main/some/some"
			]
		})).toEqual({
			path   : [
				"some/name",
				"main/name/name",
				"main/some/some"
			],
			load : [
				false,
				false,
				false
			]
		})		
	})
})
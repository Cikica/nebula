Nebula
======

*Unification*

Javascript module framework

## Development ##

**Order Of Behaviour**
- load entry file
- get require js 
- load tools 
- load all configurations 
- load all files
- initate

**Nebula Module Roles**
- entry : The entry point of the app, checks if requirejs is loaded, if not it does it, includes the bellow tools with it, then afterwards calls the make of the make.js.
- make : Called straight after the entry, it puts everything together.
- get  : Statefull loading of files, configuration, and modules, style
- sort : Stateless sorting library used to get things done for the get.js when its loading and sorting the modules
- nebula : Creates the central object which helps keep track of configuration loading and discovery, with a final call back to make sense of all that jibber jabber.
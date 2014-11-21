Nebula
======

*Nothing Ever Becomes United Left Alone*

*Unification*

**Were At Version Alpha7**

- What Is Nebula
- How Nebula Works
- Getting Started With Nebula
- Philosophy Behind

## What Is Nebula

Nebula is a Package Manager Framework. It allows easy inclusion of .js files and packages, which can then be used from within any module 
in your application.

It is designed to be neat, simple and infinite. 

Infinite meaning that any package may be made up of any number of packages which are made up of packages, all the way to the root of your application, which too is a package, that may be included by other application which may wish to use it as a package.

The purpose of Nebula is to make everything reusable and convenient to include.

## How Nebula Works

Nebula works based on the package definition that it follows, which allows it to be recursive.

## Getting Started With Nebula

## How It Works

*A few qick definitions*

**module** *means* a single file whose logic is wraped in a define()

**package** *means* a directory which is a collection of modules, and has ( at least ) configuration.js, and a main module

#### Including Nebula In A Page ####

To create a nebula app you simply point to the **"entry.js"** file inside your root packages nebula directory.

You will only ever need to include **entry.js** to start you app, never more.

```html
<html>
    <head>
        <script
            src="your_root_package/nebula/entry.js">
        </script>
    </head>
    <body>
    </body>
</html>
```

#### Package Folder Structure ####

Every package must have a **configuration.js** file and a main module otherwise refered to as **package entry**.

The **package entry** can be called any name, as it is included though 
**configuration.js**. Natrually these two are mandatory, because without a package definition ( configuration.js ) and a module to provide its workings ( package entry ) there can be no package.

The **nebula** directory is the nebula module manager logic which handles everything that is necessary for the inclusion of modules and package.

This is not necessary if you never intend for you package to be ever used as a root package.

``` 
package >
    configuration.js
    main.js 
    nebula/
    ...any folders or files that you may want to include
```

#### Package Configuration File

```javascript
define({
    // Optional, include styles along with your packages
    style   : String || Array( String ),
    // Mandatory, the name of the package 
    // the name should be the same as the name of the package entry module
    name    : String,
    // Mandatory, The path to the package entry module
    main    : String,
    // Optional, How the package should be initated, only valid if it is the 
    // root package, this part is in rapid flux, thus i shant wirte any 
    // docs regarding it yet
    start   : Object,
    // Optional,Paths to any modules you want loaded, the .js extention is 
    // not necessary
    module  : Array( String ),
    // Optional, Paths to any packages you want loaded
    package : Array( String )
})
```

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
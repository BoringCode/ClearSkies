#[Clear Skies](http://clearskiesapp.com) <img src="http://bradleyrosenfeld.com/ClearSkies/icon/favicon-96x96.png" alt="Icon" align="right" height="64"/>

> Does the world need another weather app? Yes!
>
  The functional goals of this project are to create a clean, well designed weather app that runs on any device with a web browser. When possible the app should allow the user to install it on their device to provide a native-like experience. The other big feature is the "optimistic" nature of the app. Clear, "look at the bright side" descriptions of the current weather conditions that will help the user decide how to prepare for the upcoming hour or day.

##Installation

This project uses [Node Package Manager](http://nodejs.org/) and [Grunt](http://gruntjs.com) to handle builds.

**Install prequisites**

```shell
npm install
```

###Development Build
_Run with `grunt`_

Automatically creates a livereload server and outputs non-minified JS files from `src/`.

###Production Build
_Run with `grunt build`_

Minifies and concats all files from `src/` and moves to `build/` for production.

###Deployment
_Run with `grunt production`_

Runs build, copies to `production/`, and pushes to `gh-pages` branch.


##Development

**Folder structure**

```
ClearSkies/
..../build
......../css
......../js
......../fonts
............/Chunkfive
............/SourceSansPro
............/climacons
............/icons
......../icon
......../splash
..../src
......../js
............/dependencies
............/controllers
............/directives
............/factories
............/filters
......../css
..../production (not tracked by version control)
```

Development is done in `src/`

====

_&copy; 2014 Bradley Rosenfeld_

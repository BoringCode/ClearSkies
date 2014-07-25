#Clear Skies <img src="https://raw.githubusercontent.com/BoringCode/ClearSkies/master/dev/icon/favicon-96x96.png?token=938452__eyJzY29wZSI6IlJhd0Jsb2I6Qm9yaW5nQ29kZS9DbGVhclNraWVzL21hc3Rlci9kZXYvaWNvbi9mYXZpY29uLTk2eDk2LnBuZyIsImV4cGlyZXMiOjE0MDY4OTk5NTB9--f07ae8feba896a0c9a70860ef60d01c966fa0cdf" alt="Icon" align="right" height="64"/>

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

Minifies and concats all files from `src/` for production.

###Deployment
_Run with `grunt dist`_

Runs build, copies to `dist/`, and pushes to `gh-pages` branch.


##Development

**Folder structure**

```
ClearSkies/
..../dev
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
............/includes
......../css
..../dist (not tracked by version control)
```

Development is done in `src/`

====

_&copy; 2014 Bradley Rosenfeld_

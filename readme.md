#Clear Skies

> Does the world need another weather app? Why are you being so pessimistic?

##Installation

This project uses [Node Package Manager](http://nodejs.org/) and [Grunt](http://gruntjs.com) to handle builds.

Install prequisites:

```shell
npm install
```

####Development Build
_Run with `grunt`_

Automatically creates a livereload server and outputs non-minified JS files from `src/`.

####Production Build
_Run with `grunt build`_

Minifies all files from `src/` for production.

####Deployment
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
......../css
..../dist (not tracked by version control)
```

Development is done in `src/`

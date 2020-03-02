![](https://img.shields.io/badge/dependencies-none-green) ![CircleCI](https://circleci.com/gh/flagmeister/flagmeister.github.io.svg?style=shield)

# 300+ SVG Flags in one Custom Element/Web Component

## https://flagmeister.github.io
## https://flagmeister.github.io/documentation.html

```html
  <html>
    <head>
        <script src='elements.flagmeister.min.js'></script>
    </head>
    <body>
      <img is=flag-nl>
      <img is=flag-zw>
      <img is=flag-ke>
      <img is=flag-kr>

      <img is=flag-es>
      <img is=flag-aq>
      <img is=flag-nz>
      <img is=flag-jollyroger>
    </body>
  </html>
```

![](https://i.imgur.com/oT49woV.jpg)

## Errors and missing flags

There is no single truth on SVG flags. All flag sites out in the wild have errors. The most popular one [flag-icon-css](http://flag-icon-css.lip.is/) has many incorrect colors. Some are missing details in flags.

* I first built a tool to analyze all SVG flags out there: [documentation.html#FlagMeisterAnalyzeFlags](https://flagmeister.github.io/documentation.html?flag=jollyroger#FlagMeisterAnalyzeFlags)

* copied all SVG flags into one file

* corrected all SVG to Viewbox 640x480

* removed bloated SVG

* rewrote all repeating SVG to JavaScript functions generating SVG

* rewrote all SVG JavaScript functions to parse Strings (better for minification and performance)

* wrote a parser to convert Strings to SVG (when you use 1 flag only 1 SVG flag is generated)

**The final result is a single 26KB (GZip) Custom Element/Web Component file**

## a (Lipis) SVG flag:
``
<svg xmlns="http://www.w3.org/2000/svg" id="flag-icon-css-bh" viewBox="0 0 640 480">
  <defs>
    <clipPath id="a">
      <path fill-opacity=".7" d="M0 0h640v480H0z"/>
    </clipPath>
  </defs>
  <g fill-rule="evenodd" stroke-width="1pt" clip-path="url(#a)">
    <path fill="#e10011" d="M-32.5 0h720v480h-720z"/>
    <path fill="#fff" d="M114.3 479.8l-146.8.2V0h146l94.3 30.4-93.5 29.5 93.5 30.5-93.5 29.5 93.5 30.5-93.5 29.5 93.5 30.5-93.5 29.5 93.5 30.5-93.5 29.5 93.5 30.5-93.5 29.5 93.5 30.5-93.5 29.5 93.5 30.5-93.5 29.5"/>
  </g>
</svg>
``

### Becomes FlagMeistered:

``
bgcolor:#e10011;path:#fff,m114 480l-146 1V0h180l94 48-99 48 99 48-99 48 99 48-99 48 99 48-99 48 99 48-99 48 99
``

<hr>

# https://flagmeister.github.io
# https://flagmeister.github.io/documentation.html

# Resources Used

### Flags

* Flags of the World - https://flags.dsgn.it/ - https://github.com/cedmax/flags

* flag-icon-css - **alas almost all colors are wrong** - http://flag-icon-css.lip.is/

* Kent - https://github.com/kent1D/svg-flags

* Nillson - http://hjnilsson.github.io/country-flags/

* FlagKit - https://github.com/madebybowtie/FlagKit 

* React Flags - Used:143 - 1.3 **MB** GZipped bundle - https://github.com/smucode/react-world-flags

* React SVG flags - Used:131 - https://github.com/wiredmax/react-flags/tree/master/vendor/flags/flags-iso/flat/svg

* Pure CSS flags - https://codepen.io/hagenburger/pen/wnkDo

* Emoji flags 
  * http://ellekasai.github.io/twemoji-awesome/
  * US flag: https://twemoji.maxcdn.com/2/svg/1f1fa-1f1f8.svg
  * JSON https://github.com/amio/emoji.json

* WHy not to use flags for languages - http://jkorpela.fi/flags.html

### Countries

* World Countries in JSON format - http://stefangabos.github.io/world_countries/

### SVG

* __Edit SVG paths - https://aydos.com/svgedit/__
* https://codepen.io/tigt/post/optimizing-svgs-in-data-uris
* https://jakearchibald.github.io/svgomg/
* Scaling SVG https://css-tricks.com/scale-svg/
* Edit SVG paths - https://css-tricks.com/tools-visualize-edit-svg-paths-kinda/

### SVG Filters, Masks, Clip

* SVG shapes - http://www.kelvinlawrence.net/svg/index.html
* https://tympanus.net/codrops/2019/01/15/svg-filters-101/
* http://www.svgbasics.com/filters2.html
* Square lighting : http://jsfiddle.net/p015w43j/

* https://developer.mozilla.org/en-US/docs/Web/SVG/Tutorial/Filter_effects

* https://vanseodesign.com/web-design/svg-clipping-path-examples-1/

* !! https://css-tricks.com/animate-blob-text-with-svg-text-clipping/

* https://1stwebdesigner.com/svg-filter-resources-and-demos/

* https://tympanus.net/codrops/2019/02/12/svg-filter-effects-conforming-text-to-surface-texture-with-fedisplacementmap/

#### CSS clip path

* https://css-tricks.com/almanac/properties/c/clip/
* https://css-playground.com/view/65/clipping-paths-with-clip-path

* preserveAspectRatio: https://jsfiddle.net/api/mdn/ - https://developer.mozilla.org/en-US/docs/Web/SVG/Attribute/preserveAspectRatio

* feDiffuseLightning: https://developer.mozilla.org/en-US/docs/Web/SVG/Element/feDiffuseLighting


### Color

* https://www.schemecolor.com/?s=flag+colors
* https://www.schemecolor.com/color/country-flag
* Extrac colors from image - https://labs.tineye.com/color/

## Language selectors

### Ali Baba - 67 KB

https://s.alicdn.com/@g/sc/header-footer/0.0.14/sc-header-footer/$node_modules/@alife/alpha-icon/src/img/sprites/69221370.png

### Apple individual images 176 KB

https://www.apple.com/choose-country-region/



## Code Fragments

```
sed -i -ne '/<!-- BEGIN -->/ {p; r FILE1.EXT' -e ':a; n; /<!-- END -->/ {p; b}; ba}; p' OUTPUT.EXT
```

### Lipis SVG format error (when replacing double quotes with single quote)

https://github.com/lipis/flag-icon-css/search?q=Linux

``
.replace("-inkscape-font-specification:'Linux Biolinum Bold';", '')
``

### Waving flags

* https://www.behance.net/gallery/67823157/Animated-SVG-Polychromatic-Flag
* https://krikienoid.github.io/flagwaver/

## TODO

<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" id="flag-icon-css-al" viewBox="0 0 640 480">
  <path fill="#e41e20" d="M0 0h640v480H0z"/>
  <path id="a" d="M272 93c-4 0-12 1-12 5-13-2-14 3-13 8 1-2 3-3 4-3 2-0 3.5.3 5 1a22 22 0 0 1 5 4c-5 1-8.2.4-12-0a16 16 0 0 1-6-2c-1-1-2-2-4-4-3-3-6-2-5 2 2 4 6 6 10 7 2.1.3 5 1 9 1 4 0 8-.5 9 0-1.3.8-3 2-6 2.8-3 1-7-2-10-2.4.3 2 3 4 9 6 9 2 17 4 23 6a37 37 0 0 1 11 9c5 5 5 9 5 11 1 9-2 14-8 15-2.8.7-8-.7-9.8-3-2-2.2-3.7-6-3-12 .5-2 3-8.3.9-9.5a274 274 0 0 0-32-15c-2-1-4 2-5 4a50 50 0 0 1-36-24c-4-8-11 0-10 7 2 8 8 14 15 18 7 4 17 8 26 8 5 1 5 7-1 9-12 0-22-1-31-9-7-6-11 1-8.8 5 3 13 22 17 41 13 7-1 3 7 1 7-8 6-22 11-35 0-6-4-9-1-7 5 5 16 27 13 41 5 4-2 7 3 3 6-18 13-27 13-35 8-10-4-11 7-5 11 7 4 24 1 36-7 5-4 6 2 2 5-15 13-21 16-36 14-8-1-8 9-2 13 8 5 24-3 37-14 5-3 6 2 4 7a54 54 0 0 1-22 18c-7 3-14 2-18.3.7-6-2-6 4-3 9 2 3 9 4.3 18 1 9-3 18-10 24-18 5-5 5 2 2 6-13 20-24 27-39 26-7-1-8 4-4 9 8 6 17 6 25-0 7-7 21-22 28-30 5-4 6.9 0 5 8-1 5-5 10-14 14-6 4-2 9 3 9 3 0 8-3 12-8 5-6 6-10 9-20 9-5 8-2 8 2-2 9-4 11-9 15-4 4 3 6 6 4 7-5 10-12 13.2-18.2 2-4.4 7.4-2.3 4.8 5-6 17.4-16 24.2-33.3 27.8-1.7.3-2.8 1.3-2.2 3.3l7 7c-10.7 3.2-19.4 5-30.2 8l-14.8-9.8c-1.3-3.2-2-8.2-9.8-4.7-5.2-2.4-7.7-1.5-10.6 1 4.2 0 6 1.2 7.7 3.1 2.2 5.7 7.2 6.3 12.3 4.7 3.3 2.7 5 4.9 8.4 7.7l-16.7-.5c-6-6.3-10.6-6-14.8-1-3.3.5-4.6.5-6.8 4.4 3.4-1.4 5.6-1.8 7.1-.3 6.3 3.7 10.4 2.9 13.5 0l17.5 1.1c-2.2 2-5.2 3-7.5 4.8-9-2.6-13.8 1-15.4 8.3a17 17 0 0 0-1.2 9.3c.8-3 2.3-5.5 4.9-7 8 2 11-1.3 11.5-6.1 4-3.2 9.8-3.9 13.7-7.1 4.6 1.4 6.8 2.3 11.4 3.8 1.6 5 5.3 6.9 11.3 5.6 7 .2 5.8 3.2 6.4 5.5 2-3.3 1.9-6.6-2.5-9.6-1.6-4.3-5.2-6.3-9.8-3.8-4.4-1.2-5.5-3-9.9-4.3 11-3.5 18.8-4.3 29.8-7.8l7.7 6.8c1.5.9 2.9 1.1 3.8 0 6.9-10 10-18.7 16.3-25.3 2.5-2.8 5.6-6.4 9-7.3 1.7-.5 3.8-.2 5.2 1.3 1.3 1.4 2.4 4.1 2 8.2-.7 5.7-2.1 7.6-3.7 11-1.7 3.5-3.6 5.6-5.7 8.3-4 5.3-9.4 8.4-12.6 10.5-6.4 4.1-9 2.3-14 2-6.4.7-8 3.8-2.8 8.1 4.8 2.6 9.2 2.9 12.8 2.2 3-.6 6.6-4.5 9.2-6.6 2.8-3.3 7.6.6 4.3 4.5-5.9 7-11.7 11.6-19 11.5-7.7 1-6.2 5.3-1.2 7.4 9.2 3.7 17.4-3.3 21.6-8 3.2-3.5 5.5-3.6 5 1.9-3.3 9.9-7.6 13.7-14.8 14.2-5.8-.6-5.9 4-1.6 7 9.6 6.6 16.6-4.8 19.9-11.6 2.3-6.2 5.9-3.3 6.3 1.8 0 6.9-3 12.4-11.3 19.4 6.3 10.1 13.7 20.4 20 30.5l19.2-214L320 139c-2-1.8-8.8-9.8-10.5-11-.7-.6-1-1-.1-1.4.9-.4 3-.8 4.5-1-4-4.1-7.6-5.4-15.3-7.6 1.9-.8 3.7-.4 9.3-.6a30.2 30.2 0 0 0-13.5-10.2c4.2-3 5-3.2 9.2-6.7a86.3 86.3 0 0 1-19.5-3.8 37.4 37.4 0 0 0-12-3.4zm.8 8.4c3.8 0 6.1 1.3 6.1 2.9 0 1.6-2.3 2.9-6.1 2.9s-6.2-1.5-6.2-3c0-1.6 2.4-2.8 6.2-2.8z"/>
  <use width="100%" height="100%" transform="matrix(-1 0 0 1 640 0)" xlink:href="#a"/>
</svg>
Published: 2020-03-02 10:21 

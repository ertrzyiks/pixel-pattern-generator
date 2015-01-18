# Pixel pattern 

[![Build Status](https://travis-ci.org/ertrzyiks/pixel-pattern-generator.svg?branch=master)](https://travis-ci.org/ertrzyiks/pixel-pattern-generator)

Utility created to ease maintenance of pixel pattern figures

## Requirements/support

Less v1.6.0+

Tested and works in browsers:
- Chrome
- Safari 5+
- Firefox
- Opera
- IE9+

Additionally with Javascript fallback
- IE6+

## Install

### with bower
    
```bash
bower install pixel-pattern-generator --save-dev
```
    
### with git

```bash
git clone git@github.com:ertrzyiks/pixel-pattern-generator.git
```
## Usage

Use mixin to set size of pixel and assign color to chosen coordinates

```less
.pixelart-myawesomesquare{
  .pixel-pattern-size(50px);

  .pixel-pattern(
    0 0 red, 
    0 1 blue, 
    1 0 green, 
    1 1 yellow
  );
}
```

then put somewhere in page content following html

```html
<div class="pixel-pattern pixelart-myawesomesquare">
    <div class="pixel-pattern-pixel"></div>
</div>
```

## Fallback

When you need better browser support than box-shadow compatible, you can use javascript fallback. 
First, insert fallback script

```html
<script src="js/pixel-pattern-generator.min.js"></script>
```

then give your pixel html element id and initialize fallback using PPG.init function.

```html
<div class="pixel-pattern pixelart-myawesomesquare">
    <div class="pixel-pattern-pixel"></div>
</div>
<script>
PPG.init();
</script>
```

If will automatically detect if fallback is necessary. In modern browser this function do nothing.

## License

Copyright (c) 2014-2015, Mateusz Derks. (MIT License)

See LICENSE for more info.

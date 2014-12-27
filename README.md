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

## Install

### with bower
    
```bash
bower install pixel-pattern-generator
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

## License

Copyright (c) 2014, Mateusz Derks. (MIT License)

See LICENSE for more info.

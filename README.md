# Pixel pattern

> Utility created to ease maintenance of pixel pattern figures

## Install

Copy src folder to your project.

## Usage

Use mixin to set size of pixel and assing color to chosen coordinates

```less
.pixelart-myawesomesquare{
  .pixel-pattern-size(50px);

  .pixel-pattern(
    0 0 red, 
    0 1 blue, 
    1 0 greed, 
    1 1 yellow
  );
}
```

## License

Copyright (c) 2014, Mateusz Derks. (MIT License)

See LICENSE for more info.

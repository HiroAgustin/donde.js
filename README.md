# donde.js

> Simplifies the basic use of Google Maps.

This being:

* Embedding a map.
* Centering to the user's current location.
* Add a set of markers to the map.
* Apply a filter to the markers.

## Installation

Install the library by running: `bower install donde.js --save`.

## Usage

Once you have included the script in your markup, you can run:

```js
new Donde({
  container: 'js-map'
, zoom: 15
, defaultPosition: {
    latitude: -34.8937720817105
  , longitude: -56.1659574508667
  }
, markers: [
    {
      icon: 'img/marker-1.png'
    , type: 'A'
    , position: {
        latitude: -34.790626820565095
      , longitude: -56.352119473107685,
      }
    }
  , {
      icon: 'img/marker-2.png'
    , type: 'B'
    , position: {
        latitude: -34.79742147359551
      , longitude: -56.24659744591109
      }
    }
  ]
});
```

## Options

1. `container` is the id of the DOM element where the map will be rendered.

2. `zoom` is the map's default zoom value.

3. `defaultPosition` is where the map will be centered and the user's marker positioned in case geolocation is unavailable.

4. Markers
    * `icon` is the path to the markers image.
    * `type` is used for the filtering of markers.
    * `position` is the geolocation where the marker should be placed.

## License

[MIT license](https://github.com/HiroAgustin/donde.js/blob/master/LICENSE.md).

<!doctype html>
  <meta charset="UTF-8">
  <title>Donde</title>
  <link rel="stylesheet" href="style.css">
</head>
<body>
  <div id="map"></div>
  <script src="https://maps.googleapis.com/maps/api/js?sensor=true"></script>
  <script src="libraries/underscore-1.4.4.js"></script>
  <script src="donde.js"></script>
  <script>
    new Donde({
      idMap: 'map'
    , zoom: 16
    , markers: (<?php include 'residuos.json' ?>).features
    , errorMessage: 'No sabemos dónde estas :('
    , defaultLocation: {
        latitude: -34.8937720817105
      , longitude: -56.1659574508667
      }
    , icons: {
        LATA: 'img/marker-1.png'
      , PILAS: 'img/marker-2.png'
      , VIDRIO: 'img/marker-3.png'
      , PLASTICO: 'img/marker-4.png'
      }
    , mapping: {
        type: function (item)
        {
          return item.properties.TIPO_RESID;
        }
      , latitude: function (item)
        {
          return item.geometry.coordinates[1];
        }
      , longitude: function (item)
        {
          return item.geometry.coordinates[0];
        }
      }
    }).init();
  </script>
</body>
</html>
<!doctype html>
  <meta charset="UTF-8">
  <title>DóndeEncuentro</title>
  <link rel="stylesheet" href="style.css">
</head>`
<body>
  <div id="map"></div>
  <script src="https://maps.googleapis.com/maps/api/js?sensor=true"></script>
  <!-- this two should be concatenated -->
  <script src="libraries/underscore-min-1.4.4.js"></script>
  <script src="dondeEncuentro.min.js"></script>
  <script>
    new DondeEncuentro({
      idMap: 'map'
    , markers: <?php include 'example.json' ?>
    , defaultLocation: {
        latitude: -34.8937720817105
      , longitude: -56.1659574508667
      }
    , icons: {
        Chupi: 'img/marker-1.png'
      , Baile: 'img/marker-2.png'
      , Morfi: 'img/marker-3.png'
      }
    , errorMessage: 'No sabemos dónde estas :('
    }).init();
  </script>
</body>
</html>
# donde.js v0.3.2

Donde.js es una bibloteca de JavaScript que facilita el uso del servicio GoogleMaps para acciones como:

* Agregar un mapa al sitio.
* Centrar el mapa en la locación actual del usuario.
* Agregar marcadores al mapa.
* Permitir al usuario filtrar los marcadores.

## Instalación

Bajar desde la [pagina del projecto](https://github.com/HiroAgustin/donde.js).

Utilizando [Bower](http://twitter.github.com/bower/): `bower install donde.js`.

## API

La forma más simple del codigo se reduce a: `new Donde(options).init();`
siendo "options" un objecto con cualquiera de los siguientes attributos:

### idMap

Un string con la id del elemento en el cual se va a renderear el mapa.
Por defecto buscamos la id "map": `mapId: 'map'`.

### defaultLocation

En caso de que no se pueda obtener la geo-localización del usuario, el mapa se centrará en base a este objeto.
El mismo debe de tener 2 attributos: "latitude" y "longitude".

Por defecto lo centramos en la terminal de Tres Cruces en Montevideo, Uruguay:

```
defaultLocation: {
  latitude: -34.8937720817105
, longitude: -56.1659574508667
}
```

### markers

Un array de objectos, cada uno va a ser agregado al mapa como un marcador.
Es necesario que contengan la información sobre el lugar a ser colocados.
En caso de querer asociar el marcador a una imagen, debe de tener un "type".

Ejemplo:
```
markers: [
  {latitude: -34.790626820565095, longitude: -56.352119473107685, type: 'Super'}
, {latitude: -34.79742147359551, longitude: -56.24659744591109, type: 'Baile'}
, {latitude: -34.81001579769451, longitude: -56.221292252489484, type: 'Super'}
, {latitude: -34.81661616310021, longitude: -56.13930858324866, type: 'Kiosco'}
  ...
]
```

### mapping

Es posible que la data de los marcadores no se encuentre en el formato deseado, en esos casos
usamos el atributo mapping para mapear los valores de los datos con los requeridos por la bibloteca.

Ejemplo:
```
mapping: {
  latitude: function (marker)
  {
    return marker.geometry.coordinates[1]
  }
, longitude: function (marker)
  {
    return marker.geometry.coordinates[0]
  }
, type: function (marker)
  {
    return item.properties.NAME;
  }
}
```

### search

Es posible realizar una busqueda de lugares de varias formas para que aparezcan las marcas en el mapa. Uno puede buscar por una query, que va a matchear con todos los lugares que tengan ese texto.

Ejemplo:
```
app.searchPlace({
  query: 'estadio'
});
```

También se puede buscar por keyword, a lo que google va a buscar lugares que tengan esa keyword.

Ejemplo:
```
app.searchPlace({
  keyword: 'zonamerica'
});
```

Y también se puede buscar por nombre de lugar. El nombre debe ser exacto.

Ejemplo:
```
app.searchPlace({
  name: 'decano'
});
```

Al realizar una busqueda te damos la posibilidad de que escribas tu propio callback, nosotros brindamos uno por default, pero tu puedes escribir el tuyo.

Ejemplo:
```
var myCustomCallback = function (results, status) {
  if (status === google.maps.places.PlacesServiceStatus.OK)
  {
    for (var i = 0; i < results.length; i++)
    {
      results[i].geometry.location.icon = 'img/marker-3.png';
      app.createMarker(results[i].geometry.location);
    }
  }
};

app.searchPlace({
  name: 'decano'
  , callback: myCustomCallback
});
```

Otro parametro que es opcional pero no menos importante es el radio de busqueda que se va a emplear a partir de tu posicion actual. Google nos limita con un limite maximo de 50000 metros. Por default nosotros usamos 10000 metros.

Ejemplo:
```
app.searchPlace({
  query: 'estadio'
  , radius: 50000
});
```

### icons

Un objeto que mapea el tipo de marcador ("type") con la imagen a utilizar en el mapa. Ejemplo:

```
icons: {
  Super: 'img/marker-super.png'
, Baile: 'img/marker-baile.png'
, Kiosco: 'img/marker-kiosco.png'
  ...
}
```
**Recordar:** la url de la imagen es relativa al lugar donde llaman al script.

***

Por más detalles sobre los posibles attributos y metodos disponibles, ver los [ejemplos](https://github.com/HiroAgustin/donde.js/tree/master/examples).

## Contribuidores

* [Agustin Diaz](https://github.com/HiroAgustin) - [@hiroagustin](https://twitter.com/hiroagustin)
* [Nicolas Montesdeoca](https://github.com/nmontesdeoca) - [@_nmontesdeoca](https://twitter.com/_nmontesdeoca)

Cualquier tipo de colaboración o comentario es agradecido **:)**
/*!
 * donde.js 0.1
 * Copyright 2013 Agustin Diaz @hiroagustin
 * Released under the MIT license
 */
;(function (document, window, undefined)
{
  'use strict';

  var defaultOptions = {
        idMap: 'map'
      , zoom: 15
      , defaultLocation: {
          latitude: -34.8937720817105
        , longitude: -56.1659574508667
        }
      , imageWidth: 37
      , imageHeight: 34
      }

    , Donde = function Donde (options)
      {
        this.options = Utils.extend({}, defaultOptions, options);
        this.markers = this.options.markers;
        return this;
      }

    , Utils = {
        extend: function (obj)
        {
          var extentions = Array.prototype.slice.call(arguments, 1)
            , source = null
            , key = '';

          for (var i = 0; i < extentions.length; i++)
          {
            source = extentions[i];

            if (source)
            {
              for (key in source)
              {
                if (source.hasOwnProperty(key))
                {
                  obj[key] = source[key];
                }
              }
            }  
          }

          return obj;
        }
      };

  Utils.extend(Donde.prototype, {

    createMap: function (container)
    {
      return new google.maps.Map(container, {
        mapTypeId: google.maps.MapTypeId.ROADMAP
      , streetViewControl: false
      , mapTypeControl: false
      , zoom: this.options.zoom
      });
    }

    , createMarker: function (marker)
    {
      marker = marker || {};

      return new google.maps.Marker({
        icon: marker.icon
      , map: this.map
      , position: this.toLatLng(marker)
      });
    }

    , toLatLng: function (position)
    {
      return position instanceof google.maps.LatLng ?
        position : new google.maps.LatLng(position.latitude, position.longitude);
    }

    , setInitialPosition: function (position)
    {
      this.initialPosition = this.toLatLng(position);
      
      this.map.setCenter(this.initialPosition);
      this.userLocationMarker.setPosition(this.initialPosition);

      return this;
    }

    , handleInitialLocationError: function ()
    {
      this.setInitialPosition(this.options.defaultLocation);
      this.options.errorMessage && alert(this.options.errorMessage);

      this.notify('Initial location not found.');

      // TODO: si adentro de notify podemos retornar "this",
      // aca vamos a hacer return this.notify("lo que sea");

      return this;
    }

    , notify: function (message)
    {
      // TODO: hay que pensar bien esto
      // alert(message);
    }

    , panToPosition: function (position)
    {
      this.map.panTo(this.toLatLng(position));

      return this;
    }

    , panToInitialPosition: function ()
    {
      return this.panToPosition(this.initialPosition);
    }

    , addMarker: function (marker)
    {
      if (!(marker.type in this.groups))
      {
        this.groups[marker.type] = {};
      }

      if (!this.groups[marker.type].markers)
      {
        this.groups[marker.type].markers = [];
      }

      marker.icon = this.groups[marker.type].icon;

      this.groups[marker.type].markers.push(
        this.createMarker(marker)
      );

      return this;
    }

    , getUserPosition: function ()
    {
      var self = this;

      navigator.geolocation.getCurrentPosition(
        function (position)
        {
          self.setInitialPosition(position.coords);
        }
      , function ()
        {
          self.handleInitialLocationError(arguments);
        }
      , {
          enableHighAccuracy: true
        , timeout: 8000
        }
      );

      return this;
    }

    , mapAttributes: function (marker)
    {
      if (this.options.mapping)
      {
        var mapping = this.options.mapping
          , key = '';

        for (key in mapping)
        {
          // 1.llamamos a la función de mapeo
          // 2.le pasamos por parametro el marcador
          // 3.seteamos en el marcador el resultado de la funcion
          if (mapping.hasOwnProperty(key))
          {
            marker[key] = mapping[key](marker);
          }
        }
      }

      return marker;
    }

    , addMarkers: function ()
    {
      var self = this
        , markers = this.markers;

      if (!markers)
      {
        this.notify('No markers found.');
      }
      else
      {
        // TODO: revisar esto, tiene sentido que si no hay markers,
        // se recorran y se haga un add marker ?
        for (var i = 0; i < markers.length; i++)
        {
          self.addMarker(self.mapAttributes(markers[i]));
        }
      }


      return this;
    }

    , createIcons: function ()
    {
      var key = ''
        , self = this
        , icons = this.options.icons
        , width = this.options.imageWidth
        , height = this.options.imageHeight;

      for (key in icons)
      {
        if (icons.hasOwnProperty(key))
        {
          if (!(key in self.groups))
          {
            self.groups[key] = {};
          }
          // MarkerImage es deprecado en la siguiente version de Google Maps
          // Cambiar cuanto antes :D
          self.groups[key].icon = new google.maps.MarkerImage(icons[key], null, null, null, new google.maps.Size(width, height)); 
        }

      }

      return this;
    }

    , toggleType: function (type)
    {
      var group = this.groups[type]
        , markers = group.markers;

      for (var i = 0; i < markers.length; i++)
      {
        markers[i].setVisible(!!group.isHidden); 
      }

      group.isHidden = !group.isHidden;
    }

    , listen: function (container)
    {
      var self = this;

      container.addEventListener('click', function (e)
      {
        self.toggleType(e.target.dataset.type);
        e.target.dataset.isActive = e.target.dataset.isActive !== 'true';
      }, false);
    }

    // Hay que agregarle flexibilidad al html de esto
    , addControls: function (container)
    {
      var list = document.createElement('ul')
        , groups = this.groups
        , element = null
        , key = '';

      for (key in groups)
      {
        if (groups.hasOwnProperty(key))
        {
          element = document.createElement('li');

          element.dataset.type = key;
          element.dataset.isActive = !groups[key].isHidden;

          element.appendChild(document.createTextNode(key));

          list.appendChild(element); 
        }
      }

      container.appendChild(list);

      this.listen(container);
    }

    , searchPlace: function (parameters)
    {
      if (!google.maps.places)
      {
        this.notify('PlacesService is not loaded properly');
        return;
      }
      var placeService = new google.maps.places.PlacesService(this.map)
      , self = this;
      
      placeService.textSearch({
        query: parameters.query
        , radius: parameters.radius || 1000
        , location: this.initialPosition || this.toLatLng(this.options.defaultLocation)
      }, function (results, status)
      {
        if (status === google.maps.places.PlacesServiceStatus.OK) {
          for (var i = 0, place; place = results[i]; i++)
          {
            self.createMarker(place.geometry.location);
          }
        }
      });
    }

    , init: function ()
    {
      if (document.getElementById(this.options.idMap))
      {
        this.map = this.createMap(document.getElementById(this.options.idMap));

        this.userLocationMarker = this.createMarker();
        this.userLocationMarker.setClickable(false);

        this.groups = {};

        if ('geolocation' in navigator)
        {
          this.getUserPosition();
        }
        else
        {
          this.handleInitialLocationError();
        }

        this.createIcons();
        this.addMarkers();
      }
      else
      {
        this.notify('Map placeholder not found.');
      }

      if (this.options.idControls && document.getElementById(this.options.idControls))
      {
        this.addControls(document.getElementById(this.options.idControls));
      }

      return this;
    }

  });

  window.Donde = Donde;

})(document, window);
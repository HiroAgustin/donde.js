;(function (GoogleMaps)
{
  'use strict';

  var Donde = window.Donde = function (options)
  {
    this.container = document.getElementById(options.container);

    this.defaultPosition = options.defaultPosition;

    this.markers = options.markers;

    this.zoom = options.zoom;

    return this.init();
  };

  Donde.prototype = {

    init: function ()
    {
      return this
        .createMap()
        .addMarkers()
        .createUserMarker()
        .getUserPosition();
    }

  , createMap: function ()
    {
      this.map = new GoogleMaps.Map(this.container, {
        center: this.toLatLng(this.defaultPosition)
      , mapTypeControl: false
      , mapTypeId: GoogleMaps.MapTypeId.ROADMAP
      , streetViewControl: false
      , zoom: this.zoom
      });

      return this;
    }

  , addMarkers: function ()
    {
      this.markers.forEach(this.createMarker.bind(this));

      return this;
    }

  , createUserMarker: function ()
    {
      var marker = this.userMarker = this.createMarker({
        position: this.defaultPosition
      });

      marker.setClickable(false);

      return this;
    }

  , createMarker: function (marker)
    {
      return new GoogleMaps.Marker({
        icon: marker.icon
      , map: this.map
      , position: this.toLatLng(marker.position)
      });
    }

  , toLatLng: function (position)
    {
      return position instanceof GoogleMaps.LatLng ?
        position : new GoogleMaps.LatLng(position.latitude, position.longitude);
    }

  , panToPosition: function (position)
    {
      this.map.panTo(this.toLatLng(position));

      return this;
    }

  , setInitialPosition: function (position)
    {
      var initialPosition = this.initialPosition = this.toLatLng(position.coords);

      this.map.setCenter(initialPosition);

      this.userMarker.setPosition(initialPosition);

      return this.panToPosition(initialPosition);
    }

  , getUserPosition: function ()
    {
      if ('geolocation' in navigator)
        navigator.geolocation.getCurrentPosition(
          this.setInitialPosition.bind(this)
        , this.handleUserPositionError.bind(this)
        , {enableHighAccuracy: true, timeout: 6000}
        );

      return this;
    }

  , handleUserPositionError: function ()
    {
      return this.notify('Initial location not found.');
    }

  , notify: function (message)
    {
      var container = this.container
        , warning = document.createElement('p');

      warning.innerHTML = message;

      container.appendChild(warning);

      return this;
    }
  };

}(google.maps));

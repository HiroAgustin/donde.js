/*global window:false, document:false, navigator:false, alert:false, console:false, google:false, _:false*/
/*jshint laxcomma:true, expr:true*/
;(function ()
{
  var default_options = {
    idMap: 'map'
  , defaultLocation: {
      latitude: -34.8937720817105
    , longitude: -56.1659574508667
    }
  };

  var Donde = function Donde (options)
  {
    this.options = _.extend({}, default_options, options);
    this.markers = this.options.markers;
    return this;
  };

  Donde.prototype.createMap = function (container)
  {
    return new google.maps.Map(container, {
      mapTypeId: google.maps.MapTypeId.ROADMAP
    , streetViewControl: false
    , mapTypeControl: false
    , zoom: 15
    });
  };

  Donde.prototype.createMarker = function (marker)
  {
    marker = marker || {};
    return new google.maps.Marker({
      icon: marker.icon
    , map: this.map
    , position: new google.maps.LatLng(marker.latitude, marker.longitude)
    });
  };

  Donde.prototype.setInitialPosition = function (coords)
  {
    var location = new google.maps.LatLng(coords.latitude, coords.longitude);
    this.initialPosition = location;
    
    this.map.setCenter(location);
    this.userLocationMarker.setPosition(location);

    return this;
  };

  Donde.prototype.handleInitialLocationError = function ()
  {
    this.setInitialPosition(this.options.defaultLocation);
    this.options.errorMessage && alert(this.options.errorMessage);
    console.log('Initial location not found.');

    return this;
  };

  Donde.prototype.panToPosition = function (position)
  {
    if (!(position instanceof google.maps.LatLng))
    {
      position = new google.maps.LatLng(position.latitude, position.longitude);
    }

    this.map.panTo(position);

    return this;
  };

  Donde.prototype.panToInitialPosition = function ()
  {
    this.panToPosition(this.initialPosition);
    return this;
  };

  Donde.prototype.addMarker = function (marker)
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
  };

  Donde.prototype.getUserPosition = function ()
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
  };

  Donde.prototype.addMarkers = function ()
  {
    var self = this;

    if (!this.markers)
    {
      console.log('No markers found.');
    }

    _.each(this.markers, function (item)
    {
      self.addMarker(item);
    });

    return this;
  };

  Donde.prototype.createIcons = function ()
  {
    var self = this;

    _.each(this.options.icons, function (item, key)
    {
      if (!(key in self.groups))
      {
        self.groups[key] = {};
      }

      self.groups[key].icon = new google.maps.MarkerImage(self.options.icons[key], null, null, null, new google.maps.Size(37,34));
    });

    return this;
  };

  Donde.prototype.init = function ()
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
      console.error('Map placeholder not found.');
    }

    return this;
  };

  window.Donde = Donde;

}());
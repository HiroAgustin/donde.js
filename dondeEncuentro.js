/*jshint laxcomma:true*/
;(function ()
{
  var default_options = {
    idMap: 'map'
  , defaultLocation: {
      latitude: -34.8937720817105
    , longitude: -56.1659574508667
    }
  };

  var DondeEncuentro = function DondeEncuentro (options)
  {
    _.extend(this, default_options, options);
    return this;
  };

  DondeEncuentro.prototype.createMap = function (container)
  {
    return new google.maps.Map(container, {
      mapTypeId: google.maps.MapTypeId.ROADMAP
    , streetViewControl: false
    , mapTypeControl: false
    , zoom: 15
    });
  };

  DondeEncuentro.prototype.createMarker = function (marker)
  {
    marker = marker || {};
    return new google.maps.Marker({
      icon: marker.icon
    , map: this.map
    , position: new google.maps.LatLng(marker.latitude, marker.longitude)
    });
  };

  DondeEncuentro.prototype.setInitialPosition = function (coords)
  {
    var location = new google.maps.LatLng(coords.latitude, coords.longitude);
    this.initialPosition = location;
    
    this.map.setCenter(location);
    this.userLocationMarker.setPosition(location);

    return this;
  };

  DondeEncuentro.prototype.handleInitialLocationError = function ()
  {
    this.setInitialPosition(this.defaultLocation);
    this.errorMessage && alert(this.errorMessage);
    console.log('Initial location not found.');

    return this;
  };

  DondeEncuentro.prototype.panToPosition = function (position)
  {
    if (!(position instanceof google.maps.LatLng))
    {
      position = new google.maps.LatLng(position.latitude, position.longitude);
    }

    this.map.panTo(position);

    return this;
  };

  DondeEncuentro.prototype.panToInitialPosition = function ()
  {
    this.panToPosition(this.initialPosition);
    return this;
  };

  DondeEncuentro.prototype.addMarker = function (marker)
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

  DondeEncuentro.prototype.getUserPosition = function ()
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

  DondeEncuentro.prototype.addMarkers = function ()
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

  DondeEncuentro.prototype.createIcons = function ()
  {
    var self = this;

    _.each(this.icons, function (item, key)
    {
      if (!(key in self.groups))
      {
        self.groups[key] = {};
      }

      self.groups[key].icon = new google.maps.MarkerImage(self.icons[key], null, null, null, new google.maps.Size(37,34));
    });

    return this;
  };

  DondeEncuentro.prototype.init = function ()
  {
    if (document.getElementById(this.idMap))
    {
      this.map = this.createMap(document.getElementById(this.idMap));

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

  window.DondeEncuentro = DondeEncuentro;

}());
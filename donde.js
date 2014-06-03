;(function (doc, win, undefined)
{
    'use strict';

    var Utils = {
            
        each: function (obj, iterator, context)
        {
            if (!obj)
            {
                return;
            }

            if (obj.forEach === Array.prototype.forEach)
            {
                obj.forEach(iterator, context);
            }
            else if (obj instanceof Array)
            {
                for (var i = 0; i < obj.length; i++)
                {
                    iterator.call(context, obj[i], i);
                }
            }
            else
            {
                for (var key in obj)
                {
                    if (obj.hasOwnProperty(key))
                    {
                        iterator.call(context, obj[key], key);
                    }
                }
            }
        }

    ,   extend: function (obj)
        {
            var self = this
            ,   extensions = Array.prototype.slice.call(arguments, 1);

            this.each(extensions, function (extension)
            {
                self.each(extension, function (value, key)
                {
                    obj[key] = value;
                });
            });

            return obj;
        }
    };

    var defaultOptions = {
        idMap: 'map'
    ,   zoom: 15
    ,   defaultLocation: {
            latitude: -34.8937720817105
        ,   longitude: -56.1659574508667
        }
    ,   image: {
            width: 37
        ,   height: 34
        }
    };

    var Donde = function Donde (options)
    {
        this.options = Utils.extend({}, defaultOptions, options);
        this.markers = this.options.markers;
        this.groups = {};
        
        return this;
    };

    Utils.extend(Donde.prototype, {

        createMap: function (container)
        {
            return new google.maps.Map(container, {
                mapTypeId: google.maps.MapTypeId.ROADMAP
            ,   streetViewControl: false
            ,   mapTypeControl: false
            ,   zoom: this.options.zoom
            });
        }

    ,   createMarker: function (marker)
        {
            marker = marker || {};

            return new google.maps.Marker({
                icon: marker.icon
            ,   map: this.map
            ,   position: this.toLatLng(marker)
            });
        }

    ,   toLatLng: function (position)
        {
            return position instanceof google.maps.LatLng ? position : new google.maps.LatLng(position.latitude, position.longitude);
        }

    ,   setInitialPosition: function (position)
        {
            this.initialPosition = this.toLatLng(position);
            
            this.map.setCenter(this.initialPosition);
            this.userLocationMarker.setPosition(this.initialPosition);

            this.panToInitialPosition();

            return this;
        }

    ,   handleInitialLocationError: function ()
        {
            this.setInitialPosition(this.options.defaultLocation);
            // this.options.errorMessage && alert(this.options.errorMessage);

            return this.notify('Initial location not found.');
        }

    ,   notify: function (message)
        {
            console.warn(message);

            return this;
        }

    ,   panToPosition: function (position)
        {
            this.map.panTo(this.toLatLng(position));

            return this;
        }

    ,   panToInitialPosition: function ()
        {
            return this.panToPosition(this.initialPosition);
        }

    ,   addMarker: function (marker)
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

    ,   getUserPosition: function ()
        {
            var self = this;

            navigator.geolocation.getCurrentPosition(
                function (position)
                {
                    self.setInitialPosition(position.coords);
                }
            ,   function ()
                {
                    self.handleInitialLocationError(arguments);
                }
            ,   {
                    enableHighAccuracy: true
                ,   timeout: 8000
                }
            );

            return this;
        }

    ,   mapAttributes: function (marker)
        {
            Utils.each(this.options.mapping, function (map, index)
            {
                marker[index] = map(marker);
            });

            return marker;
        }

    ,   addMarkers: function (markers)
        {
            var self = this;

            Utils.each(markers, function (item)
            {
                self.addMarker(
                    self.mapAttributes(item)
                );
            });

            return this;
        }

    ,   createIcons: function ()
        {
            var self = this
            ,   options = this.options;

            Utils.each(options.icons, function (image, key)
            {
                if (!(key in self.groups))
                {
                    self.groups[key] = {};
                }
                
                self.groups[key].icon = self.createIcon(image);
            });

            return this;
        }

    ,   createIcon: function (image)
        {
            var options = this.options
            ,   width = options.image.width
            ,   height = options.image.height;

            return new google.maps.MarkerImage(
                image, null, null, null, new google.maps.Size(
                    width, height
                )
            );
        }

    ,   toggleType: function (type)
        {
            var group = this.groups[type];

            Utils.each(group.markers, function (marker)
            {
                marker.setVisible(!!group.isHidden);
            });

            group.isHidden = !group.isHidden;

            return this;
        }

    ,   listen: function (container)
        {
            var self = this;

            container.addEventListener('click', function (e)
            {
                self.toggleType(e.target.dataset.type);
                e.target.dataset.isActive = e.target.dataset.isActive !== 'true';
            }, false);

            return this;
        }

    ,   addControls: function (container)
        {
            var list = doc.createElement('ul')
            ,   element = null;

            Utils.each(this.groups, function (item, key)
            {
                element = doc.createElement('li');

                element.dataset.type = key;
                element.dataset.isActive = !item.isHidden;

                element.appendChild(
                    doc.createTextNode(key)
                );

                list.appendChild(element);
            });

            container.appendChild(list);

            return this.listen(container);
        }

    ,   $: function (id)
        {
            return doc.getElementById(id);
        }

    ,   init: function ()
        {
            if (this.$(this.options.idMap))
            {
                this.map = this.createMap(this.$(this.options.idMap));

                this.userLocationMarker = this.createMarker();
                this.userLocationMarker.setClickable(false);
                
                this.setInitialPosition(this.options.defaultLocation);

                this.createIcons().addMarkers(this.options.markers);

                if ('geolocation' in navigator)
                {
                    this.getUserPosition();
                }
            }
            else
            {
                this.notify('Map placeholder not found.');
            }

            if (this.options.idControls && this.$(this.options.idControls))
            {
                this.addControls(this.$(this.options.idControls));
            }

            return this;
        }
    });

    win.Utils = Utils;

    win.Donde = Donde;

})(document, window);
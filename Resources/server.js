var appc = require("/appc");

Titanium.API.info("[TITANIUM] "+Titanium.Platform.model);
var simulator = false; //(Titanium.Platform.model == "Simulator") || (Titanium.Platform.model == "sdk"),
    domains = {
        simulator: 'pingpongserver.dev',
        production: 'pingpongserver.ahiroo.com'
    };

const CURRENT_VERSION = "v1";   // server API version to use

if (Titanium.Geolocation.locationServicesEnabled) {
    Titanium.Geolocation.purpose = 'Determine Current Location';

    var location = require('/location/location');
    location.start({
        action: function(responseLocation) {
            appc.gps = responseLocation;
            Titanium.API.info("[location] "+responseLocation);
            location.stop();
        },
        error: function() {
            alert('Error: Trying to get location');
        }
    });
}else{
    alert('Please enable location services');
}

/*
if (Titanium.Geolocation.locationServicesEnabled) {
    Titanium.Geolocation.purpose = 'Determine Current Location';
    Titanium.Geolocation.accuracy = Titanium.Geolocation.ACCURACY_BEST;
    Titanium.Geolocation.distanceFilter = 10;
    Titanium.Geolocation.preferredProvider = Titanium.Geolocation.PROVIDER_GPS;

    Titanium.Geolocation.addEventListener('location', function(e) {
        if (e.error) {
            alert('Error: ' + e.error);
        } else {
            Titanium.API.info("[COORDS]" + e.coords);
            alert(e.coords.longitude + "," + e.coords.latitude);
            appc.gps = e.coords;
        }
    });
} else {
    alert('Please enable location services');
}
*/

module.exports = {

    server: 'http://'+ (simulator ? domains.simulator : domains.production) + '/api/' + CURRENT_VERSION + '/',
    match: {},
    user: "",
    password: "",
    status: 0,
    readyState: 0,
    currentMatch: 0,
    currentOpponent: {
        id: 0,
        name: ""
    },
    score: {
        you: 0,
        other: 0
    },

    APIKEY: "kDjE9KfmD2Pd9KmcFkSdFqlK6Mfjz09dKdqS",

    extend: function (original, extended) {
        for (var key in (extended || {})) {
          if (original.hasOwnProperty(key)) {
            original[key] = extended[key];
          }
        }
        return original;
    },

    /**
     *
     * @param {Object} _options
     */
    xhr: function(_options){
        // Client Configuration
        var config = this.extend({
            //url         : 'http://localhost',
            method      : 'POST',
            type        : 'json',
            data        : {},
            auth        : true,
            onload      : null,
            onerror     : null,
            timeout     : 0,
            coords      : false,
            indicator   : null
        }, _options);

        config.url = this.server + _options.url;

        var xhr = Titanium.Network.createHTTPClient();

        xhr.setTimeout(config.timeout);

        if(config.indicator){
            config.indicator.visible = true;
        };

        xhr.onload = function() {
            if(config.onload){
                Ti.API.info("Firing onload callback "+config.type+" "+this.responseText);
                var response = JSON.parse(this.responseText);
                config.onload(response);
            }else{
                Ti.API.info("xhr.onload "+this.responseText);
            }
            if(config.indicator){
                config.indicator.visible = false;
            }
        };

        xhr.onerror = function(e){
            if(config.onerror){
               config.onerror(e, xhr.responseText);
            }else{
                Ti.API.info("error "+e.error+" getting "+config.url+", response "+xhr.responseText);
                var errorDialog = Ti.UI.createOptionDialog({
                    title  : "Error authenticating in server\n"+e.error,
                    options: ["Exit"],
                    cancel : 0,
                });
                errorDialog.show();
            };
            if(config.indicator){
                config.indicator.visible = false;
            }
        };

        xhr.open(config.method, config.url);

        xhr.setRequestHeader('API-KEY', this.APIKEY);
        if(config.auth){
            xhr.setRequestHeader('PLAYER', this.user);
            xhr.setRequestHeader('PASSWORD', Titanium.Utils.sha1(this.password));
        };

        if(config.coords){
            config.data.longitude = appc.coords.longitude;
            config.data.latitude = appc.coords.latitude;
        };

        Titanium.API.info("xhr->"+config.method+":"+config.url+" "+JSON.stringify(config.data));

        xhr.send( config.data );

    },

    set_cloud_id: function (cloud_id)
    {
        Titanium.API.info("setting cloud id "+cloud_id);
        this.xhr({
            url: 'set-cloud-id',
            auth: true,
            method: 'POST',
            onload: function(data){
                Titanium.API.info(data);
            },
            data: { "cloudId": cloud_id }
        });
    },

    get_match_info: function (callback)
    {
        var d = new Date();
        Titanium.API.info("getting match info");
        this.xhr({
            url: 'match-info?nocache=' + d.getTime(),
            auth: true,
            method: 'GET',
            coords: true,
            onload: function(data){
                if(data.result){
                    Titanium.API.debug(JSON.stringify(data));
                    callback(data);
                }else{
                    Titanium.API.error(JSON.stringify(data));
                }
            }
        });
    }

};

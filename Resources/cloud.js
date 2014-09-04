var Cloud = require('ti.cloud');
var server = require('/server');
var appc = require("/appc");

var aux = {};
aux.source = {};
aux.source.id = '';

module.exports = function()
{
    const NOTIF_MATCH_STARTS = 1;  // An opponent has joined to your match
    const NOTIF_YOU_WIN = 2;
    const NOTIF_OTHER_WINS = 3;
    const NOTIF_SCORE_UPDATE = 4;

	var user_device_token = Titanium.App.Properties.getString("device_token", null);
	var password = '';

	if (Titanium.Platform.osname == 'android')
	{
		var CloudPush = require('ti.cloudpush');
		CloudPush.debug = true;
		//CloudPush.enabled = true;
		CloudPush.showTrayNotificationsWhenFocused = true;
		CloudPush.focusAppOnPush = false;

		var deviceToken;

		Titanium.API.info('getDeviceToken');
		Cloud.debug = true;

		CloudPush.retrieveDeviceToken({
			success: function deviceTokenSuccess(e) {
				deviceToken = e.deviceToken;
				Titanium.App.Properties.setString("device_token", deviceToken);
				//searchUser(server.user);
				registerUserAndroid();
				Titanium.API.info('registered');
			},
			error: function deviceTokenError(e) {
				Titanium.API.info('Failed to register for push! ' + e.error);
			}
		});

        function searchUser(username)
        {
            Cloud.Users.query({
                page: 1,
                per_page: 1,
                where: { 'username': username}
            }, function (e) {
                if (e.success) {
                    alert('Success:\n' +
                        'Count: ' + e.users.length);
                    for (var i = 0; i < e.users.length; i++) {
                        var user = e.users[i];
                        alert('id: ' + user.id + '\n' +
                            'first name: ' + user.first_name + '\n' +
                            'last name: ' + user.last_name);
                     }
                } else {
                    alert('Error:\n' +
                        ((e.error && e.message) || JSON.stringify(e)));
                }
            });
        }

		function registerUserAndroid()
		{
			Cloud.Users.create({
			    username: server.user,
			    password: server.pass,
			    password_confirmation: server.pass,
			    first_name: server.user,
			    last_name: server.user
			}, function (e) {
			    //console.log(e);
			    if (e.success) {
			    	Titanium.API.info('registerUser OK');
			    } else {
			    	Titanium.API.info('error registering user ' + e.message);
			    }
                loginAndroid();
			});
		}

		function loginAndroid(){
			Cloud.Users.login({
				login: server.user,
				password: server.pass
			}, function (e) {
				if (e.success) {
					server.set_cloud_id(e.users[0].id);
					Titanium.API.info("login success");
					subscribeAndroid();
				} else {
					Titanium.API.info('Error: ' + ((e.error && e.message) || JSON.stringify(e)));
				}
			});
		}

		function subscribeAndroid(){
			Cloud.PushNotifications.subscribe({
				channel: 'notifications',
				device_token: deviceToken,
				//type: 'android'
				type: 'gcm'
			}, function (e){
				if (e.success) {
					Titanium.API.info('Subscribed for Push Notification!');
				}else{
					Titanium.API.info('Error:' +((e.error && e.message) || JSON.stringify(e)));
				}
			});
		}

		CloudPush.addEventListener('callback', function (evt){

			Titanium.API.info('== notification received == ' + JSON.stringify(evt));
			/**
			 * [INFO] :   == notification received ==
			 * {
			 *       "type":"callback",
			 *       "source":
			 *       {
			 *           "pushType":"gcm",
			 *           "invocationAPIs":[],
			 *           "bubbleParent":true,
			 *           "showTrayNotification":true,
			 *           "enabled":false,
			 *           "__propertiesDefined__":true,
			 *           "singleCallback":false,
			 *           "_events":
			 *           {
			 *               "callback":{},
			 *               "trayClickLaunchedApp":{},
			 *               "trayClickFocusedApp":{}
			 *           },
			 *           "focusAppOnPush":false,
			 *           "debug":true,
			 *           "showAppOnTrayClick":true,
			 *           "showTrayNotificationsWhenFocused":true,
			 *           "apiName":"Ti.Module"
			 *       },
			 *       "payload":"{\"android\":{\"title\":\"the title\",\"sound\":\"default\",\"alert\":\"the alert message\",\"vibrate\":true,\"badge\":1}}",
			 *       "bubbles":false,
			 *       "cancelBubble":false
			 * }
			 *
			 * payload detail
			 * {
			 *     "android":
			 *       {
			 *           "title": "the title",                   # 120 characters max (Android only)
			 *           "sound": "default|no sound|custom",
			 *           "alert": "the alert message",           # 120 characters max
			 *           "vibrate": true|false,                  # (Android only)
			 *           "badge": 1.. ,                          # Integer must be > 0
			 *           "icon": ""                              # Enter icon (Android only)
			 *       }
			 * }
			 */
			var payload = JSON.parse(evt.payload);

            console.log(payload.type);

            switch(payload.type){

		        case NOTIF_MATCH_STARTS:
		             Titanium.API.info("[NOTIFICATION] NOTIF_MATCH_STARTS");
                     Titanium.API.info("[NOTIFICATION] Firing "+appc.NOTIFICATION_MATCH_STARTS);
                     Titanium.App.fireEvent(appc.NOTIFICATION_MATCH_STARTS);
		             break;

			    case NOTIF_YOU_WIN:
			         alert("YOU WIN");
			         // close match window
			         break;

			    case NOTIF_OTHER_WINS:
			         alert("YOU LOOSE");
			         // close match window
			         break;

			    case NOTIF_SCORE_UPDATE:
			         server.get_match_info(function(data){
                         server.score = data.score;
                         Titanium.App.fireEvent(appc.NOTIFICATION_SCORE_UPDATE);
                     });
			         break;

			    default:
			         Titanium.API.info("Received unknown badge " + payload.badge + ", payload " + payload);
			         break;

			}
		});

		CloudPush.addEventListener('trayClickLaunchedApp', function (evt) { // Cuando lo llama, también llama a callback
			Titanium.API.info('###########' + JSON.stringify(evt));
			// var a = JSON.parse(evt.payload);
			// aux.source.id = a.kt;
			// f_callback(aux);
		});

		CloudPush.addEventListener('trayClickFocusedApp', function (evt) { // No parece que lo llame nunca
			// Titanium.API.info('###########' + JSON.stringify(evt));
			// var a = JSON.parse(evt.payload);
			// aux.source.id = a.kt;
			// f_callback(aux);
			Titanium.API.info('*************' + JSON.stringify(evt));
			// var a = JSON.parse(evt.payload);
			// aux.source.id = a.kt;
			// f_callback(aux);
		});
	}

    if ((Titanium.Platform.osname == 'ipad') || (Titanium.Platform.osname == 'iphone'))
    {
        console.log('--- clouding ---');
		getDeviceToken();

		function getDeviceToken() {
			Titanium.API.info('getDeviceToken');
			Titanium.Network.registerForPushNotifications({
			    types: [
			        Titanium.Network.NOTIFICATION_TYPE_BADGE,
			        Titanium.Network.NOTIFICATION_TYPE_ALERT,
			        Titanium.Network.NOTIFICATION_TYPE_SOUND
			    ],
			    success:function(e) {
			        user_device_token = e.deviceToken;
			        Titanium.App.Properties.setString("device_token", user_device_token);
					Titanium.API.info("Device token: " + user_device_token);
					registerUser();
			    },
			    error:function(e) {
			        Titanium.API.info("Error during registration: " + e.error);
			    },
			    callback:function(e) {
			    	Titanium.API.info(e);
			    	/*
					array_matches.push(e.data.kt);

					var aux = Titanium.App.Properties.getList('notifications_matches', []);
					aux.push(e.data.kt);
					Titanium.App.Properties.setList('notifications_matches', aux);

					if (e.data.offers) {
						var aux = Titanium.App.Properties.getList('notifications_offers', []);
						var items = e.data.offers.split(',');
						for (var i in items) {
							aux.push(items[i]);
						}
						Titanium.App.Properties.setList('notifications_offers', aux);
					}

					if (e.data.news) {
						var aux = Titanium.App.Properties.getList('notifications_news', []);
						var items = e.data.news.split(',');
						for (var i in items) {
							aux.push(items[i]);
						}
						Titanium.App.Properties.setList('notifications_news', aux);
					}
					*/
			    }
			});
		}

		function registerUser() {
			Cloud.Users.create({
			    username: server.user,
			    password: server.pass,
			    password_confirmation: server.pass,
			    first_name: server.user,
			    last_name: server.user
			}, function (e) {
			    if (e.success) {
			    	Titanium.API.info('registerUser OK');
			    } else {
			    	Titanium.API.info('error registering user');
			    }
			    login();
			});
		}

		function login(){
			Cloud.Users.login({
			    login: server.user,
			    password: server.pass
			}, function (e) {
			    if (e.success) {
			        server.set_cloud_id(e.users[0].id);
			        Titanium.API.info('Login OK');
			        subscribeToServerPush();
			    } else {
			        Titanium.API.info('Error:\\n' + ((e.error && e.message) || JSON.stringify(e)));
			    }
			});
		}

		function subscribeToServerPush(){
			Cloud.PushNotifications.subscribe({
		    	channel: 'notifications',
		    	type: 'ios',
		    	device_token: user_device_token
			}, function (e) {
			    if (e.success) {
			    	Titanium.API.info('Success'+((e.error && e.message) || JSON.stringify(e)));
			    } else {
			        Titanium.API.info('Error:\\n' + ((e.error && e.message) || JSON.stringify(e)));
			    }
			});
		}
	}

};

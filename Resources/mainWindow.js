// Require the modules
var server = require("/server");
var cloud = require("/cloud");
var appc = require("/appc");
var database = require("/database");
var matchMod = require("/match");

module.exports = function(){
// testing purposes only, to check connectiviy with server

var notifyInterval = null;

server.xhr({
    url: 'version',
    auth: false,
    method: 'GET',
    onload: function(data){
        Titanium.API.info(data.version);
    }
});

/*
 *
 *  D I F E R E N T    G R A P H I C S    E L E M E N T S
 *
 */

// this sets the background color of the master UIView (when there are no windows/tab groups on it)
Titanium.UI.setBackgroundColor('#000');

// create tab group
var tabGroup = Titanium.UI.createTabGroup();

//
// create base UI tab and root window
//
var win1 = Titanium.UI.createWindow({
    title:'Login',
    backgroundColor:'#fff',
    /* on Android, it needs to be a "heavyweight" window */
    fullscreen: false,
    /* This works on iOS */
    orientationModes: [
        Ti.UI.PORTRAIT,
        Ti.UI.UPSIDE_PORTRAIT
    ]
});


var tab1 = Titanium.UI.createTab({
    icon: '/images/KS_nav_login.png',
    title: 'Login',
    window: win1
});

var staticImage = Titanium.UI.createImageView({
    bottom: '-175dp',
    right: '-175dp',
    width: '400dp',
    height: '400dp',
    image: '/images/whiteball-with-logo.png'
});
win1.add(staticImage);

var labelNick = Titanium.UI.createLabel({
	color:     appc.colors.label,
	text:      'User',
	top:       '15dp',
	font:      appc.fonts.labelFont,
	textAlign: 'center',
	width:     'auto'
});
win1.add(labelNick);

var inputNick = Titanium.UI.createTextField({
    borderStyle : Titanium.UI.INPUT_BORDERSTYLE_ROUNDED,
    autocapitalization: Titanium.UI.TEXT_AUTOCAPITALIZATION_NONE,
    backgroundColor:'#FFF',
    borderColor : '#333',
    borderWidth : 1,
    font        : appc.fonts.inputFont,
    color       : '#336699',
    top         : '50dp',
    left        : '10%',
    width       : '80%',
    height      : '40dp',
    hintText    : 'Nick',
    value       : ''
});
win1.add(inputNick);


var labelPassword = Titanium.UI.createLabel({
    color:      appc.colors.label,
    text:       'Password',
    top:        '130dp',
    font:       appc.fonts.labelFont,
    textAlign:  'center',
    width:      'auto'
});
win1.add(labelPassword);

var inputPassword = Ti.UI.createTextField({
    borderStyle : Ti.UI.INPUT_BORDERSTYLE_ROUNDED,
    backgroundColor:'#FFF',
    borderColor : '#333',
    borderWidth : 1,
    font        : appc.fonts.inputFont,
    passwordMask: true,
    color       : '#336699',
    top         : '150dp',
    left        : '10%',
    width       : '80%',
    height      : '40dp',
    hintText    : 'Password',
    value       : ''
});
win1.add(inputPassword);

var loginBtn = Titanium.UI.createButton({
    color:  '#999',
    backgroundColor: 'blue',
    title: "LOGIN",
    font: appc.fonts.buttonFont,
    textAlign:'center',
    bottom: '75dp',
    width:'150dp',
    height: '40dp'
});
win1.add(loginBtn);

var ajaxActivity = Titanium.UI.createImageView({
    bottom: '75dp',
    right: '75dp',
    width: '40dp',
    height: '40dp',
    image: '/images/violetball.png',
    opacity: 0.5,
    delta: 0.1,
    visible: false
});
win1.add(ajaxActivity);

var ajaxActivityInterval = setInterval(function(){
    if(ajaxActivity.opacity < 0.2 || ajaxActivity.opacity > 1){
        ajaxActivity.delta = -ajaxActivity.delta;
    };
    ajaxActivity.opacity += ajaxActivity.delta;
}, 180);

var registerBtn = Titanium.UI.createButton({
    color:  '#999',
    backgroundColor: 'darkgray',
    title: "REGISTER",
    font: appc.fonts.buttonFont,
    textAlign:'center',
    bottom: '25dp',
    width:'150dp',
    height: '40dp'
});
win1.add(registerBtn);

//
// create controls tab and root window
//
var win2 = Titanium.UI.createWindow({
    title:'Match',
    backgroundColor:'#fff'
});

var tab2 = Titanium.UI.createTab({
    icon:'/images/KS_nav_match.png',
    title:'Match',
    window:win2
});

var group1 = Titanium.UI.createView({
    visible: true
});
win2.add(group1);

var group2 = Titanium.UI.createView({
    visible: false
});
win2.add(group2);

var startBtn = Titanium.UI.createButton({
    //backgroundImage: '/images/bluebtn.png',
	//color:'#999',
	color: 'white',
	backgroundColor: 'blue',
	title: "START NEW MATCH",
	font: appc.fonts.buttonFont,
	textAlign:'center',
	width:'225dp',
	height: '50dp',
	bottom: 0
});
group1.add(startBtn);

var refreshBtn = Titanium.UI.createButton({
    color:  '#999',
    backgroundColor: 'pink',
    title: "REFRESH LIST",
    font: appc.fonts.buttonFont,
    textAlign: 'center',
    bottom: '110dp',
    width: '225dp',
    height: '50dp'
});
group1.add(refreshBtn);

/*
var toPointsSel = Titanium.UI.createPicker({
    bottom: '50dp',
    right: '50dp'
});

vr pointsOptions = [];
pointsOptions.push(new Titanium.UI.createPickerRow({title: '11'}));
pointsOptions.push(new Titanium.UI.createPickerRow({title: '21'}));
toPointsSel.add(pointsOptions);
win2.add(toPointsSel);
*/

var toPointsLabel = Titanium.UI.createLabel({
    bottom: '65dp',
    text: 'OFF:11p                        ON:21p',
    font: appc.fonts.labelFont,
    color: 'blue'
});
group1.add(toPointsLabel);

var toPointsSwitch = Titanium.UI.createSwitch({
   bottom: '65dp',
   //height: 50,
   //width: 250,
   value: false
});
group1.add(toPointsSwitch);

var table = Titanium.UI.createTableView({
    top: 0,
    font: appc.fonts.labelFont,
    width: '100%',
    height: '50%'
});


// Listen for click events.
table.addEventListener('click', function(e1) {
    //console.log(e1);
    var dialog = Ti.UI.createAlertDialog({
        title: e1.source.text,
        buttonNames: ['JOIN', 'CANCEL']
    });

    dialog.addEventListener('click', function(e2){
        console.log('[SOURCE:]' + JSON.stringify(e2));
        if(e2.index == 1) return;  // button cancel
        server.xhr({
           url: 'join-match/'+e1.source.matchId,
           method: 'PUT',
           onload: function(data){
               if(data.result){
                   server.currentOpponent.name = data.opponent.nick;
                   server.currentOpponent.id = data.opponent.id;
                   server.score = data.score;
                   var matchMod = require('/match');
                   var matchWin = matchMod();
                   matchWin.open();
               }else{
                   alert(data.error);
               }
           }
        });
    });
    dialog.show();
});

// Add to the parent view.
group1.add(table);

function getAvailableMatches()
{
    //server.user = inputNick.value;
    //server.pass = inputPassword.value;
    //if (!server.user || !server.pass) return;

    var d = new Date();
    server.xhr({
        url: 'search-match?nocache=' + d.getTime(),
        method: 'GET',
        onload: function(data){
            Titanium.API.info(data);
            if(data.result){
                var rows = [];
                var players = data.players;
                for(var i in data.matches){
                    var match = data.matches[i];
                    var row = Titanium.UI.createTableViewRow({
                        height : '60dp',
                        width: '100%',
                        className : "tableRow",
                    });
                    var labTitle = Ti.UI.createLabel({
                        color : 'black',
                        font : appc.fonts.labelFont,
                        text : "["+match.player1+"] "+players[match.player1]+"  "+(match.distance ? match.distance : '?')+" mts",
                        textAlign : 'left',
                        width: '100%',
                        // custom properties
                        matchId: match.id
                    });
                    row.add(labTitle);
                    rows.push(row);
                }
                table.setData(rows);
            };
        }
    });
}

var ball = Titanium.UI.createImageView({
    bottom: 0,
    width: '200dp',
    height: '200dp',
//    image: '/images/blueball.png',
    image: '/images/whiteball.png',
    /* private properties */
    direction: 1,
    interval: null
});
group2.add(ball);

var waitingText = Titanium.UI.createLabel({
    top: 10,
    textAlign: 'center',
    width: 'auto',
    color: 'black',
    font: appc.fonts.labelFont,
    text: 'Waiting that other player join'
});
group2.add(waitingText);

var cancelBtn = Titanium.UI.createButton({
    bottom: 0,
    width: '225dp',
    height: '50dp',
    title: 'CANCEL MATCH',
    font: appc.fonts.buttonFont,
    backgroundColor: 'blue',
    color: 'white'
});
group2.add(cancelBtn);

function bounce()
{
    if(ball.bottom > 220){
        ball.direction = -1.5;
    }else{
        if(ball.bottom < 0){
            ball.direction = 1;
        }
    };
    ball.direction -= 0.05;
    ball.bottom += (12 - ball.direction ) * ball.direction;       
}

function checkNotifications()
{
	// check notifications
   	server.get_notifications(function(data){
    	if (server.check_notification(appc.NOTIFICATION_USER_JOINED)) {
			clearInterval(ball.interval);
			clearInterval(notifyInterval);
			var matchMod = require('/match');
	        var matchWin = matchMod();
	        matchWin.open();
		}
    });
}

function refreshBtnHandler()
{
    getAvailableMatches();
}

function cancelBtnHandler()
{
    // removes the match in server
    server.xhr({
       url: 'cancel-match',
       method: 'DELETE',
       onload: function(data){
           if(data.result){
           		if (ball.interval) clearInterval(ball.interval);
           		if (notifyInterval) clearInterval(notifyInterval);
                group1.setVisible(true);
                group2.setVisible(false);
           }else{
               alert(data.error);
           }
       }
    });
}

function eventRegisterOkHandler()
{
    inputNick.value = server.user;
    inputPassword.value = server.password;
}

Titanium.App.addEventListener(appc.EVENT_REGISTER_OK, eventRegisterOkHandler);

// this function handles the click of register button
function registerBtnHandler()
{
    var registerModule = require("/register");
    var registerWindow = registerModule();
    registerWindow.open();
}

// this function handles the click of login button
function loginBtnHandler() {
    Titanium.API.info('entering login btn handler');
    server.user = inputNick.value.toLowerCase();
    server.password = inputPassword.value;
    if (!server.user || !server.password) return;

    server.xhr({
        url: 'login',
        method: 'POST',
        auth: true,
        onload: function(data){
            Titanium.API.info(data.result);
            if(data.result){
                // save user in local database
                database.saveUser(server.user, server.password);
                // get own notifications
                server.get_notifications();
                // register user in ACS to obtain push notifications
                //cloud();
                // change to match tab
                tab2.setActive(true);
                // active the correct group
                group1.setVisible(true);
                group2.setVisible(false);
                // obtain available matches to fill the matches table
                getAvailableMatches();
            };
        },
        indicator: ajaxActivity
    });
};

win1.addEventListener('open',function(){
    loginBtn.addEventListener('click', loginBtnHandler );
    registerBtn.addEventListener('click', registerBtnHandler );
});


win1.addEventListener('close',function(){
    loginBtn.removeEventListener('click', loginBtnHandler );
    registerBtn.removeEventListener('click', registerBtnHandler );
});

function startBtnHandler() {
    Titanium.API.info('entering start btn handler');
    server.user = inputNick.value;
    server.pass = inputPassword.value;
    if (!server.user || !server.pass) return;

    server.xhr({
        url: 'start-match?toPoints=' + (toPointsSwitch.value ? 21 : 11),
        method: 'PUT',
        coords: true,
        indicator: ajaxActivity,
        onload: function(data){
            Titanium.API.info(data.result);
            if(data.result){
                server.match = data.match;
                Titanium.API.info(server.match);
                group1.setVisible(false);
                group2.setVisible(true);
                ball.interval = setInterval(bounce, 80);
                notifyInterval = setInterval(checkNotifications, appc.NOTIFICATIONS_TICKS);
            };
        }
    });
};

/**
 *
 *      L  I  S  T  E  N  E  R
 *
 */

win2.addEventListener('open',function(){
    startBtn.addEventListener('click', startBtnHandler );
    refreshBtn.addEventListener('click', refreshBtnHandler );
    cancelBtn.addEventListener('click', cancelBtnHandler);
});


win2.addEventListener('close',function(){
    loginBtn.removeEventListener('click', loginBtnHandler );
    refreshBtn.removeEventListener('click', refreshBtnHandler );
    cancelBtn.removeEventListener('click', cancelBtnHandler);
});

var interval;
var notif_start_match_received = 0;

Titanium.App.addEventListener(appc.NOTIFICATION_MATCH_STARTS, function(){
    Titanium.API.info('Received MATCH STARTS NOTIFICATION');
    notif_start_match_received = 1;
});

function intervalHandler()
{
    if(notif_start_match_received){
        notif_start_match_received = 0;
        server.get_match_info(function(data){
            if(data.result){
                server.currentMatch = data.match.id;
                server.currentOpponent.id = data.opponent.id;
                server.currentOpponent.name = data.opponent.nick;
                clearInterval(interval);
                var matchWin = matchMod();
                matchWin.open();
            }
        });
    }
};

interval = setInterval( intervalHandler, 500);
//setTimeout(function(){notif_start_match_received = 1;}, 3000);

//
//  add tabs
//
tabGroup.addTab(tab1);
tabGroup.addTab(tab2);


user = database.getUser() || { nick:'', pass: '' };
if(user.nick && user.pass){
    inputNick.value = user.nick;
    inputPassword.value = user.pass;
}

// open tab group
//setTimeout(function(){ tabGroup.open(); } , 300);

return tabGroup;

};



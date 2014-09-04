// Require the modules
var server = require("/server");
var cloud = require('/cloud');
var appc = require("/appc");

module.exports = function(){
    /*
     *
     *  D I F E R E N T    G R A P H I C S    E L E M E N T S
     *
     */

    // this sets the background color of the master UIView (when there are no windows/tab groups on it)
    Titanium.UI.setBackgroundColor(appc.colors.background);

    // create tab group
    var tabGroup = Titanium.UI.createTabGroup();

    //
    // create base UI tab and root window
    //
    var win1 = Titanium.UI.createWindow({
        title:'Register',
        backgroundColor: appc.colors.winBackground
    });


    var labelEmail = Titanium.UI.createLabel({
    	color:     appc.colors.label,
    	text:      'Email',
    	top:       '30dp',
    	font:      appc.fonts.labelFont,
    	textAlign: 'center',
    	width:     'auto'
    });
    win1.add(labelEmail);

    var inputEmail = Titanium.UI.createTextField({
        borderStyle : Titanium.UI.INPUT_BORDERSTYLE_ROUNDED,
        backgroundColor: appc.colors.winBackground,
        borderColor : '#333',
        borderWidth : 1,
        font        : appc.fonts.inputFont,
        color       : '#336699',
        top         : '50dp',
        left        : '10%',
        width       : '80%',
        height      : '40dp',
        hintText    : 'Email',
        value       : ''
    });
    win1.add(inputEmail);

    var labelNick = Titanium.UI.createLabel({
        color:     appc.colors.label,
        text:      'User',
        top:       '100dp',
        font:      appc.fonts.labelFont,
        textAlign: 'center',
        width:     'auto'
    });
    win1.add(labelNick);

    var inputNick = Titanium.UI.createTextField({
        borderStyle : Titanium.UI.INPUT_BORDERSTYLE_ROUNDED,
        backgroundColor: appc.colors.winBackground,
        borderColor : '#333',
        borderWidth : 1,
        font        : appc.fonts.inputFont,
        color       : '#336699',
        top         : '120dp',
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
        top:        '170dp',
        font:       appc.fonts.labelFont,
        textAlign:  'center',
        width:      'auto'
    });
    win1.add(labelPassword);

    var inputPassword = Ti.UI.createTextField({
        borderStyle : Ti.UI.INPUT_BORDERSTYLE_ROUNDED,
        backgroundColor: appc.colors.winBackground,
        borderColor : '#333',
        borderWidth : 1,
        font        : appc.fonts.inputFont,
        passwordMask: true,
        color       : '#336699',
        top         : '190dp',
        left        : '10%',
        width       : '80%',
        height      : '40dp',
        hintText    : 'Password',
        value       : ''
    });
    win1.add(inputPassword);

    var registerBtn = Titanium.UI.createButton({
        color:  '#999',
        backgroundColor: 'blue',
        title: "REGISTER",
        font: appc.fonts.buttonFont,
        textAlign:'center',
        top: '250dp',
        width:'150dp',
        height: '40dp'
    });
    win1.add(registerBtn);


    // this function handles the click of register button
    function registerBtnHandler() {
        Titanium.API.info('entering register btn handler');
        var email = inputEmail.value;
        var nick = inputNick.value;
        var password = inputPassword.value;
        if (!email || !nick|| !password) return;

        server.xhr({
            url: 'register-user',
            method: 'POST',
            data: {
                email: email,
                nick: nick,
                password: password
            },
            onload: function(data){
                Titanium.API.info(data.result);
                if(data.result){
                    win1.close();
                    server.user = nick;
                    server.password = password;
                    Titanium.App.fireEvent(appc.EVENT_REGISTER_OK);
                }else{
                    alert(L(data.error));
                };
            }
        });
    };

    win1.addEventListener('open',function(){
        registerBtn.addEventListener('click', registerBtnHandler );
    });


    win1.addEventListener('close',function(){
        registerBtn.removeEventListener('click', registerBtnHandler );
    });


    return win1;
};

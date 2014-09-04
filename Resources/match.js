module.exports = function()
{

    // Require the modules
    var server = require("/server");
    var cloud = require('/cloud');
    var appc = require("/appc");

    /*
     *
     *  D I F E R E N T    G R A P H I C S    E L E M E N T S
     *
     */

    //
    // create base UI tab and root win3dow
    //
    var win3 = Titanium.UI.createWindow({
        title:'Settings',
        backgroundColor:'#fff'
    });


    var labelPlayer1 = Titanium.UI.createLabel({
        color:      appc.colors.label,
        text:       'You: ' + server.user,
        top:        '30dp',
        font:       appc.fonts.labelFont,
        textAlign:  'center',
        width:      'auto'
    });
    win3.add(labelPlayer1);

    var labelScorePlayer1 = Ti.UI.createLabel({
        font        : appc.fonts.scoreFont,
        color       : appc.colors.score,
        top         : '50dp',
        left        : '10%',
        width       : '80%',
        textAlign   : 'center',
        height      : '40dp'
    });
    win3.add(labelScorePlayer1);

    var labelPlayer2 = Titanium.UI.createLabel({
        color:      appc.colors.label,
        text:       'Opponent: ' + server.currentOpponent.name,
        top:        '130dp',
        font:       appc.fonts.labelFont,
        textAlign:  'center',
        width:      'auto'
    });
    win3.add(labelPlayer2);

    var labelScorePlayer2 = Ti.UI.createLabel({
        font        : appc.fonts.scoreFont,
        color       : appc.colors.score,
        top         : '150dp',
        left        : '10%',
        width       : '80%',
        textAlign   : 'center',
        height      : '40dp'
    });
    win3.add(labelScorePlayer2);

    var claimPointBtn = Titanium.UI.createButton({
        backgroundImage:'/images/bluebtn.png',
        color:          appc.colors.label,
        title:          "CLAIM POINT",
        font:           appc.fonts.buttonFont,
        textAlign:      'center',
        width:          '200dp',
        height:         '200dp',
        bottom:         '50dp'
    });
    win3.add(claimPointBtn);

    var quitBtn = Titanium.UI.createButton({
        color:  '#999',
        backgroundColor: 'brown',
        title: "QUIT",
        font: appc.fonts.buttonFont,
        textAlign:'center',
        bottom: 0,
        width: '150dp',
        height: '40dp'
    });
    win3.add(quitBtn);


    /** ACTIONS **/

    function quitBtnHandler()
    {
        var dialog = Ti.UI.createAlertDialog({
            title: 'Do you want quit match really ?',
            buttonNames: ['QUIT', 'RETURN']
        });
        dialog.addEventListener('click', function(e){
            server.xhr({
               url: 'quit-match',
               method: 'PUT',
               onload: function(data){
                   if(data.result){
                       server.score = data.score;
                       win3.close();
                   }else{
                       alert(data.error);
                   }
               }
            });
        });
        dialog.show();
    }

    function claimPointBtnHandler()
    {
        Titanium.API.info('entering claim point btn handler');

        server.xhr({
            url: 'claim-point',
            method: 'PUT',
            onload: function(data){
                console.log(data);
                if(data.result){
                    labelScorePlayer1.text = data.score.you;
                    labelScorePlayer2.text = data.score.other;
                    if(data.youwin3){
                        alert('Congratulations, you win !!!');
                        setTimeout(function(){ win3.close(); }, 1500);
                    }
                };
            }
        });
    }

    function updateScores()
    {
        labelScorePlayer1.text = server.score.you;
        labelScorePlayer2.text = server.score.other;
    }

    win3.addEventListener('open',function(){
        updateScores();
        claimPointBtn.addEventListener('click', claimPointBtnHandler );
        quitBtn.addEventListener('click', quitBtnHandler );
        Titanium.App.addEventListener(appc.NOTIFICATION_SCORE_UPDATE, updateScores);
    });

    win3.addEventListener('close',function(){
        claimPointBtn.removeEventListener('click', claimPointBtnHandler );
        quitBtn.removeEventListener('click', quitBtnHandler );
        Titanium.App.removeEventListener(appc.NOTIFICATION_SCORE_UPDATE, updateScores);
    });

    return win3;

};


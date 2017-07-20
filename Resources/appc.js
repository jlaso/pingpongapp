
module.exports = {


    // Constant definitions

    NOTIFICATION_MATCH_STARTS: "notification_match_starts",
    NOTIFICATION_SCORE_UPDATE: "notification_score_update",
    
    NOTIFICATIONS_TICKS: 75,
    
    NOTIFICATION_USER_JOINED: 1,


    // EVENTS
    EVENT_REGISTER_OK: "event_register_ok",

    /**
     * SOME GENERAL SETTINGS
     */

    fonts: {
        inputFont: {fontSize:'18dp',fontFamily:'Helvetica Neue'},
        scoreFont: {fontSize:'36dp',fontFamily:'Helvetica Neue'},
        labelFont: {fontSize:'16dp',fontFamily:'Helvetica Neue'},
        buttonFont: {fontSize:'18dp',fontFamily:'Helvetica Neue'}
    },

    colors: {
        background: "#000",
        winBackground: "#fff",
        label: "#999",
        score: "blue"
    },

    // GPS
    coords: {
        // GeeksHubs coordinates
        longitude: -0.355112,
        latitude : 39.47901,
        accuracy: 0
    }



};

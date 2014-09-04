(function(){

    Titanium.API.info("[Starting app]");

    var mainMod = require("/mainWindow");
    var mainWin = mainMod();
    mainWin.open();

})();

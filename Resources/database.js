var dbName = 'ppcounter';

if (Ti.Platform.name === 'android' && Ti.Filesystem.isExternalStoragePresent()){
    var ext = '.db';
    var dbI = Titanium.Filesystem.externalStorageDirectory + dbName + ext;
}else{
    var ext = '';
    var dbI = '/' + dbName + ext;
}

module.exports = {

    dbName: dbName,
    dbNameInstalled: dbI,

    dropDB: function()
    {
        Titanium.API.info("[database.js] Dropping DB...");
        var db = Titanium.Database.open(this.dbName);
        db.remove();
    },

    createDB: function()
    {
        Ti.API.info("[database.js] Installing DB...");
        var db = Titanium.Database.install(this.dbNameInstalled, this.dbName);
        Titanium.App.Properties.setString("dbVersion", "1.0");
        if(Titanium.Platform.osname==="ipad" || Titanium.Platform.osname==="iphone"){
            db.file.setRemoteBackup(false);
        }
    },

    openDB  : function()
    {
        var db = Titanium.Database.open(this.dbName);
        db.execute('CREATE TABLE IF NOT EXISTS user (nick varchar(30), pass varchar(30))');
        return db;
    },

    getUser : function()
    {
        var record = null;
        var db     = this.openDB();
        var rows   = db.execute("SELECT * FROM user WHERE nick != '' LIMIT 1");
        if(rows.isValidRow()){
            record = {
                'nick': rows.fieldByName('nick'),
                'pass': rows.fieldByName('pass')
            };
            rows.close();
            Titanium.API.info("[database.js] User " + record.nick + " fetched");
        }
        db.close();
        return record;

    },

    saveUser : function(nick,pass)
    {
        var db = this.openDB();
        Titanium.API.info("[database.js] Inserting user " + nick + " in DB");
        // we only need to register last user
        db.execute('DELETE FROM user');
        db.execute('INSERT INTO user ( nick, pass ) VALUES ( ?, ? ) ', nick, pass);
        db.close();
    }

};



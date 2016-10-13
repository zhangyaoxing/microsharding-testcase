var MongoClient = require("mongodb").MongoClient;
var config = require("config");
var assert = require("assert");
var _ = require("underscore");

module.exports = (function () {
    var _db = null;
    var connect = function (callback) {
        console.log("Connecting mongodb...");
        var connString = config.connection;
        MongoClient.connect(connString, function (err, db) {
            if (err) {
                console.error("Connect to mongodb failed: %s", err);
                console.error(err.stack);
                callback(err);
                return;
            }
            console.log("Mongodb connected.")
            _db = db;
            callback(null, db);
        });
    };
    return {
        getDB: function (callback) {
            if (_db) {
                callback(null, _db);
            } else {
                connect(callback);
            }
        },
    };
})();
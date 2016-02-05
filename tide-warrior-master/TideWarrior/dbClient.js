var poolModule = require('generic-pool');
var config = require('./config');
var debug = require('debug')('TideWarrior:dbClient');

// using maximum of 50 connections for the pool
// this will most likely be tweaked as time goes on
var dbPool = poolModule.Pool({
    name     : 'mariasql',
    create   : function(callback) {
        var MariaClient = require('mariasql');
        var client = new MariaClient();
        client.connect({
		  host: config.db.host,
		  port: config.db.port,
		  user: config.db.user,
		  password: config.db.password,
		  db: config.db.dbName
		});

		client
			.on('connect', function() {
        		callback(null, client);
			})
			.on('error', function(err) {
				var respErr = {};
				respErr.message = "Error connecting to the database server";
				respErr.databaseError = err;
				callback(respErr, null);
			});

    },
    destroy  : function(client) {
			    	client.end();
			   },
    max      : 50,
    // specifies how long a resource can stay idle in pool before being removed
    idleTimeoutMillis : 30000,
    log : true
});

function dbClient () {}

dbClient.prototype.query = function (queryString, callback, substitutions) {
	debug(queryString);
	dbPool.acquire(function(err, client) {
	    if (err) {
	        if (callback) {
	        	callback(err, null);
	        }
	    }
	    else {
	    	var results = [];
	    	var errorOccured = false;
	        client.query(queryString, substitutions)
				.on('result', function(res) {
					res
						.on('row', function(row) {
						    results.push(row);
						})
					    .on('error', function(err) {
					    	errorOccured = true;
					    	if (callback) {
					    		callback(err, null);
					    	}
					    })
				})
				.on('end', function() {
	            	dbPool.release(client);
	            	if (callback && !errorOccured) {
	            		callback(null, results);
	            	}
				});
	    }
	});
};

module.exports = new dbClient();
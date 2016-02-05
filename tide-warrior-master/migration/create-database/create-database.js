var rlSync = require('readline-sync'),
	answer = "",
	MariaClient = require('mariasql'),
	db = new MariaClient(),
	rootUser = "root", // username of root of your local mariaDB server
	rootPassword = "", // root's password
	scriptPrefix = "Script: ",
	dbPrefix = "Database server says: ";

answer = rlSync.question("Database Root User: (default is '" +
							rootUser + "')\n");
if (answer) {
	rootUser = answer;
}

answer = rlSync.question("Database Root Password: (default is '" + 
						  rootPassword + "')\n", {
			hideEchoBack: true
			});
if (answer) {
	rootPassword = answer;
}

console.log();

db.connect({
  host: 'localhost',
  port: 3306,
  user: rootUser,
  password: rootPassword
});

db
	.on('connect', function() {
		console.log(scriptPrefix + "Succesfully connected to the database server");
		afterDbConnection();
	})
	.on('error', function(err) {
	   console.log(scriptPrefix + "Error connecting to the database server");
	 })
	 .on('close', function(hadError) {
	   console.log(scriptPrefix + "Connection to database server sucessfully closed");
	 });

var afterDbConnection = function () {
	var user = 'tide-warrior', // username for our new default user
		host = 'localhost',
		password = 'p@55w0rd', // default password for new user
		dbName = 'tide', // our new default database name
		characterSet = 'utf8',
		collate = 'utf8_general_ci';

	var createDbStatement = db.prepare("CREATE DATABASE " +
					  	 	   dbName + " CHARACTER SET = ? COLLATE = ?");

	var createUserStatement = db.prepare("GRANT ALL ON " + dbName +
								  ".* TO ?@? IDENTIFIED BY ?");

	var runQuery = function (statement, successCallback, substitutions) {
		var querySuccess = false;
		db.query(statement(substitutions))
			.on('result', function(res) {
				res
					.on('row', function(row) {
					    console.log(dbPrefix + row);
					})
				    .on('error', function(err) {
				    	console.log(dbPrefix + err);
				    	console.log(scriptPrefix + "Error occured, disconnecting from database server");
						db.end();
				    })
				    .on('end', function(info) {
				     	querySuccess = true;
				    });
			})
			.on('end', function() {
				if (querySuccess && successCallback) {
					successCallback();
				}
			});
	};

	var createUserCallback = function () {
		console.log(scriptPrefix + "Created user '" + user + "' and granted all " +
					"permissions on '" + dbName + "' database");
		console.log(scriptPrefix + "End of script. Please wait for disconnection.");
		db.end();
	};

	var createDbCallback = function () {
		console.log(scriptPrefix + "Created Database with Name '" +
					dbName + "'");
		// create our default user and grant him permission on our default database
		runQuery(createUserStatement, createUserCallback, [user, host, password]);
	};

	// create a new database with our defined database name
	runQuery(createDbStatement, createDbCallback, [characterSet, collate]);
};
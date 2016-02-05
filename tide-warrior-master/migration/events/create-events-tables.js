var MariaClient = require('mariasql'),
	fs = require('fs'),
	path = require('path'),
	db = new MariaClient(),
	user = "tide-warrior", // our existing default database user
	password = "p@55w0rd", // his password
	dbName = "tide", // our existing default database
	scriptPrefix = "Script: ",
	dbPrefix = "Database server says: ";

db.connect({
  host: 'localhost',
  port: 3306,
  user: user,
  password: password,
  db: dbName
});

db
	.on('connect', function() {
		console.log(scriptPrefix + "Succesfully connected to the database '" + dbName + "'");
		afterDatabaseConnection();
	})
	.on('error', function(err) {
	   console.log(scriptPrefix + "Error connecting to the database server");
	 })
	 .on('close', function(hadError) {
	   console.log(scriptPrefix + "Connection to database server sucessfully closed");
	 });

var afterDatabaseConnection = function () {
	// the tables that store events information
	var categoriesTb = 'events_categories',
		eventsTb = 'events',
		geolocationsTb = 'geolocations';

	var createCategoriesTbStatement = db.prepare("CREATE TABLE " + categoriesTb +
										 "( " +
										 "category_id INT NOT NULL AUTO_INCREMENT, " +
										 "category_name VARCHAR(50) NOT NULL, " +
										 "PRIMARY KEY (category_id), " +
										 "UNIQUE (category_name) " +
										 ")");

	var createEventsTbStatement = db.prepare("CREATE TABLE " + eventsTb +
									 "( " +
								     "event_id INT NOT NULL AUTO_INCREMENT, " +
								     "event_category INT NOT NULL, " +
								     "event_location INT NOT NULL, " +
								     "event_name VARCHAR(100), " +
								     "event_tags TEXT, " +
								     "event_date DATE, " +
								     "event_time TIME, " +
								     "event_description VARCHAR(150), " +
								     "PRIMARY KEY (event_id), " +
								     "FOREIGN KEY (event_category) " +
								     "REFERENCES " + categoriesTb + " (category_id) " +
								     "ON UPDATE CASCADE ON DELETE RESTRICT, " +
								     "FOREIGN KEY (event_location) " +
								     "REFERENCES " + geolocationsTb + " (location_id) " +
								     "ON UPDATE CASCADE ON DELETE RESTRICT " +
									 ")");

	var insertCategoryStatement = db.prepare("INSERT INTO " + categoriesTb + " SET " +
									 "category_name = ?");

	var insertEventsStatement = db.prepare("INSERT INTO " + eventsTb + "(event_category, " +
								   "event_location, event_name, event_tags, event_date) SELECT " + categoriesTb +
								   ".category_id, " + geolocationsTb + ".location_id, ?, ?, ? FROM " +
								   categoriesTb + ", " + geolocationsTb + " WHERE " + categoriesTb +
								   ".category_name = ? AND " + geolocationsTb + ".location_points = " +
								   "PointFromText(?)");

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

	var insertData = function () {
		var events_dir = path.resolve(process.env.PWD, 'events-json');
		console.log(scriptPrefix + "Inserting the data from the json files in " + events_dir);
		fs.readdir(events_dir, function(err, files) {
		 	if (err) {
		 		console.log(scriptPrefix + "Error opening 'events' directory");
		 		console.log(scriptPrefix + "Make sure the events json files are in " + events_dir);
		 		console.log(scriptPrefix + "Error occured, disconnecting from database server");
				db.end();
		 	}

		 	else {
		 		var semaphore = 0;

		 		var checkLastQueryCalled = false;
		 		var checkLastQuery = function () {
		 			if (semaphore === 0 && !checkLastQueryCalled) {
		 				checkLastQueryCalled = true;
	 					console.log(scriptPrefix + "Added all data from json files to appropriate tables");
	 					console.log(scriptPrefix + "End of script. Please wait for disconnection.");
		 				db.end();
		 			}
		 		};

			 	files.forEach(function(file) {
			 		++semaphore;
			 		var filePath = path.resolve(events_dir, file);
			 		fs.readFile(filePath,'utf8',function(err, data) {
			 			--semaphore;
			 			if (!err) {
			 				var categoryName = path.basename(filePath, '.json').split("_").join(" ");
			 				var jsonObj = JSON.parse(data);

			 				var insertEachEvent = function () {
				 				jsonObj.randomEvents.forEach(function(info) {
					 					var eventLat = info.geometry.location.lat;
					 					var eventLng = info.geometry.location.lng;
					 					var eventName = info.name;
					 					var dateObj = new Date(info.date);
					 					var eventDate = dateObj.getFullYear() + "-" +
					 									(dateObj.getMonth() + 1) + "-" +
					 									dateObj.getDate();
					 					var eventTags = categoryName+",party,fun";

				 						runQuery(insertEventsStatement, checkLastQuery, [
				 								eventName,
				 								eventTags,
				 								eventDate,
				 								categoryName,
				 								"POINT(" + eventLat + " " + eventLng + ")"
				 							]);
				 				});
			 				};

			 				runQuery(insertCategoryStatement, insertEachEvent, [categoryName]);
			 			}
			 		});
			 	});
			}
		});
	};

	var createEventsTbCallback = function () {
		console.log(scriptPrefix + "Created new Table '" + eventsTb + "'");
		// insert the data from the json files in events
		// folder into the database
		insertData();
	};

	var createCategoriesTbCallback = function () {
		console.log(scriptPrefix + "Created new Table '" + categoriesTb + "'");
		// create new table that will store the main events information
		runQuery(createEventsTbStatement, createEventsTbCallback);
	};

	// create new table that will store the events categories information
	runQuery(createCategoriesTbStatement, createCategoriesTbCallback);
};
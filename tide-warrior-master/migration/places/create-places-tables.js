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
	// the tables that store places information
	var categoriesTb = 'places_categories',
		placesTb = 'places',
		geolocationsTb = 'geolocations';

	var createCategoriesTbStatement = db.prepare("CREATE TABLE " + categoriesTb +
										 "( " +
										 "category_id INT NOT NULL AUTO_INCREMENT, " +
										 "category_name VARCHAR(50) NOT NULL, " +
										 "PRIMARY KEY (category_id), " +
										 "UNIQUE (category_name) " +
										 ")");

	var createGeolocationsTbStatement = db.prepare("CREATE TABLE " + geolocationsTb +
										   "( " +
										   "location_id INT NOT NULL AUTO_INCREMENT, " +
										   "location_points POINT NOT NULL, " +
										   "location_address VARCHAR(200), " +
										   "PRIMARY KEY (location_id), " +
										   "UNIQUE (location_points) " +
										   ")");

	var createPlacesTbStatement = db.prepare("CREATE TABLE " + placesTb +
									 "( " +
								     "place_id INT NOT NULL AUTO_INCREMENT, " +
								     "place_category INT NOT NULL, " +
								     "place_location INT NOT NULL, " +
								     "place_name VARCHAR(100), " +
								     "place_tags TEXT, " +
								     "PRIMARY KEY (place_id), " +
								     "FOREIGN KEY (place_category) " +
								     "REFERENCES " + categoriesTb + " (category_id) " +
								     "ON UPDATE CASCADE ON DELETE RESTRICT, " +
								     "FOREIGN KEY (place_location) " +
								     "REFERENCES " + geolocationsTb + " (location_id) " +
								     "ON UPDATE CASCADE ON DELETE RESTRICT " +
									 ")");

	var insertCategoryStatement = db.prepare("INSERT INTO " + categoriesTb + " SET " +
									 "category_name = ?");

	var insertLocationStatement = db.prepare("INSERT INTO " + geolocationsTb + " SET " +
									 "location_points = PointFromText(:geometry), " +
									 "location_address = :addr ON DUPLICATE KEY UPDATE " +
									 "location_address = :addr");

	var insertPlacesStatement = db.prepare("INSERT INTO " + placesTb + "(place_category, " +
								   "place_location, place_name, place_tags) SELECT " + categoriesTb +
								   ".category_id, " + geolocationsTb + ".location_id, ?, ? FROM " +
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
		var places_dir = path.resolve(process.env.PWD, 'places-json');
		console.log(scriptPrefix + "Inserting the data from the json files in " + places_dir);
		fs.readdir(places_dir, function(err, files) {
		 	if (err) {
		 		console.log(scriptPrefix + "Error opening 'places' directory");
		 		console.log(scriptPrefix + "Make sure the places json files are in " + places_dir);
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
			 		var filePath = path.resolve(places_dir, file);
			 		fs.readFile(filePath,'utf8',function(err, data) {
			 			--semaphore;
			 			if (!err) {
			 				var categoryName = path.basename(filePath, '.json').split("_").join(" ");
			 				var jsonObj = JSON.parse(data);

			 				var insertEachPlace = function () {
				 				jsonObj.results.forEach(function(info) {
					 					var placeLat = info.geometry.location.lat;
					 					var placeLng = info.geometry.location.lng;
					 					var placeName = info.name;
					 					var placeTags = info.types.toString();
					 					var placeAddress = info.vicinity;

					 					var insertThisPlace = function () {
					 						runQuery(insertPlacesStatement, checkLastQuery, [
					 								placeName,
					 								placeTags,
					 								categoryName,
					 								"POINT(" + placeLat + " " + placeLng + ")"
					 							]);
					 					};

					 					runQuery(insertLocationStatement, insertThisPlace,
					 							 {
					 							 	geometry: "POINT(" + placeLat +
					 							 			  " " + placeLng + ")",
					 							 	addr: placeAddress
					 							 });
				 				});
			 				};

			 				runQuery(insertCategoryStatement, insertEachPlace, [categoryName]);
			 			}
			 		});
			 	});
			}
		});
	};

	var createPlacesTbCallback = function () {
		console.log(scriptPrefix + "Created new Table '" + placesTb + "'");
		// insert the data from the json files in locations/places
		// folder into the database
		insertData();
	};

	var createGeolocationsTbCallback = function () {
		console.log(scriptPrefix + "Created new Table '" + geolocationsTb + "'");
		// create new table that will store the actual places information
		runQuery(createPlacesTbStatement, createPlacesTbCallback);
	};

	var createCategoriesTbCallback = function () {
		console.log(scriptPrefix + "Created new Table '" + categoriesTb + "'");
		// create new table that will store the geolocation information
		runQuery(createGeolocationsTbStatement, createGeolocationsTbCallback);
	};

	// create new table that will store the places categories information
	runQuery(createCategoriesTbStatement, createCategoriesTbCallback);
};
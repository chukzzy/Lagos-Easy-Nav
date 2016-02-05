var fs = require('fs');
var http = require("http");
var needle = require('needle');
var querystring = require('querystring');
var url = require('url');

var location = null;
var radius = null;
var key = null;

var places_types =  [
    'accounting',
    'airport',
    'amusement_park',
    'aquarium',
    'art_gallery',
    'atm',
    'bakery',
    'bank',
    'bar',
    'beauty_salon',
    'bicycle_store',
    'book_store',
    'bowling_alley',
    'bus_station',
    'cafe',
    'campground',
    'car_dealer',
    'car_rental',
    'car_repair',
    'car_wash',
    'casino',
    'cemetery',
    'church',
    'city_hall',
    'clothing_store',
    'convenience_store',
    'courthouse',
    'dentist',
    'department_store',
    'doctor',
    'electrician',
    'electronics_store',
    'embassy',
    'establishment',
    'finance',
    'fire_station',
    'florist',
    'food',
    'funeral_home',
    'furniture_store',
    'gas_station',
    'general_contractor',
    'grocery_or_supermarket',
    'gym',
    'hair_care',
    'hardware_store',
    'health',
    'hindu_temple',
    'home_goods_store',
    'hospital',
    'insurance_agency',
    'jewelry_store',
    'laundry',
    'lawyer',
    'library',
    'liquor_store',
    'local_government_office',
    'locksmith',
    'lodging',
    'meal_delivery',
    'meal_takeaway',
    'mosque',
    'movie_rental',
    'movie_theater',
    'moving_company',
    'museum',
    'night_club',
    'painter',
    'park',
    'parking',
    'pet_store',
    'pharmacy',
    'physiotherapist',
    'place_of_worship',
    'plumber',
    'police',
    'post_office',
    'real_estate_agency',
    'restaurant',
    'roofing_contractor',
    'rv_park',
    'school',
    'shoe_store',
    'shopping_mall',
    'spa',
    'stadium',
    'storage',
    'store',
    'subway_station',
    'synagogue',
    'taxi_stand',
    'train_station',
    'travel_agency',
    'university',
    'veterinary_care',
    'zoo'
]

function getLocations(type) {
	var options = {
	    rejectUnauthorized: false,
	    requestCert: true,
	    agent: false
	}

	var google_places_options = {
	   location: location.A+","+location.F,
	   radius: radius,
	   types: [type],
	   key: key
	}

	needle.get('https://maps.googleapis.com/maps/api/place/nearbysearch/json?'+querystring.stringify(google_places_options), options,
	    function(err, resp, body) {
	    	if (!err) {
	    		fs.writeFile("places/"+type+".json", JSON.stringify(body, null, 4));
	    	}
	    }
	);
}

var default_html = (function() {/*
						<!DOCTYPE "html">
						<html>
							<head>
								<title>Find Google Places</title>
							</head>
							<body>
					*/}).toString().match(/[^]*\/\*([^]*)\*\/\}$/)[1];

var default_close_html = (function() {/*
								</body>
						 	</html>
						 */}).toString().match(/[^]*\/\*([^]*)\*\/\}$/)[1];

http
	.createServer(function(request, response) {
		var query = url.parse(request.url, true).query;
		var html = default_html;
		if (query.location) {
			location = JSON.parse(query.location);
			radius = query.radius;
            key = query.key;
			html += 'The server is now getting the places.\n \
					 Please check the \'places\' directory on your local machine';
		}
		else {
			// Lagos : 6.5482201,3.3975005
			location = null;
			radius = null;
            key = null;
			html += (function() {/*
						Lat: <input id="lat" class="text" type="text">
						Lng: <input id="lng" class="text" type="text">
						Radius: <input id="radius" class="text" type="text">
                        Google Places API Key: <input id="key" class="text" type="text">
						<input type="button" value="Get Places" onclick="resolve()">
						<script src="https://maps.googleapis.com/maps/api/js?libraries=places">
						</script>
						<script>
							function resolve() {
								var lat = document.getElementById("lat").value;
								var lng = document.getElementById("lng").value;
								var rad = document.getElementById("radius").value;
                                var key = document.getElementById("key").value;
								obj = new google.maps.LatLng(lat,lng);
								window.location.href = window.location.href + "?location="+JSON.stringify(obj)+"&radius="+rad+"&key="+key;
							}
						</script>
					*/}).toString().match(/[^]*\/\*([^]*)\*\/\}$/)[1];
		}
		response.writeHead(200, {"Content-Type": "text/html"});
		html += default_close_html;
		response.write(html);
		response.end();

		if (location != null && key != null) {
			places_types.forEach(getLocations);
		}
	})

	.listen(3000);

	console.log('server started');
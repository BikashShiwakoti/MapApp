// <!-- "StAuth10244: I Bikash Shiwakoti, 000891600 certify that this material is my original work.
// No other person's work has been used without due acknowledgement. I have not made my work available to anyone else."    -->

// This script initializes a Google Map with markers for waterfalls and museums,
// and provides functionality for displaying directions, geolocation, and address
// geocoding.

// It also includes functions to clear markers, create markers, get user location,
// place marker at a specific location, geocode an address, and calculate and
// display routes between two points.


var geocoder;
//array to store markers
var markers = [];
//array to store waterfalls
var waterFalls = [];
//array to store museums
var museums = [];

// Initialize and add the map
function initMap() {
    const directionsRenderer = new google.maps.DirectionsRenderer();
    const directionsService = new google.maps.DirectionsService();
    map = new google.maps.Map(document.getElementById('map'), {
        center: { lat: 43.25519362963844, lng: -79.82911937359671},
        zoom: 10,
    });
    directionsRenderer.setMap(map);


    geocoder = new google.maps.Geocoder();

    var markerData = [
                {position: {lat: 43.2064879, lng: -79.7888392}, title: 'Little Davis Falls', content: 'Location: Hamilton, ON L8K 5E8'},
                {position: {lat: 43.2114631191582, lng: -79.75763200318329}, title: 'Lower Punchbowl Falls', content: 'Location: 185 Ridge Rd, Stoney Creek, ON L8J 2W1'},
                {position: {lat: 43.207809253620475, lng: -79.76662102188553}, title: 'Billy Green Falls', content: 'Location: Hamilton, ON L8J 1X5'},
                {position: {lat: 43.21035851501771, lng: -79.76829472024521}, title: 'Centinnial Falls', content: 'Location: 410 Centennial Pkwy, Stoney Creek, ON L8J 1X5'},
                {position: {lat: 43.20945638044161, lng: -79.77377033972373}, title: 'Glover\'s Falls', content: 'Location: Greenhill Ave, Hamilton, ON L8J 1X5'},
                {position: {lat: 43.24526524344636, lng: -79.81848249612297}, title: 'Hamilton Toy Museum', content: 'Location: 1231 Main St E, Hamilton, ON L8K 1A5'},
                {position: {lat: 43.27826761920517, lng: -79.85418806112916}, title: '31 Service Battalion Museum', content: 'Location: 650 Catherine Street North | 2nd Floor, Building 1:, Catharine St N, Hamilton, ON L8L 4V7'},
                {position: {lat: 43.270518668604005, lng: -79.88577375325002}, title: 'The Hamilton Military Museum', content: 'Location: 610 York Blvd, Hamilton, ON L8R 3H1'},
                {position: {lat: 43.26020485386525, lng: -79.77336887754295}, title: 'Hamilton Museum of Steam & Technology', content: 'Location: 900 Woodward Ave, Hamilton, ON L8H 7N2'},
                {position: {lat: 43.162130261987166, lng: -79.92488111439054}, title: 'Canadian Warplane Heritage Museum', content: 'Location: Hamilton, ON L9G 3K9'}
        
            ];

    for (let index = 0; index < markerData.length / 2; index++) {
        waterFalls.push(markerData[index]);
    }

    for (let index = markerData.length - 1; index > ((markerData.length / 2)-1); index--) {
        museums.push(markerData[index]);
    }

    markerData.forEach(createMarker);

    document.getElementById('fallButton').addEventListener('click', function () {
        clearAndCreateMarkers(waterFalls);
    });

    document.getElementById('museumButton').addEventListener('click', function () {
        clearAndCreateMarkers(museums);
    });

    document.getElementById('show').addEventListener('click', function () {
        markerData.forEach(createMarker);
    });

    document.getElementById("geolocate").onclick = getLocation;

    document.getElementById("addressButton").onclick = codeAddress;

    document.getElementById("direction").onclick = function () {
        calculateAndDisplayRoute(directionsService, directionsRenderer);}
}
//function to create markers
function createMarker(markerData) {
    var marker = new google.maps.Marker({
        position: markerData.position,
        map: map,
        title: markerData.title,
    });

    var infoWindow = new google.maps.InfoWindow({
        content: '<div id="content"><h1 id="firstHeading" class="firstHeading">' + markerData.title + '</h1><p>' + markerData.content + '</p></div>',
    });

    marker.addListener('click', function () {
        infoWindow.open(map, marker);
    });

    markers.push(marker);
    marker.addListener('click', function () {
        getDirections(marker);
    });
}

// function to create markers for waterfalls and museums
function clearAndCreateMarkers(data) {
    markers.forEach(function (marker) {
        marker.setMap(null);
    });

    markers = [];
    data.forEach(createMarker);
}


//function to get directions
  function getLocation() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(function(position) {
            var userLocation = {
                lat: position.coords.latitude,
                lng: position.coords.longitude
            };
            placeMarker(userLocation);
        }, function() {
            alert("Geolocation failed. Please ensure you've enabled location services.");
        });
    } else {
        alert("Geolocation is not supported by this browser.");
    }
}

//function to display marker
function placeMarker(location) {
    var marker = new google.maps.Marker({
        position: location,
        map: map,
        icon: "https://maps.google.com/mapfiles/kml/pal3/icon20.png",
    });
    markers.push(marker);
}

//function to add marker from user input   
function codeAddress() {
    var address = document.getElementById('address').value;

    geocoder.geocode({ 'address': address }, function (results, status) {
        if (status == 'OK') {
            map.setCenter(results[0].geometry.location);
            var marker = new google.maps.Marker({
                map: map,
                position: results[0].geometry.location,
                icon: "https://maps.google.com/mapfiles/kml/pal3/icon20.png",
            });
            markers.push(marker);
        } else {
            alert('Geocode was not successful for the following reason: ' + status);
        }
    });
}

//function to display directions
function calculateAndDisplayRoute(directionsService, directionsRenderer) {
    // Assuming you have a way to obtain the user's current position
    navigator.geolocation.getCurrentPosition(function (position) {
        const start = { lat: position.coords.latitude, lng: position.coords.longitude };
        const end = document.getElementById("end").value;

        directionsService.route({
            origin: start,
            destination: end,
            travelMode: google.maps.TravelMode.DRIVING,
        })
            .then((response) => {
                directionsRenderer.setDirections(response);
            })
            .catch((e) => window.alert("Directions request failed due to " + e.status));
    });
}


// Call the initMap function after the Google Maps API script has loaded
initMap();
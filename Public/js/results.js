var url=window.location.href;
    var place=(url.substring(url.indexOf("?")+1,url.indexOf("&&"))).replace("%20"," ");
    var interest=(url.substring(url.indexOf("&&")+2,url.length)).replace("%20"," ");
    var search_keyword=place+"***"+interest;

    console.log("It is !!!!!!!!!!!"+place);
    console.log("It is !!!!!!!!!!!"+interest);

    document.getElementById('back').addEventListener('click', function() {
        location.href='HomePage.html?place'+place+"&&interest"+interest;
    });
     addArray = [];
    angular.module('indexpage',[])
        .controller('indexctrl', function($scope, $http) {
            $http.get('http://127.0.0.1:8081/getPlaces?searchkey='+search_keyword).then(function(data)
            //$http.get("https://maps.googleapis.com/maps/api/place/textsearch/json?query="+place+"+point+of+interest"+interest+"&language=en&key=AIzaSyCvnpFKAcsp9bg94zysoNY7QLv-P3SghJ8").then(function (data)
            {
                if (data.data != null) {
                    var results = data.data.results.sort((a, b) => a.rating - b.rating);
                    var length = data.data.results.length;
                    for (var j = length - 1; j >=0; j--) {
                        addArray.push(results[j].formatted_address);
                    }
                    $scope.elements=addArray;
                    console.log(addArray.length);
                    console.log(typeof(addArray));
                }
            })
        });
    function initMap() {
        var directionsService = new google.maps.DirectionsService;
        var directionsDisplay = new google.maps.DirectionsRenderer;
        var map = new google.maps.Map(document.getElementById('map'), {
            zoom: 6,
            center: {lat: 39.85, lng: -98.65}
        });
        directionsDisplay.setMap(map);

        document.getElementById('submit').addEventListener('click', function() {
            calculateAndDisplayRoute(directionsService, directionsDisplay);
        });
    }
    function calculateAndDisplayRoute(directionsService, directionsDisplay) {
        var waypts = [];
        var checkboxArray = document.getElementById('waypoints');
        for (var i = 0; i < checkboxArray.length; i++) {
            if (checkboxArray.options[i].selected) {
                waypts.push({
                    location: checkboxArray[i].value,
                    stopover: true
                });
            }
        }
        console.log(addArray[0]);
        console.log(addArray[19]);
        directionsService.route({
            // origin: addArray[0],
            // destination: addArray[19],
            origin: document.getElementById('start').value,
            destination: document.getElementById('end').value,
            waypoints: waypts,
            optimizeWaypoints: true,
            travelMode: 'DRIVING'
        }, function (response, status) {
            if (status === 'OK') {
                directionsDisplay.setDirections(response);
                var route = response.routes[0];
                var summaryPanel = document.getElementById('directions-panel');
                summaryPanel.innerHTML = '';
                // For each route, display summary information.
                for (var i = 0; i < route.legs.length; i++) {
                    var routeSegment = i + 1;
                    summaryPanel.innerHTML += '<b>Route Itinerary : ' + routeSegment +
                        '</b><br>';
                    summaryPanel.innerHTML += route.legs[i].start_address + ' to ';
                    summaryPanel.innerHTML += route.legs[i].end_address + '<br>';
                    summaryPanel.innerHTML += route.legs[i].distance.text + '<br><br>';
                }
                var summaryPanel1 = document.getElementById('results');
                for (var i = 0; i < route.legs.length; i++) {
                    var routeSegment1 = i + 1;
                    summaryPanel1.innerHTML += '<div class="col-lg-6 offers_col" style="background-image: url(images/fact_background.jpg);">\n' +
                        '                <div class="offers_item">\n' +
                        '                    <div class="row">\n' +
                        '                        <div class="col-lg-6">\n' +
                        '                            <div class="offers_content">\n' +
                        '                                <div class="offers_price" style="color:rebeccapurple;">$70<span>per night</span></div>\n' +
                        '                                <p class="offers_text" style="color:antiquewhite;">Route Itinerary :'+routeSegment+'</p>\n' +
                        '                                <p class="offers_text" style="color:antiquewhite;">Start Address: '+route.legs[i].end_address+'</p>\n' +
                        '                                <p class="offers_text" style="color:antiquewhite;">End Address: '+route.legs[i].end_address+'</p>\n' +
                        '                                <p class="offers_text" style="color:antiquewhite;">Distance: '+route.legs[i].distance.text+'</p>\n' +
                        '                                <div class="offers_link"><a href="offers.html">read more</a></div>\n' +
                        '                            </div>\n' +
                        '                        </div>\n' +
                        '                    </div>\n' +
                        '                </div>\n' +
                        '            </div>'

                }
            } else {
                window.alert('Directions request failed due to ' + status);
            }
        });
    };
    function hideFunction() {
        var x = document.getElementById("directions-panel");
        if (x.style.display === "none") {
            x.style.display = "block";
        }
    }
/*
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */

var map, maxlat, maxlng, minlat, minlng, intensity, maxDate;

function initMap() {
    map = new google.maps.Map(document.getElementById('map'), {
        center: {lat: -33.4726900, lng: -70.6472400},
        zoom: 15
    })
    var geocoder = new google.maps.Geocoder();
    document.getElementById('btnSearch').addEventListener('click', function(){
        changeAddress(geocoder, map);
    });
    document.getElementById('searchEarthQuake').addEventListener('click', function(){
        searchEarthQuake(maxlat, maxlng, minlat, minlng);
    });
};

function changeAddress(geocoder, map) {
    var address = document.getElementById('address').value;
    geocoder.geocode({'address': address }, function(results, status){
        if(status === 'OK') {
            map.setCenter(results[0].geometry.location);
            var marker = new google.maps.Marker({
                map: map,
                position: results[0].geometry.location
              });
            maxlat = ( results[0].geometry.location.lat() + 5); 
            maxlng = ( results[0].geometry.location.lng() + 5); 
            minlat = ( results[0].geometry.location.lat() - 5); 
            minlng = ( results[0].geometry.location.lng() - 5); 
        } else {
            console.log('Fallo ' + status);
        }
    });
}
function searchEarthQuake(maxlat, maxlng, minlat, minlng) {
    maxDate = document.getElementById('maxDate').value;
    intensity = document.getElementById('minIntensity').value;
    $.ajax({
        url: 'https://earthquake.usgs.gov/fdsnws/event/1/query?format=geojson&starttime='+maxDate+'&minlatitude='+minlat+'&maxlatitude='+maxlat+'&minlongitude='+minlng+'&maxlongitude='+maxlng+'&minmagnitude='+intensity+'',
        success: function (result){
            console.log(result.features[0].properties.title);
            console.log(result.features[0].properties.mag);
            var aux = result.features[0].properties.time;
            var temp = new Date(result.features[0].properties.time);
            var utc = temp.toUTCString();
            console.log(utc);
            console.log(result.features[0].properties.url);
        },
        error: function(result){
            console.log(result);
        }
    });
}
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
            maxlat = ( results[0].geometry.location.lat() + 2); 
            maxlng = ( results[0].geometry.location.lng() + 2); 
            minlat = ( results[0].geometry.location.lat() - 2); 
            minlng = ( results[0].geometry.location.lng() - 2); 
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
            //console.log(result.features[0].properties.title);
            //console.log(result.features[0].properties.mag);
            /*var aux = result.features[0].properties.time;
            
            
            console.log(utc);
            console.log(result.features[0].properties.url);
            alert(result.features[0].properties.title);
            */
           /*
           var array = string[];
           result.forEach(function(result){
            array[0].push(result.features[0].properties.title);
          
        });
        */
       var array2 = [3];
       var largo = result.features.length;
       console.log(largo)
        var array = [largo];
            for (let i = 0; i < largo; i++) {
                        array[i]= array2;
                        //asignacion de datos de fecha
                        var temp = new Date(result.features[i].properties.time);
                        var utc = temp.toUTCString();
                        array2[0] = utc;
                        console.log(array2[0]);
                        //asignacion de ubicacion
                        array2[1] = result.features[i].properties.title;
                        console.log(array2[1]);
                        //dato de magnitud
                         array2[2]=result.features[i].properties.mag;
                         console.log(array2[2]);
                
            }

            sql2(array);
        },
        error: function(result){
            console.log(result);
        }
    });
}


function sql2(array = [])
{	
	var db = sqlitePlugin.openDatabase('Sismos.db', '1.0', '', 10*20);
db.transaction(function (txn) {
 txn.executeSql('CREATE TABLE IF NOT EXISTS Lugares (id integer primary key, titulo, magnitud,tiempo)');
  txn.executeSql('delete from Lugares');
  for(var i = 0;i<array.length;i++) {

    txn.executeSql('INSERT INTO Lugares (tiempo, magnitud,titulo) VALUES (?,?,?)', [array.array2[0], array.array2[2],array.array2[1]]);
  
  }
  
  txn.executeSql('SELECT * FROM Lugares', [], function(tx, results) {
			var len = results.rows.length;
			var i;
			console.log(len);
			for (i = 0; i < len; i++) {
				$("#lista_de_Lugares").append("" + results.rows.item(i).tiempo + " - " + results.rows.item(i).magnitud +" - " + results.rows.item(i).titulo + "<br>");
			}
		}, null);

});
}//fin function

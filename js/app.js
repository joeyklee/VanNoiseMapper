$(document).ready(function(){

	// ---------- Initialize Map Object ---------- //
	var map = L.map('map', {
	    center: [49.282153, -123.124085],
	    zoom: 14,
	    maxZoom:20,
	    attributionControl:false,
	    zoomControl: false
	});
	var info = L.mapbox.infoControl({position:'topright'});
	info.addTo(map);

    L.control.zoom({position:'topleft'}).addTo(map);

	var Stamen_Toner = L.tileLayer('http://{s}.tile.stamen.com/toner/{z}/{x}/{y}.png', {
        attribution: 'Map tiles by <a href="http://stamen.com">Stamen Design</a>, <a href="http://creativecommons.org/licenses/by/3.0">CC BY 3.0</a> &mdash; Map data &copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
        subdomains: 'abcd',
        minZoom: 0,
        maxZoom: 20
    }).addTo(map);

	var googleImagery = new L.Google('SATELLITE');

    var baseMaps = {
        "Stamen Toner": Stamen_Toner,
        "Google Imagery": googleImagery
    };

    L.control.layers(baseMaps,null, {position:'topright'}).addTo(map); //bottomright

    var income = L.featureGroup([])
    var housing = L.featureGroup([])
    var transit = L.featureGroup([]).bringToFront();

    // ---------------- Census data------------------ //
    function getminmax(datafeatures, val){
            var dataMin = d3.min(datafeatures, function(d){
                if (d.properties[val] >0){
                    return d.properties[val] }});
            var dataMax = d3.max(datafeatures, function(d){
                return d.properties[val]});

            return [dataMin, dataMax];
    }

   
    // --- Industrial Layer --- //
    d3.json("data/census2011_vancity.geojson", function(data) {
        // -------------- Set Scales -------------- //
        console.log(data);


        // -------------- Set Scales -------------- //
        // get max and min
        hhiMin = getminmax(data.features,'MedHHI')[0]
        hhiMax = getminmax(data.features,'MedHHI')[1]
        var hhicolor = d3.scale.log()
                      .domain([hhiMin, hhiMax])
                      .range(["#E0FFF0","#1F3329"]);

        houseMin = getminmax(data.features,'MedHVal')[0]
        houseMax = getminmax(data.features,'MedHVal')[1]
        var housecolor = d3.scale.log()
                      .domain([houseMin, houseMax])
                      .range(["#F0E0FF","#523D66"]);                  


        var hhistyle = function style(feature) {
                return {
                    fillColor: hhicolor(feature.properties.MedHHI), //feature.properties.MedHHI
                    weight: 0.25,
                    opacity: 0.75,
                    color: '#fff', //#fff
                    // dashArray: '3',
                    fillOpacity: 0.75
                };
            }
        var houseStyle = function style(feature) {
                return {
                    fillColor: housecolor(feature.properties.MedHVal), //feature.properties.MedHHI
                    weight: 0.25,
                    opacity: 0.75,
                    color: '#fff', //#fff
                    // dashArray: '3',
                    fillOpacity: 0.75
                };
            }
        // Load Geojson Points using Native Leaflet
        var census_income = L.geoJson(data, {
            style: hhistyle
        }).addTo(income);

        var census_housing = L.geoJson(data, {
            style: houseStyle
        }).addTo(housing);
    }); // D3 End
    
    d3.json("data/busroutes.geojson", function(data) {
        // -------------- Set Scales -------------- //
        var svgstyle = function style(feature) {
                return {
                    // fillColor: '#000', //feature.properties.MedHHI
                    weight: 3,
                    opacity: 0.5,
                    color: '#66CCFF', //#fff
                    // dashArray: '3',
                    // fillOpacity: 0.75
                };
            }
        
        var busroutes = L.geoJson(data, {
            style: svgstyle
        }).addTo(transit);
    }); // D3 End
    

    // layer adder
    $('#button-income').click(function() {
        if(map.hasLayer(income)){
            map.removeLayer(income);
            $('#button-income').css('background-color', '');
            $('#button-income span').css('color', '');
        }
        else{
            income.addTo(map);
            $('#button-income').css('background-color', '#8AE6B8');
            $('#button-income span').css('color', '#fff');
        }
    });

    $('#button-housing').click(function() {
        if(map.hasLayer(housing)){
            map.removeLayer(housing);
            $('#button-housing').css('background-color', '');
            $('#button-housing span').css('color', '');
        }
        else{
            housing.addTo(map);
            $('#button-housing').css('background-color', '#9494FF');
            $('#button-housing span').css('color', '#fff');
        }
    });

     $('#button-transit').click(function() {
        if(map.hasLayer(transit)){
            map.removeLayer(transit);
            $('#button-transit').css('background-color', '');
            $('#button-transit span').css('color', '');
        }
        else{
            transit.addTo(map);
            $('#button-transit').css('background-color', '#66CCFF');
            $('#button-transit span').css('color', '#fff');
        }
    });




}); // docready end
$(document).ready(function(){

	// ---------- Initialize Map Object ---------- //
	var map = L.map('map', {
	    center: [49.2503, -123.062],
	    zoom: 11,
	    maxZoom:20,
	    attributionControl:false,
	    zoomControl: true
	});
	var info = L.mapbox.infoControl({position:'topright'});
	info.addTo(map);

	var Stamen_Toner = L.tileLayer('http://{s}.tile.stamen.com/toner/{z}/{x}/{y}.png', {
        attribution: 'Map tiles by <a href="http://stamen.com">Stamen Design</a>, <a href="http://creativecommons.org/licenses/by/3.0">CC BY 3.0</a> &mdash; Map data &copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
        subdomains: 'abcd',
        minZoom: 0,
        maxZoom: 20
    }).addTo(map);

	var googleImagery = new L.Google('SATELLITE');

    var baseMaps = {
        "CEE Map": Stamen_Toner,
        "Google Imagery": googleImagery
    };

    L.control.layers(baseMaps,null, {position:'topright'}).addTo(map); //bottomright

    // ---------------- industrial hydro ------------------ //
    // --- Industrial Layer --- //
    d3.json("data/industrial.geojson", function(data) {
        // -------------- Set Scales -------------- //
        // get max and min
        var dataMax = d3.max(data.features, function(d){
            return d.properties.PotentE});
        var dataMin = d3.min(data.features, function(d){
            return d.properties.PotentE});
        // Set the Color - Not necessary for this case
        var color = d3.scale.linear()
                      .domain([dataMin, dataMax])
                      .range(["#6631E8","#6631E8"]);
        // Set the Scale - Log Scale for emphasis
        var scale = d3.scale.log()
                      .domain([dataMin,dataMax])
                      .range([1, 15])
        // Style the Industrial Points Using helpful D3 tools 
        var industrialStyle = function (feature, latlng) {
            return L.circleMarker(latlng, {
                radius: scale(feature.properties.PotentE),
                fillColor: color(feature.properties.PotentE),
                color: "#000",
                weight: 1,
                opacity: 0,
                fillOpacity: 0.6
            });
        } 
        // Set the PopUp Content
        function onEachFeature(feature, layer) {
            // does this feature have a property named popupContent?
            var popupContent = "<p><center>Industry:"+ "<br/>" 
                                + feature.properties.CATEGORY+ "</center></p>";
            layer.bindPopup(popupContent);
            console.log(layer);
        }

        // Load Geojson Points using Native Leaflet
        var industralPoints = L.geoJson(data, {
            onEachFeature: onEachFeature,
            pointToLayer: industrialStyle
        }).addTo(industrial);
    }); // D3 End

    // --- Hydro Layer --- // 
    d3.json("data/bchydro_data.geojson", function(data){
        // -------------- Set Scales -------------- //
        // get max and min
        var dataMax = d3.max(data.features, function(d){
            return d.properties.AVG_ANN_EN});
        var dataMin = d3.min(data.features, function(d){
            return d.properties.AVG_ANN_EN});
        // Set the Color - Not necessary for this case
        var color = d3.scale.linear()
                      .domain([dataMin, dataMax])
                      .range(["#56ABFF","#56ABFF"])
        // Set the Scale - Log Scale for emphasis
        var scale = d3.scale.log()
                      .domain([dataMin,dataMax])
                      .range([1, 15])
        // Style the Industrial Points Using helpful D3 tools 
        var hydroStyle = function (feature, latlng) {
            return L.circleMarker(latlng, {
                radius: scale(feature.properties.AVG_ANN_EN),
                fillColor: color(feature.properties.AVG_ANN_EN),
                color: "#000",
                weight: 1,
                opacity: 0,
                fillOpacity: 0.6
            });
        }
        // Set the PopUp Content
        var hydroPopUp = function onEachFeature(feature, layer) {
            // does this feature have a property named popupContent?
            var popupContent = "<p><center>Potential Hydro Energy:"+ "<br/>" 
                                + feature.properties.AVG_ANN_EN + "</center></p>";
            layer.bindPopup(popupContent);
        }
        // Load Geojson Points using Native Leaflet
        var hydroPoints = L.geoJson(data, {
            onEachFeature: hydroPopUp,
            pointToLayer: hydroStyle
        }).addTo(hydro);
    }); // d3 end

}); // docready end
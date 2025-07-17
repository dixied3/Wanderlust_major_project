
 
  console.log(mapToken) ; 
	mapboxgl.accessToken = mapToken ; 
    const map = new mapboxgl.Map({
        container: 'map', // container ID
        center: listing.geometry.coordinates, // starting position [lng, lat]. Note that lat must be set between -90 and 90
        zoom: 9 // starting zoom
    });


    const marker = new mapboxgl.Marker({color : "red"})
        .setLngLat(listing.geometry.coordinates)
        .setPopup(new mapboxgl.Popup({offset: 25}).setHTML(`<p>${listing.location}</p>`))
        .addTo(map);


// but how to activate environmentL variables here ? coz rn. only ejs can access it so WE WILL ACCESS SCRIPT VIA. EJS THEN we will save them in sm variables and use then in our ejs
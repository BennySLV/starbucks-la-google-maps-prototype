/**
 * This file represents all functionality
 * for the Starbucks, Los Angeles, stores Google
 * Maps application.
 *
 * This application is part of Clever Programmer's
 * 6-Figure JavaScript Developer Challenge.
 *
 * @author Nazariy Dumanskyy, Ben Silveston
 */

let map;
let markers = [];
let infoWindow;

/**
 * Initialise map
 * for whenever the page loads.
 */
initMap = () => {
    let losAngeles = { lat: 34.06338, lng: -118.35808 };
    map = new google.maps.Map(document.getElementById("map"), {
        center: losAngeles,
        zoom: 11,
        mapTypeId: "roadmap",
    });
    let marker = new google.maps.Marker({
        position: losAngeles,
        map: map,
        title: "Los Angeles, CA, USA",
    });
    marker.setMap(map);
    infoWindow = new google.maps.InfoWindow();
    searchStores();
};

/**
 * Search for a list of stores
 * based on the given zip code.
 */
searchStores = () => {
    let storesFound = [];
    let zipCode = document.getElementById("zip-code-input").value;
    if (zipCode) {
        for (let store of stores) {
            let postal = store["address"]["postalCode"].substring(0, 5);
            if (postal == zipCode) {
                storesFound.push(store);
            }
        }
    } else {
        storesFound = stores;
    }
    clearLocations();
    displayStores(storesFound);
    showStoresMarkers(storesFound);
    setOnClickListener();
    setTriggerButtonListener();
};

/**
 * Enable the click functionality
 * on the stores list
 */
setOnClickListener = () => {
    let storeElements = document.querySelectorAll(".store-container");
    storeElements.forEach((element, index) => {
        element.addEventListener("click", () => {
            new google.maps.event.trigger(markers[index], "click");
        });
    });
};

/**
 * Enable the "enter" button
 * functionality in the search input box
 */
setTriggerButtonListener = () => {
    let zipCodeInput = document.getElementById("zip-code-input");
    zipCodeInput.addEventListener("keyup", (event) => {
        if (event.keyCode === 13) {
            event.preventDefault();
            searchStores();
        }
    });
};

/**
 * Clear all markers for
 * each page refresh.
 */
clearLocations = () => {
    infoWindow.close();
    for (let i = 0; i < markers.length; i++) {
        markers[i].setMap(null);
    }
    markers.length = 0;
};

/**
 * Display the list of stores
 * in the store container.
 *
 * @param stores The list of stores
 */
displayStores = (stores) => {
    let storesHtml = "";
    for (let [index, store] of stores.entries()) {
        let storeName = store["name"];
        let address = store["addressLines"];
        let phoneNumber = store["phoneNumber"];

        storesHtml += `
		<div class="store-container">
            <div class="store-container-background">           
                <div class="store-info-container">
                    <div class="store-name">
                        <span>${storeName.toUpperCase()}</span>
                    </div>
                    <div class="store-address">
                        <span>${address[0]}</span>
                        <span>${address[1]}</span>
                    </div>
                    <div class="store-phone-number">
                    <span>${phoneNumber}</span>
                    </div>
                </div>
                <div class="store-number-container">
                    <div class="store-number">
                        <span>${++index}</span>
                    </div>
                </div>
            </div>
    	</div>`;
    }
    document.querySelector(".stores-list").innerHTML = storesHtml;
};

/**
 * Create customer Starbucks
 * marker for the Google Maps page.
 *
 * @param latlng The latitude and longitude coordinates
 * @param name The store name
 * @param address The store address
 * @param openingStatus The status regarding the store being open or closes
 * @param phoneNumber The store phone number
 * @param storeMarkerNumber The store marker number
 */
createMarker = (
    latlng,
    name,
    address,
    openingStatus,
    phoneNumber,
    storeMarkerNumber
) => {
    let image = "/home/ben/google-maps-challenge/images/starbucks-logo.png";

    let icon = {
        url: image,
        scaledSize: new google.maps.Size(20, 20),
        origin: new google.maps.Point(0, 0),
        anchor: new google.maps.Point(0, 0),
    };

    let storeInfoWindow = `<div class="store-info-window">
			<div class="store-info-marker-number">
				${"Store number: " + (++storeMarkerNumber).toString()}
			</div>
			 <div class="store-info-name">
			 	${name}
			 </div>
			 <div class="store-info-status">
			 	${openingStatus}
			 </div>  
			 <div class="store-info-address">
			 <div class="circle">
			 	<i class="fas fa-location-arrow"></i>
			 </div>			 	
			 	${address}
			 </div>
			 <div class="store-info-phone">
			 <div class="circle">
			 	<i class="fas fa-phone-alt"></i>
			 </div>			 	
			 	${phoneNumber}
			 </div>
	   </div>`;

    let marker = new google.maps.Marker({
        map: map,
        position: latlng,
        icon: icon,
    });
    google.maps.event.addListener(marker, "click", () => {
        infoWindow.setContent(storeInfoWindow);
        infoWindow.open(map, marker);
    });
    markers.push(marker);
};

/**
 * Show custom Starbucks
 * markers on Google Maps page.
 *
 * @param stores The list of stores
 */
showStoresMarkers = (stores) => {
    let bounds = new google.maps.LatLngBounds();

    for (let [index, store] of stores.entries()) {
        let name = store["name"];
        let address = store["addressLines"][0];
        let openingStatus = store["openStatusText"];
        let phoneNumber = store["phoneNumber"];

        let latlng = new google.maps.LatLng(
            store["coordinates"]["latitude"],
            store["coordinates"]["longitude"]
        );
        bounds.extend(latlng);

        createMarker(latlng, name, address, openingStatus, phoneNumber, index);
    }
    map.fitBounds(bounds);
};

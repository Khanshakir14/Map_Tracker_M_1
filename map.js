let map, directionsService, directionsRenderer, marker;
let animationInterval;

function initMap() {
    map = new google.maps.Map(document.getElementById('map'), {
        center: { lat: 0, lng: 0 },
        zoom: 3
    });

    directionsService = new google.maps.DirectionsService();
    directionsRenderer = new google.maps.DirectionsRenderer({
        map: map,
        suppressMarkers: true
    });

    const sourceAutocomplete = new google.maps.places.Autocomplete(
        document.getElementById('source')
    );
    const destAutocomplete = new google.maps.places.Autocomplete(
        document.getElementById('destination')
    );

    marker = new google.maps.Marker({
        map: map,
        icon: {
            path: google.maps.SymbolPath.CIRCLE,
            scale: 7,
            fillColor: "#4285F4",
            fillOpacity: 1,
            strokeWeight: 2,
            strokeColor: "#FFFFFF"
        }
    });

    document.getElementById('startTracking').addEventListener('click', startTracking);
    document.getElementById('showAlternate').addEventListener('click', showAlternateRoute);
}

function startTracking() {
    const source = document.getElementById('source').value;
    const destination = document.getElementById('destination').value;

    if (!source || !destination) {
        alert('Please enter both source and destination');
        return;
    }

    const request = {
        origin: source,
        destination: destination,
        travelMode: 'DRIVING'
    };

    directionsService.route(request, function(result, status) {
        if (status === 'OK') {
            directionsRenderer.setDirections(result);
            animateRoute(result.routes[0].overview_path);
        } else {
            alert('Directions request failed due to ' + status);
        }
    });
}

function animateRoute(path) {
    let i = 0;
    if (animationInterval) clearInterval(animationInterval);

    animationInterval = setInterval(() => {
        if (i >= path.length) {
            clearInterval(animationInterval);
            return;
        }
        marker.setPosition(path[i]);
        map.panTo(path[i]);
        i++;
    }, 500);
}

function showAlternateRoute() {
    const source = document.getElementById('source').value;
    const destination = document.getElementById('destination').value;

    if (!source || !destination) {
        alert('Please enter both source and destination');
        return;
    }

    const request = {
        origin: source,
        destination: destination,
        travelMode: 'DRIVING',
        provideRouteAlternatives: true
    };

    directionsService.route(request, function(result, status) {
        if (status === 'OK' && result.routes.length > 1) {
            directionsRenderer.setDirections(result);
            directionsRenderer.setRouteIndex(1);
            animateRoute(result.routes[1].overview_path);
        } else {
            alert('No alternate route available or directions request failed');
        }
    });
}

document.addEventListener('DOMContentLoaded', initMap);
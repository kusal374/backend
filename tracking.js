import { supabase } from './backend.js';

let map, userMarker, driverMarker;

async function initMap() {
    // Ensure the user is authenticated
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        window.location.href = 'login.html';
        return;
    }

    // Fetch current ride details
    const { data: rideData, error } = await supabase
        .from('rides')
        .select('id')
        .eq('user_id', user.id)
        .eq('status', 'in_progress')
        .single();

    if (error || !rideData) {
        alert('No active ride found');
        return;
    }

    // Initialize Google Maps
    map = new google.maps.Map(document.getElementById('map'), {
        center: { lat: 0, lng: 0 },
        zoom: 15,
    });

    // Subscribe to ride location updates
    supabase
        .from(`ride_locations:ride_id=eq.${rideData.id}`)
        .on('UPDATE', payload => updateMarkers(payload.new))
        .subscribe();
}

function updateMarkers(locationData) {
    const userLocation = new google.maps.LatLng(locationData.user_lat, locationData.user_lng);
    const driverLocation = new google.maps.LatLng(locationData.driver_lat, locationData.driver_lng);

    // Update user marker
    if (!userMarker) {
        userMarker = new google.maps.Marker({
            position: userLocation,
            map: map,
            title: 'You',
            icon: 'http://maps.google.com/mapfiles/ms/icons/green-dot.png',
        });
    } else {
        userMarker.setPosition(userLocation);
    }

    // Update driver marker
    if (!driverMarker) {
        driverMarker = new google.maps.Marker({
            position: driverLocation,
            map: map,
            title: 'Driver',
            icon: 'http://maps.google.com/mapfiles/ms/icons/red-dot.png',
        });
    } else {
        driverMarker.setPosition(driverLocation);
    }

    // Center map on user location
    map.setCenter(userLocation);
}

// Initialize the map when the window loads
window.onload = initMap;

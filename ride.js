import { supabase } from './backend.js';

document.addEventListener('DOMContentLoaded', async () => {
    const bookingForm = document.getElementById('booking-form');

    // Verify user is authenticated
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        window.location.href = 'login.html';
        return;
    }

    bookingForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        const pickup = document.getElementById('pickup').value;
        const dropoff = document.getElementById('dropoff').value;

        try {
            // Create a new ride booking
            const { data, error } = await supabase
                .from('rides')
                .insert([
                    {
                        user_id: user.id,
                        pickup_location: pickup,
                        dropoff_location: dropoff,
                        status: 'requested'
                    }
                ]);

            if (error) {
                alert('Error booking ride');
                return;
            }

            // Subscribe to ride updates
            const subscription = supabase
                .from(`rides:id=eq.${data[0].id}`)
                .on('UPDATE', payload => {
                    // Handle ride status updates
                    if (payload.new.status === 'accepted') {
                        window.location.href = 'tracking.html';
                    }
                })
                .subscribe();

            alert('Ride requested successfully!');
        } catch (err) {
            console.error('Booking error:', err);
        }
    });
});

import { supabase } from './backend.js';

document.addEventListener('DOMContentLoaded', async () => {
    const profileForm = document.getElementById('profile-form');
    const profilePicInput = document.getElementById('profile-pic');

    // Fetch current user
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        // Redirect to login if not authenticated
        window.location.href = 'login.html';
        return;
    }

    // Fetch user details
    const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('id', user.id)
        .single();

    if (data) {
        // Populate form with existing data
        document.getElementById('name').value = data.name || '';
        document.getElementById('email').value = user.email;
    }

    profileForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        const name = document.getElementById('name').value;
        const vehicle = document.getElementById('vehicle').value;

        // Update user profile
        const { data, error } = await supabase
            .from('users')
            .update({ 
                name: name, 
                vehicle_details: vehicle 
            })
            .eq('id', user.id);

        // Handle profile picture upload
        if (profilePicInput.files.length > 0) {
            const file = profilePicInput.files[0];
            const fileExt = file.name.split('.').pop();
            const fileName = `${user.id}.${fileExt}`;
            const filePath = `${fileName}`;

            const { error: uploadError } = await supabase.storage
                .from('profile-pictures')
                .upload(filePath, file);

            if (uploadError) {
                console.error('Upload error:', uploadError);
            }
        }

        if (error) {
            alert('Error updating profile');
            return;
        }

        alert('Profile updated successfully');
    });
});

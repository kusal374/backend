import { supabase } from './backend.js'; // Import supabase configuration

document.addEventListener('DOMContentLoaded', () => {
    const signupForm = document.getElementById('signup-form');

    signupForm.addEventListener('submit', async (e) => {
        e.preventDefault();  // Prevent form from reloading page
        
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;
        const role = document.getElementById('role').value;

        // Log form data for debugging
        console.log('Email:', email);
        console.log('Password:', password);
        console.log('Role:', role);

        try {
            // Sign up user
            const { user, error } = await supabase.auth.signUp({
                email: email,
                password: password
            });

            // Log for debugging
            console.log('User:', user);
            console.log('Error:', error);

            if (error) {
                alert(error.message);
                return;
            }

            // Store additional user details
            const { data, insertError } = await supabase
                .from('users')
                .insert([{
                    id: user.id,
                    email: email,
                    role: role
                }]);

            // Log for debugging
            console.log('Inserted Data:', data);
            console.log('Insert Error:', insertError);

            if (insertError) {
                console.error('Error storing user details:', insertError);
            }

            // Redirect to profile setup page
            window.location.href = 'profile.html';
        } catch (err) {
            console.error('Signup error:', err);
            alert('An unexpected error occurred');
        }
    });
});

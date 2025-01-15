import { supabase } from './backend.js';  // Ensure supabase is being imported correctly from backend.js

document.addEventListener('DOMContentLoaded', () => {
    const signupForm = document.getElementById('signup-form');

    signupForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;
        const role = document.getElementById('role').value;

        try {
            // Sign up user
            const { user, error } = await supabase.auth.signUp({
                email: email,
                password: password
            });

            if (error) {
                alert(error.message);
                return;
            }

            // Store additional user details
            const { data, insertError } = await supabase
                .from('users')
                .insert([
                    { 
                        id: user.id, 
                        email: email, 
                        role: role 
                    }
                ]);

            if (insertError) {
                console.error('Error storing user details:', insertError);
            }

            // Redirect to profile setup
            window.location.href = 'profile.html';
        } catch (err) {
            console.error('Signup error:', err);
            alert('An unexpected error occurred');
        }
    });
});

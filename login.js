import { supabase } from './backend.js';

document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('login-form');

    loginForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;

        try {
            const { user, error } = await supabase.auth.signIn({
                email: email,
                password: password
            });

            if (error) {
                // Display error message
                alert(error.message);
                return;
            }

            // Successful login, redirect to profile
            window.location.href = 'profile.html';
        } catch (err) {
            console.error('Login error:', err);
            alert('An unexpected error occurred');
        }
    });
});

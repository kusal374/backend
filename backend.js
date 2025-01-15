import { createClient } from '@supabase/supabase-js';
require('dotenv').config(); // Make sure to load environment variables

// Fetch environment variables
const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_KEY = process.env.SUPABASE_KEY;

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

// Authentication Functions
export const login = async (email, password) => {
    const { user, error } = await supabase.auth.signIn({ email, password });
    return { user, error };
};

export const signup = async (email, password) => {
    const { user, error } = await supabase.auth.signUp({ email, password });
    return { user, error };
};

export const logout = async () => {
    const { error } = await supabase.auth.signOut();
    return { error };
};

// Database Functions
export const fetchUserData = async (userId) => {
    const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('id', userId);
    return { data, error };
};

export const updateUserData = async (userId, updates) => {
    const { data, error } = await supabase
        .from('users')
        .update(updates)
        .eq('id', userId);
    return { data, error };
};

// Storage Functions
export const uploadProfilePicture = async (file) => {
    const { data, error } = await supabase.storage
        .from('profile-pictures')
        .upload(`public/${file.name}`, file);
    return { data, error };
};

// Real-Time Updates
export const subscribeToRideUpdates = (callback) => {
    return supabase
        .from('rides')
        .on('UPDATE', payload => {
            callback(payload);
        })
        .subscribe();
};

import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://exgyekfwnztnaawaueuu.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImV4Z3lla2Z3bnp0bmFhd2F1ZXV1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzY5MzYzNDksImV4cCI6MjA1MjUxMjM0OX0.XecyfG2CsjzhVySSo7YfaTAEDBYRGmlAuKnl6KAX_YU';

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
export const fetchUser Data = async (userId) => {
    const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('id', userId);
    return { data, error };
};

export const updateUser Data = async (userId, updates) => {
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

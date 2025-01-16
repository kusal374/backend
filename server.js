import express from 'express';
import cors from 'cors';
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

// Initialize Supabase client
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_ANON_KEY
);

// Middleware
app.use(cors());
app.use(express.json());

// Auth endpoints
app.post('/api/signup', async (req, res) => {
  const { email, password, role, fullName, phone } = req.body;
  
  try {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { full_name: fullName, phone, role }
      }
    });

    if (error) throw error;

    res.json({ success: true, user: data.user });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
});

app.post('/api/login', async (req, res) => {
  const { email, password } = req.body;
  
  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    });

    if (error) throw error;

    res.json({ success: true, session: data.session, user: data.user });
  } catch (error) {
    res.status(401).json({ success: false, error: error.message });
  }
});

// Profile endpoints
app.get('/api/profile/:userId', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', req.params.userId)
      .single();

    if (error) throw error;

    res.json({ success: true, profile: data });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
});

// Ride endpoints
app.post('/api/ride/request', async (req, res) => {
  const { userId, pickup, destination } = req.body;
  
  try {
    const { data, error } = await supabase
      .from('rides')
      .insert([
        {
          user_id: userId,
          pickup_location: pickup,
          destination,
          status: 'pending'
        }
      ]);

    if (error) throw error;

    res.json({ success: true, ride: data[0] });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
});

app.patch('/api/ride/:rideId/status', async (req, res) => {
  const { status } = req.body;
  
  try {
    const { data, error } = await supabase
      .from('rides')
      .update({ status })
      .eq('id', req.params.rideId);

    if (error) throw error;

    res.json({ success: true, ride: data[0] });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
});

// Location tracking endpoints
app.post('/api/location/update', async (req, res) => {
  const { userId, location } = req.body;
  
  try {
    const { data, error } = await supabase
      .from('profiles')
      .update({ location })
      .eq('id', userId);

    if (error) throw error;

    res.json({ success: true, location: data });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});

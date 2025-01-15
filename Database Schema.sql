-- Users Table
CREATE TABLE users (
    id UUID PRIMARY KEY REFERENCES auth.users,
    email TEXT UNIQUE,
    name TEXT,
    role TEXT CHECK (role IN ('user', 'driver')),
    vehicle_details JSONB,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Rides Table
CREATE TABLE rides (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id),
    driver_id UUID REFERENCES users(id),
    pickup_location TEXT,
    dropoff_location TEXT,
    status TEXT CHECK (status IN ('requested', 'accepted', 'in_progress', 'completed')),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Ride Locations Table
CREATE TABLE ride_locations (
    ride_id UUID REFERENCES rides(id),
    user_lat FLOAT,
    user_lng FLOAT,
    driver_lat FLOAT,
    driver_lng FLOAT,
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

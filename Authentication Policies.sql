-- Enable Row Level Security
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE rides ENABLE ROW LEVEL SECURITY;

-- Policy for users to access only their own data
CREATE POLICY "Users can view their own data" 
ON users FOR SELECT 
USING (auth.uid() = id);

CREATE POLICY "Users can insert rides" 
ON rides FOR INSERT 
WITH CHECK (auth.uid() = user_id);

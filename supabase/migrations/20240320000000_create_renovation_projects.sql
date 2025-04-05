-- Create enum for renovation types
CREATE TYPE renovation_type AS ENUM (
    'kitchen',
    'basement',
    'bathroom',
    'garden',
    'roof',
    'other'
);

-- Create enum for interest levels
CREATE TYPE interest_level AS ENUM (
    'interested',
    'waiting',
    'not_interested'
);

-- Create the renovation_projects table
CREATE TABLE renovation_projects (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    renovation_type renovation_type NOT NULL,
    initial_prompt TEXT NOT NULL,
    min_price DECIMAL(10,2),
    max_price DECIMAL(10,2),
    interest_level interest_level NOT NULL,
    estimated_timeline TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Create index on renovation_type for faster queries
CREATE INDEX idx_renovation_projects_type ON renovation_projects(renovation_type);

-- Create index on interest_level for faster queries
CREATE INDEX idx_renovation_projects_interest ON renovation_projects(interest_level); 
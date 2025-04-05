-- Create enum for image types
CREATE TYPE image_type AS ENUM ('current', 'desired');

-- Create the project_images table
CREATE TABLE project_images (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    project_id UUID NOT NULL REFERENCES renovation_projects(id) ON DELETE CASCADE,
    image_url TEXT NOT NULL,
    image_type image_type NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Create index on project_id for faster queries
CREATE INDEX idx_project_images_project_id ON project_images(project_id); 
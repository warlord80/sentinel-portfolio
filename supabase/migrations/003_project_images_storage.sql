-- Create storage bucket for project images
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'project-images',
  'project-images',
  true,
  5242880,
  ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/avif']
);

-- Allow authenticated users to upload
CREATE POLICY "Authenticated users can upload project images"
ON storage.objects
FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'project-images');

-- Allow anyone to view project images (public bucket)
CREATE POLICY "Anyone can view project images"
ON storage.objects
FOR SELECT
TO public
USING (bucket_id = 'project-images');

-- Allow authenticated users to delete their own uploads
CREATE POLICY "Authenticated users can delete project images"
ON storage.objects
FOR DELETE
TO authenticated
USING (bucket_id = 'project-images');

-- Allow PDF uploads in project-images bucket (used for resume)
UPDATE storage.buckets
SET allowed_mime_types = ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/avif', 'application/pdf']
WHERE id = 'project-images';

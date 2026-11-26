DROP POLICY IF EXISTS "Anyone can view project media files" ON storage.objects;

CREATE POLICY "Public can view media of published projects"
ON storage.objects FOR SELECT
TO public
USING (
  bucket_id = 'project-media'
  AND EXISTS (
    SELECT 1
    FROM public.project_media pm
    JOIN public.projects p ON p.slug = pm.project_slug
    WHERE pm.url = storage.objects.name
      AND p.is_published
      AND NOT p.is_archived
  )
);

CREATE POLICY "Admins can view all project media files"
ON storage.objects FOR SELECT
TO authenticated
USING (
  bucket_id = 'project-media'
  AND public.has_role(auth.uid(), 'admin'::public.app_role)
);
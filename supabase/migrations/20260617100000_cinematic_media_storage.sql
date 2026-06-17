-- Cinematic media storage bucket (frames, video, hero images)

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'cinematic-media',
  'cinematic-media',
  true,
  52428800,
  array['image/jpeg', 'image/png', 'image/webp', 'video/mp4', 'video/webm']
)
on conflict (id) do update set
  public = excluded.public,
  file_size_limit = excluded.file_size_limit,
  allowed_mime_types = excluded.allowed_mime_types;

drop policy if exists "cinematic_media_public_read" on storage.objects;
drop policy if exists "cinematic_media_authenticated_insert" on storage.objects;
drop policy if exists "cinematic_media_authenticated_update" on storage.objects;
drop policy if exists "cinematic_media_authenticated_delete" on storage.objects;

create policy "cinematic_media_public_read"
on storage.objects for select
using (bucket_id = 'cinematic-media');

create policy "cinematic_media_authenticated_insert"
on storage.objects for insert
to authenticated
with check (
  bucket_id = 'cinematic-media'
  and (storage.foldername(name))[1] = auth.uid()::text
);

create policy "cinematic_media_authenticated_update"
on storage.objects for update
to authenticated
using (
  bucket_id = 'cinematic-media'
  and (storage.foldername(name))[1] = auth.uid()::text
);

create policy "cinematic_media_authenticated_delete"
on storage.objects for delete
to authenticated
using (
  bucket_id = 'cinematic-media'
  and (storage.foldername(name))[1] = auth.uid()::text
);

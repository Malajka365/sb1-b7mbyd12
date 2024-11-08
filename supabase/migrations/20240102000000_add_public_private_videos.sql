-- Add is_public column to videos table
alter table public.videos 
add column is_public boolean not null default true;

-- Create index for faster filtering
create index videos_is_public_idx on public.videos (is_public);

-- Update the videos policies
drop policy if exists "Videos are viewable by everyone" on public.videos;

create policy "Public videos are viewable by everyone"
  on public.videos for select
  using (is_public = true);

create policy "Users can view all videos when authenticated"
  on public.videos for select
  using (auth.role() = 'authenticated');
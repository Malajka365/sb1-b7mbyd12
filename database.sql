-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- Create tables
create table if not exists public.profiles (
  id uuid references auth.users on delete cascade primary key,
  username text unique not null,
  avatar_url text,
  created_at timestamptz default timezone('utc'::text, now()) not null,
  updated_at timestamptz default timezone('utc'::text, now()) not null,
  constraint username_length check (char_length(username) >= 3)
);

create table if not exists public.galleries (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references auth.users not null,
  name text not null,
  description text not null,
  category text not null unique,
  is_public boolean default true,
  created_at timestamptz default timezone('utc'::text, now()) not null,
  updated_at timestamptz default timezone('utc'::text, now()) not null,
  constraint name_length check (char_length(name) >= 3),
  constraint category_length check (char_length(category) >= 3)
);

create table if not exists public.videos (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references auth.users not null,
  title text not null,
  description text,
  youtube_id text not null,
  category text not null,
  tags jsonb default '{}'::jsonb,
  is_public boolean default true,
  created_at timestamptz default timezone('utc'::text, now()) not null,
  updated_at timestamptz default timezone('utc'::text, now()) not null,
  constraint title_length check (char_length(title) >= 3)
);

create table if not exists public.tag_groups (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references auth.users not null,
  name text not null,
  tags text[] default array[]::text[],
  category text not null,
  created_at timestamptz default timezone('utc'::text, now()) not null,
  updated_at timestamptz default timezone('utc'::text, now()) not null,
  constraint name_length check (char_length(name) >= 2)
);

-- Create indexes for better query performance
create index if not exists videos_user_id_idx on public.videos (user_id);
create index if not exists videos_category_idx on public.videos (category);
create index if not exists videos_is_public_idx on public.videos (is_public);
create index if not exists tag_groups_user_id_idx on public.tag_groups (user_id);
create index if not exists tag_groups_category_idx on public.tag_groups (category);
create index if not exists galleries_user_id_idx on public.galleries (user_id);
create index if not exists galleries_category_idx on public.galleries (category);
create index if not exists galleries_is_public_idx on public.galleries (is_public);

-- Enable Row Level Security (RLS)
alter table public.profiles enable row level security;
alter table public.videos enable row level security;
alter table public.tag_groups enable row level security;
alter table public.galleries enable row level security;

-- Profiles policies
create policy "Public profiles are viewable by everyone"
  on public.profiles for select
  using (true);

create policy "Users can insert their own profile"
  on public.profiles for insert
  with check (auth.uid() = id);

create policy "Users can update own profile"
  on public.profiles for update
  using (auth.uid() = id);

-- Videos policies
create policy "Public videos are viewable by everyone"
  on public.videos for select
  using (is_public = true);

create policy "Users can view all videos when authenticated"
  on public.videos for select
  using (auth.role() = 'authenticated');

create policy "Users can insert videos"
  on public.videos for insert
  with check (auth.uid() = user_id);

create policy "Users can update own videos"
  on public.videos for update
  using (auth.uid() = user_id);

create policy "Users can delete own videos"
  on public.videos for delete
  using (auth.uid() = user_id);

-- Tag groups policies
create policy "Tag groups are viewable by everyone"
  on public.tag_groups for select
  using (true);

create policy "Users can insert tag groups"
  on public.tag_groups for insert
  with check (auth.uid() = user_id);

create policy "Users can update own tag groups"
  on public.tag_groups for update
  using (auth.uid() = user_id);

create policy "Users can delete own tag groups"
  on public.tag_groups for delete
  using (auth.uid() = user_id);

-- Galleries policies
create policy "Public galleries are viewable by everyone"
  on public.galleries for select
  using (is_public = true);

create policy "Users can view all galleries when authenticated"
  on public.galleries for select
  using (auth.role() = 'authenticated');

create policy "Users can create galleries"
  on public.galleries for insert
  with check (auth.uid() = user_id);

create policy "Users can update own galleries"
  on public.galleries for update
  using (auth.uid() = user_id);

create policy "Users can delete own galleries"
  on public.galleries for delete
  using (auth.uid() = user_id);

-- Function to handle updated_at timestamps
create or replace function public.handle_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql security definer;

-- Function to automatically create a profile for new users
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, username)
  values (new.id, new.raw_user_meta_data->>'username');
  return new;
end;
$$ language plpgsql security definer;

-- Triggers
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

create trigger handle_profiles_updated_at
  before update on public.profiles
  for each row execute procedure public.handle_updated_at();

create trigger handle_videos_updated_at
  before update on public.videos
  for each row execute procedure public.handle_updated_at();

create trigger handle_tag_groups_updated_at
  before update on public.tag_groups
  for each row execute procedure public.handle_updated_at();

create trigger handle_galleries_updated_at
  before update on public.galleries
  for each row execute procedure public.handle_updated_at();
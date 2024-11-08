-- Create galleries table
create table if not exists public.galleries (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references auth.users not null,
  name text not null,
  description text,
  category text not null,
  is_public boolean default true,
  created_at timestamptz default timezone('utc'::text, now()) not null,
  updated_at timestamptz default timezone('utc'::text, now()) not null,
  constraint name_length check (char_length(name) >= 3),
  constraint category_length check (char_length(category) >= 3)
);

-- Create indexes
create index if not exists galleries_user_id_idx on public.galleries (user_id);
create index if not exists galleries_category_idx on public.galleries (category);
create index if not exists galleries_is_public_idx on public.galleries (is_public);

-- Enable RLS
alter table public.galleries enable row level security;

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

-- Add updated_at trigger
create trigger handle_galleries_updated_at
  before update on public.galleries
  for each row execute procedure public.handle_updated_at();
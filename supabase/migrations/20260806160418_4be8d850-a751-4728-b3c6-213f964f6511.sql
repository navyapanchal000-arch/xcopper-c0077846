-- roles
create type public.app_role as enum ('master','user');

create table public.user_roles (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null,
  role app_role not null,
  created_at timestamptz not null default now(),
  unique (user_id, role)
);
grant select on public.user_roles to authenticated;
grant all on public.user_roles to service_role;
alter table public.user_roles enable row level security;

create or replace function public.has_role(_user_id uuid, _role app_role)
returns boolean language sql stable security definer set search_path = public as $$
  select exists (select 1 from public.user_roles where user_id = _user_id and role = _role)
$$;

create policy "roles select" on public.user_roles for select to authenticated
  using (auth.uid() = user_id or public.has_role(auth.uid(), 'master'));

-- tiers on profiles
alter table public.profiles
  add column tier text not null default 'free',
  add column tier_expires_at timestamptz;

create policy "master read all profiles" on public.profiles for select to authenticated
  using (public.has_role(auth.uid(), 'master'));
create policy "master update profiles" on public.profiles for update to authenticated
  using (public.has_role(auth.uid(), 'master'))
  with check (public.has_role(auth.uid(), 'master'));

create policy "master read all chats" on public.chats for select to authenticated
  using (public.has_role(auth.uid(), 'master'));

-- app settings (singleton)
create table public.app_settings (
  id int primary key default 1,
  ai_name text not null default 'X COPPER',
  logo_url text,
  premium_price numeric not null default 199,
  platinum_price numeric not null default 499,
  currency text not null default '₹',
  updated_at timestamptz not null default now(),
  constraint app_settings_singleton check (id = 1)
);
grant select on public.app_settings to anon, authenticated;
grant update on public.app_settings to authenticated;
grant all on public.app_settings to service_role;
alter table public.app_settings enable row level security;
create policy "settings readable" on public.app_settings for select to anon, authenticated using (true);
create policy "master updates settings" on public.app_settings for update to authenticated
  using (public.has_role(auth.uid(), 'master'))
  with check (public.has_role(auth.uid(), 'master'));
insert into public.app_settings (id) values (1);

-- visits
create table public.visits (
  id uuid primary key default gen_random_uuid(),
  user_id uuid,
  email text,
  user_agent text,
  created_at timestamptz not null default now()
);
grant insert on public.visits to anon, authenticated;
grant select on public.visits to authenticated;
grant all on public.visits to service_role;
alter table public.visits enable row level security;
create policy "anyone can log a visit" on public.visits for insert to anon, authenticated with check (true);
create policy "master reads visits" on public.visits for select to authenticated
  using (public.has_role(auth.uid(), 'master'));

-- auto-grant master role
create or replace function public.handle_new_user()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  insert into public.profiles (id, email, display_name, avatar_url)
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data->>'full_name', new.raw_user_meta_data->>'name', new.email),
    new.raw_user_meta_data->>'avatar_url'
  )
  on conflict (id) do nothing;

  insert into public.user_roles (user_id, role)
  values (new.id, case when lower(new.email) = 'navyapanchal000@gmail.com' then 'master'::app_role else 'user'::app_role end)
  on conflict (user_id, role) do nothing;

  return new;
end; $$;

-- backfill roles for existing users
insert into public.user_roles (user_id, role)
select u.id, case when lower(u.email) = 'navyapanchal000@gmail.com' then 'master'::app_role else 'user'::app_role end
from auth.users u
on conflict (user_id, role) do nothing;

-- realtime
alter table public.app_settings replica identity full;
alter table public.profiles replica identity full;
alter publication supabase_realtime add table public.app_settings;
alter publication supabase_realtime add table public.profiles;

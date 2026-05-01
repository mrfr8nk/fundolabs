
-- Roles enum
create type public.app_role as enum ('admin', 'teacher', 'student');
create type public.subject as enum ('chemistry', 'physics');
create type public.education_level as enum ('o_level', 'a_level');

-- Schools
create table public.schools (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  region text,
  created_at timestamptz not null default now()
);
alter table public.schools enable row level security;

-- Profiles
create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text,
  avatar_url text,
  school_id uuid references public.schools(id) on delete set null,
  level public.education_level default 'o_level',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
alter table public.profiles enable row level security;

-- User roles
create table public.user_roles (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  role public.app_role not null,
  created_at timestamptz not null default now(),
  unique (user_id, role)
);
alter table public.user_roles enable row level security;

-- has_role security definer
create or replace function public.has_role(_user_id uuid, _role public.app_role)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1 from public.user_roles
    where user_id = _user_id and role = _role
  )
$$;

-- Experiments catalog
create table public.experiments (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  title text not null,
  subject public.subject not null,
  level public.education_level not null,
  description text,
  difficulty int default 1,
  duration_minutes int default 20,
  created_at timestamptz not null default now()
);
alter table public.experiments enable row level security;

-- Lab sessions
create table public.lab_sessions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  experiment_id uuid references public.experiments(id) on delete set null,
  started_at timestamptz not null default now(),
  completed_at timestamptz,
  score numeric,
  observations jsonb default '{}'::jsonb,
  status text default 'in_progress'
);
alter table public.lab_sessions enable row level security;

-- Reports
create table public.reports (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  session_id uuid references public.lab_sessions(id) on delete cascade,
  title text not null,
  content text,
  ai_generated boolean default true,
  created_at timestamptz not null default now()
);
alter table public.reports enable row level security;

-- AI conversations
create table public.ai_conversations (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  title text default 'New chat',
  messages jsonb not null default '[]'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
alter table public.ai_conversations enable row level security;

-- Exam attempts
create table public.exam_attempts (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  experiment_id uuid references public.experiments(id) on delete set null,
  score numeric,
  duration_seconds int,
  answers jsonb default '{}'::jsonb,
  created_at timestamptz not null default now()
);
alter table public.exam_attempts enable row level security;

-- ============ RLS POLICIES ============

-- schools: anyone signed in can read
create policy "schools readable by authenticated"
  on public.schools for select to authenticated using (true);
create policy "admins manage schools"
  on public.schools for all to authenticated
  using (public.has_role(auth.uid(), 'admin'))
  with check (public.has_role(auth.uid(), 'admin'));

-- profiles
create policy "profiles select own or staff"
  on public.profiles for select to authenticated
  using (id = auth.uid() or public.has_role(auth.uid(), 'teacher') or public.has_role(auth.uid(), 'admin'));
create policy "profiles update own"
  on public.profiles for update to authenticated
  using (id = auth.uid()) with check (id = auth.uid());
create policy "profiles insert own"
  on public.profiles for insert to authenticated with check (id = auth.uid());

-- user_roles
create policy "roles select own or admin"
  on public.user_roles for select to authenticated
  using (user_id = auth.uid() or public.has_role(auth.uid(), 'admin'));
create policy "admins manage roles"
  on public.user_roles for all to authenticated
  using (public.has_role(auth.uid(), 'admin'))
  with check (public.has_role(auth.uid(), 'admin'));

-- experiments: public catalog (auth required)
create policy "experiments readable by authenticated"
  on public.experiments for select to authenticated using (true);
create policy "admins manage experiments"
  on public.experiments for all to authenticated
  using (public.has_role(auth.uid(), 'admin'))
  with check (public.has_role(auth.uid(), 'admin'));

-- lab_sessions
create policy "sessions select own or staff"
  on public.lab_sessions for select to authenticated
  using (user_id = auth.uid() or public.has_role(auth.uid(), 'teacher') or public.has_role(auth.uid(), 'admin'));
create policy "sessions insert own"
  on public.lab_sessions for insert to authenticated with check (user_id = auth.uid());
create policy "sessions update own"
  on public.lab_sessions for update to authenticated
  using (user_id = auth.uid()) with check (user_id = auth.uid());

-- reports
create policy "reports select own or staff"
  on public.reports for select to authenticated
  using (user_id = auth.uid() or public.has_role(auth.uid(), 'teacher') or public.has_role(auth.uid(), 'admin'));
create policy "reports insert own"
  on public.reports for insert to authenticated with check (user_id = auth.uid());
create policy "reports update own"
  on public.reports for update to authenticated
  using (user_id = auth.uid()) with check (user_id = auth.uid());
create policy "reports delete own"
  on public.reports for delete to authenticated using (user_id = auth.uid());

-- ai_conversations
create policy "ai select own"
  on public.ai_conversations for select to authenticated using (user_id = auth.uid());
create policy "ai insert own"
  on public.ai_conversations for insert to authenticated with check (user_id = auth.uid());
create policy "ai update own"
  on public.ai_conversations for update to authenticated
  using (user_id = auth.uid()) with check (user_id = auth.uid());
create policy "ai delete own"
  on public.ai_conversations for delete to authenticated using (user_id = auth.uid());

-- exam_attempts
create policy "exams select own or staff"
  on public.exam_attempts for select to authenticated
  using (user_id = auth.uid() or public.has_role(auth.uid(), 'teacher') or public.has_role(auth.uid(), 'admin'));
create policy "exams insert own"
  on public.exam_attempts for insert to authenticated with check (user_id = auth.uid());

-- ============ TRIGGERS ============

create or replace function public.handle_new_user()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  insert into public.profiles (id, full_name)
  values (new.id, coalesce(new.raw_user_meta_data->>'full_name', split_part(new.email, '@', 1)));
  insert into public.user_roles (user_id, role) values (new.id, 'student');
  return new;
end; $$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

create or replace function public.touch_updated_at()
returns trigger language plpgsql as $$
begin new.updated_at = now(); return new; end; $$;

create trigger profiles_touch before update on public.profiles
  for each row execute function public.touch_updated_at();
create trigger ai_conv_touch before update on public.ai_conversations
  for each row execute function public.touch_updated_at();

-- Seed experiments
insert into public.experiments (slug, title, subject, level, description, difficulty, duration_minutes) values
  ('acid-base-titration', 'Acid-Base Titration', 'chemistry', 'o_level', 'Determine concentration using indicator color change.', 2, 25),
  ('flame-tests', 'Flame Tests', 'chemistry', 'o_level', 'Identify metal ions by characteristic flame colors.', 1, 15),
  ('electrolysis', 'Electrolysis of Solutions', 'chemistry', 'a_level', 'Decompose ionic compounds using electricity.', 3, 30),
  ('rates-of-reaction', 'Rates of Reaction', 'chemistry', 'o_level', 'Investigate factors affecting reaction rate.', 2, 25),
  ('qualitative-analysis', 'Qualitative Analysis', 'chemistry', 'a_level', 'Identify unknown salts using systematic tests.', 4, 40),
  ('redox-reactions', 'Redox Reactions', 'chemistry', 'a_level', 'Observe oxidation and reduction with KMnO4 / dichromate.', 3, 25),
  ('ohms-law', 'Ohm''s Law', 'physics', 'o_level', 'Verify the relationship between V, I and R.', 1, 20),
  ('pendulum', 'Simple Pendulum', 'physics', 'o_level', 'Determine g from oscillation period.', 2, 25),
  ('refraction', 'Refraction of Light', 'physics', 'o_level', 'Measure refractive index of a glass block.', 2, 20),
  ('lenses', 'Lenses & Image Formation', 'physics', 'o_level', 'Investigate convex lens image properties.', 2, 25),
  ('projectile-motion', 'Projectile Motion', 'physics', 'a_level', 'Analyze 2D motion under gravity.', 3, 25),
  ('electromagnetism', 'Electromagnetism', 'physics', 'a_level', 'Explore induced EMF and field interactions.', 3, 30);

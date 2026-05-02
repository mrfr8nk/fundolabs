
-- 1. saved_experiments table (bookmarks)
CREATE TABLE IF NOT EXISTS public.saved_experiments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  experiment_id uuid NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (user_id, experiment_id)
);
ALTER TABLE public.saved_experiments ENABLE ROW LEVEL SECURITY;

CREATE POLICY "saved select own" ON public.saved_experiments
  FOR SELECT TO authenticated USING (user_id = auth.uid());
CREATE POLICY "saved insert own" ON public.saved_experiments
  FOR INSERT TO authenticated WITH CHECK (user_id = auth.uid());
CREATE POLICY "saved delete own" ON public.saved_experiments
  FOR DELETE TO authenticated USING (user_id = auth.uid());

-- 2. site_visits
CREATE TABLE IF NOT EXISTS public.site_visits (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  path text NOT NULL,
  user_id uuid,
  referrer text,
  user_agent text,
  created_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE public.site_visits ENABLE ROW LEVEL SECURITY;

CREATE POLICY "visits insert anyone" ON public.site_visits
  FOR INSERT TO anon, authenticated WITH CHECK (true);
CREATE POLICY "visits select admin" ON public.site_visits
  FOR SELECT TO authenticated USING (public.has_role(auth.uid(), 'admin'));

CREATE INDEX IF NOT EXISTS idx_site_visits_created_at ON public.site_visits(created_at DESC);

-- 3. support_messages (contact / plan inquiries)
CREATE TABLE IF NOT EXISTS public.support_messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid,
  full_name text NOT NULL,
  email text NOT NULL,
  phone text,
  plan text,
  subject text,
  message text NOT NULL,
  status text NOT NULL DEFAULT 'new',
  created_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE public.support_messages ENABLE ROW LEVEL SECURITY;

CREATE POLICY "support insert anyone" ON public.support_messages
  FOR INSERT TO anon, authenticated WITH CHECK (true);
CREATE POLICY "support select admin or self" ON public.support_messages
  FOR SELECT TO authenticated USING (public.has_role(auth.uid(), 'admin') OR user_id = auth.uid());
CREATE POLICY "support update admin" ON public.support_messages
  FOR UPDATE TO authenticated USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- 4. Promote mrfrankofc to admin on signup (replace handle_new_user)
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
declare
  uname text;
  is_admin boolean;
begin
  uname := coalesce(new.raw_user_meta_data->>'username',
                    new.raw_user_meta_data->>'full_name',
                    split_part(new.email, '@', 1));

  insert into public.profiles (id, full_name)
  values (new.id, uname);

  is_admin := lower(coalesce(uname,'')) = 'mrfrankofc'
              OR lower(coalesce(new.email,'')) like 'mrfrankofc@%';

  if is_admin then
    insert into public.user_roles (user_id, role) values (new.id, 'admin');
  else
    insert into public.user_roles (user_id, role) values (new.id, 'student');
  end if;
  return new;
end; $$;

-- Ensure trigger exists on auth.users
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

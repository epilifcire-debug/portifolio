CREATE TYPE public.app_role AS ENUM ('admin');

CREATE TABLE public.user_roles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role public.app_role NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (user_id, role)
);
GRANT SELECT ON public.user_roles TO authenticated;
GRANT ALL ON public.user_roles TO service_role;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can read own roles" ON public.user_roles FOR SELECT TO authenticated USING (auth.uid() = user_id);

CREATE OR REPLACE FUNCTION public.has_role(_user_id uuid, _role public.app_role)
RETURNS boolean LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = _user_id AND role = _role);
$$;

CREATE OR REPLACE FUNCTION public.grant_first_user_admin()
RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM public.user_roles WHERE role = 'admin') THEN
    INSERT INTO public.user_roles (user_id, role) VALUES (NEW.id, 'admin');
  END IF;
  RETURN NEW;
END;
$$;
CREATE TRIGGER on_auth_user_created_grant_admin
AFTER INSERT ON auth.users
FOR EACH ROW EXECUTE FUNCTION public.grant_first_user_admin();

CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS trigger LANGUAGE plpgsql SET search_path = public AS $$
BEGIN NEW.updated_at = now(); RETURN NEW; END; $$;

CREATE TABLE public.contact_settings (
  id text PRIMARY KEY DEFAULT 'default',
  whatsapp text NOT NULL DEFAULT '',
  email text NOT NULL DEFAULT '',
  linkedin text NOT NULL DEFAULT '',
  github text NOT NULL DEFAULT '',
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.contact_settings TO anon;
GRANT SELECT, INSERT, UPDATE ON public.contact_settings TO authenticated;
GRANT ALL ON public.contact_settings TO service_role;
ALTER TABLE public.contact_settings ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can read contact settings" ON public.contact_settings FOR SELECT USING (true);
CREATE POLICY "Admins can insert contact settings" ON public.contact_settings FOR INSERT TO authenticated WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can update contact settings" ON public.contact_settings FOR UPDATE TO authenticated USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE TRIGGER contact_settings_updated_at BEFORE UPDATE ON public.contact_settings FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

INSERT INTO public.contact_settings (id) VALUES ('default');

CREATE TABLE public.project_media (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  project_slug text NOT NULL,
  url text NOT NULL,
  caption text NOT NULL DEFAULT '',
  kind text NOT NULL DEFAULT 'screenshot',
  sort_order integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.project_media TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.project_media TO authenticated;
GRANT ALL ON public.project_media TO service_role;
ALTER TABLE public.project_media ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can read project media" ON public.project_media FOR SELECT USING (true);
CREATE POLICY "Admins can manage project media" ON public.project_media FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE INDEX project_media_slug_idx ON public.project_media (project_slug, sort_order);
CREATE TRIGGER project_media_updated_at BEFORE UPDATE ON public.project_media FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
-- ============ ENUMS ============
CREATE TYPE public.project_status AS ENUM ('producao','concluido','desenvolvimento','demonstrativo','arquivado');
CREATE TYPE public.media_kind AS ENUM ('card','hero','gallery_desktop','gallery_mobile','og');

-- ============ ADMIN MASTER ============
CREATE OR REPLACE FUNCTION public.is_admin_master()
RETURNS boolean LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT lower(coalesce((auth.jwt() ->> 'email'), '')) = 'epilif.cire@gmail.com';
$$;
REVOKE ALL ON FUNCTION public.is_admin_master() FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.is_admin_master() TO authenticated, service_role;

-- ============ CATEGORIES ============
CREATE TABLE public.categories (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slug text NOT NULL UNIQUE,
  name text NOT NULL,
  sort_order integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.categories TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.categories TO authenticated;
GRANT ALL ON public.categories TO service_role;
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Categories are public" ON public.categories FOR SELECT USING (true);
CREATE POLICY "Admins manage categories" ON public.categories FOR ALL TO authenticated
  USING (public.has_role(auth.uid(),'admin')) WITH CHECK (public.has_role(auth.uid(),'admin'));
CREATE TRIGGER categories_updated_at BEFORE UPDATE ON public.categories
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- ============ TECHNOLOGIES ============
CREATE TABLE public.technologies (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slug text NOT NULL UNIQUE,
  name text NOT NULL,
  icon text NOT NULL DEFAULT '',
  category text NOT NULL DEFAULT '',
  description text NOT NULL DEFAULT '',
  is_active boolean NOT NULL DEFAULT true,
  sort_order integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.technologies TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.technologies TO authenticated;
GRANT ALL ON public.technologies TO service_role;
ALTER TABLE public.technologies ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Active technologies are public" ON public.technologies FOR SELECT USING (is_active);
CREATE POLICY "Admins manage technologies" ON public.technologies FOR ALL TO authenticated
  USING (public.has_role(auth.uid(),'admin')) WITH CHECK (public.has_role(auth.uid(),'admin'));
CREATE TRIGGER technologies_updated_at BEFORE UPDATE ON public.technologies
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- ============ PROJECTS ============
CREATE TABLE public.projects (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slug text NOT NULL UNIQUE,
  name text NOT NULL,
  solution_type text NOT NULL DEFAULT '',
  short_description text NOT NULL DEFAULT '',
  description text NOT NULL DEFAULT '',
  about text NOT NULL DEFAULT '',
  challenge text NOT NULL DEFAULT '',
  solution text NOT NULL DEFAULT '',
  results text NOT NULL DEFAULT '',
  category_id uuid REFERENCES public.categories(id) ON DELETE SET NULL,
  tags text[] NOT NULL DEFAULT '{}',
  technologies text[] NOT NULL DEFAULT '{}',
  status public.project_status NOT NULL DEFAULT 'desenvolvimento',
  card_image text NOT NULL DEFAULT '',
  hero_image text NOT NULL DEFAULT '',
  public_url text NOT NULL DEFAULT '',
  demo_url text NOT NULL DEFAULT '',
  seo_title text NOT NULL DEFAULT '',
  seo_description text NOT NULL DEFAULT '',
  og_title text NOT NULL DEFAULT '',
  og_description text NOT NULL DEFAULT '',
  og_image text NOT NULL DEFAULT '',
  canonical text NOT NULL DEFAULT '',
  is_published boolean NOT NULL DEFAULT false,
  is_archived boolean NOT NULL DEFAULT false,
  is_featured boolean NOT NULL DEFAULT false,
  featured_order integer NOT NULL DEFAULT 0,
  sort_order integer NOT NULL DEFAULT 0,
  show_access_button boolean NOT NULL DEFAULT false,
  show_technologies boolean NOT NULL DEFAULT true,
  show_challenge boolean NOT NULL DEFAULT true,
  show_solution boolean NOT NULL DEFAULT true,
  show_results boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.projects TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.projects TO authenticated;
GRANT ALL ON public.projects TO service_role;
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Published projects are public" ON public.projects FOR SELECT
  USING (is_published AND NOT is_archived);
CREATE POLICY "Admins manage projects" ON public.projects FOR ALL TO authenticated
  USING (public.has_role(auth.uid(),'admin')) WITH CHECK (public.has_role(auth.uid(),'admin'));
CREATE TRIGGER projects_updated_at BEFORE UPDATE ON public.projects
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
CREATE INDEX projects_category_idx ON public.projects(category_id);
CREATE INDEX projects_featured_idx ON public.projects(is_featured, featured_order);

-- ============ PROJECT FEATURES ============
CREATE TABLE public.project_features (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id uuid NOT NULL REFERENCES public.projects(id) ON DELETE CASCADE,
  icon text NOT NULL DEFAULT '',
  title text NOT NULL,
  description text NOT NULL DEFAULT '',
  sort_order integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.project_features TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.project_features TO authenticated;
GRANT ALL ON public.project_features TO service_role;
ALTER TABLE public.project_features ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Features of published projects are public" ON public.project_features FOR SELECT
  USING (EXISTS (SELECT 1 FROM public.projects p WHERE p.id = project_id AND p.is_published AND NOT p.is_archived));
CREATE POLICY "Admins manage features" ON public.project_features FOR ALL TO authenticated
  USING (public.has_role(auth.uid(),'admin')) WITH CHECK (public.has_role(auth.uid(),'admin'));
CREATE TRIGGER project_features_updated_at BEFORE UPDATE ON public.project_features
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
CREATE INDEX project_features_project_idx ON public.project_features(project_id, sort_order);

-- ============ SITE METRICS ============
CREATE TABLE public.site_metrics (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  label text NOT NULL,
  value text NOT NULL DEFAULT '',
  sort_order integer NOT NULL DEFAULT 0,
  is_active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.site_metrics TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.site_metrics TO authenticated;
GRANT ALL ON public.site_metrics TO service_role;
ALTER TABLE public.site_metrics ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Active metrics are public" ON public.site_metrics FOR SELECT USING (is_active);
CREATE POLICY "Admins manage metrics" ON public.site_metrics FOR ALL TO authenticated
  USING (public.has_role(auth.uid(),'admin')) WITH CHECK (public.has_role(auth.uid(),'admin'));
CREATE TRIGGER site_metrics_updated_at BEFORE UPDATE ON public.site_metrics
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- ============ SITE SETTINGS (admin master only) ============
CREATE TABLE public.site_settings (
  id text PRIMARY KEY DEFAULT 'default',
  signature_url text NOT NULL DEFAULT '',
  signature_alt text NOT NULL DEFAULT 'EFC Tecnologia by EFCSYS — Soluções que conectam o seu futuro',
  institutional_text text NOT NULL DEFAULT '',
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.site_settings TO anon;
GRANT SELECT, INSERT, UPDATE ON public.site_settings TO authenticated;
GRANT ALL ON public.site_settings TO service_role;
ALTER TABLE public.site_settings ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Site settings are public" ON public.site_settings FOR SELECT USING (true);
CREATE POLICY "Admin master inserts site settings" ON public.site_settings FOR INSERT TO authenticated
  WITH CHECK (public.is_admin_master());
CREATE POLICY "Admin master updates site settings" ON public.site_settings FOR UPDATE TO authenticated
  USING (public.is_admin_master()) WITH CHECK (public.is_admin_master());
CREATE TRIGGER site_settings_updated_at BEFORE UPDATE ON public.site_settings
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
INSERT INTO public.site_settings (id) VALUES ('default');

-- ============ PROJECT MEDIA UPGRADE ============
ALTER TABLE public.project_media
  ADD COLUMN project_id uuid REFERENCES public.projects(id) ON DELETE CASCADE,
  ADD COLUMN media_kind public.media_kind NOT NULL DEFAULT 'gallery_desktop',
  ADD COLUMN fit text NOT NULL DEFAULT 'contain',
  ADD COLUMN position text NOT NULL DEFAULT 'center',
  ADD COLUMN alt text NOT NULL DEFAULT '';
CREATE INDEX project_media_project_idx ON public.project_media(project_id, sort_order);

-- ============ SEED: CATEGORIES ============
INSERT INTO public.categories (slug, name, sort_order) VALUES
  ('eventos','Eventos',1),
  ('gestao','Gestão',2),
  ('beleza','Beleza',3),
  ('fitness','Fitness',4),
  ('condominios','Condomínios',5),
  ('estoque','Estoque',6),
  ('automacao','Automação',7),
  ('dados','Dados',8);

-- ============ SEED: PROJECTS ============
INSERT INTO public.projects (slug, name, solution_type, category_id, sort_order) VALUES
  ('jc-barbearia','JC Barbearia','Gestão e Agendamento para Barbearias',(SELECT id FROM public.categories WHERE slug='beleza'),1),
  ('md-estetica','MD Estética e Beleza','Gestão e Agendamento para Studios de Estética',(SELECT id FROM public.categories WHERE slug='beleza'),2),
  ('cortesias-point','Cortesias Point','Gestão de Cortesias para Eventos',(SELECT id FROM public.categories WHERE slug='eventos'),3),
  ('agenda-artistas','Agenda de Artistas','Gestão de Agenda para Artistas e Produtores',(SELECT id FROM public.categories WHERE slug='eventos'),4),
  ('wine-barbell-club','Wine Barbell Club','Gestão de Studio de LPO e Treinamento',(SELECT id FROM public.categories WHERE slug='fitness'),5),
  ('point-pcd','Point PCD','Cadastro e Gestão de PCD para Eventos',(SELECT id FROM public.categories WHERE slug='eventos'),6),
  ('port-saint-john','Port Saint John','Reservas e Gestão de Áreas de Lazer',(SELECT id FROM public.categories WHERE slug='condominios'),7),
  ('sistema-restaurante','Sistema de Restaurante','Gestão para Restaurantes',(SELECT id FROM public.categories WHERE slug='gestao'),8),
  ('estoque-bobinas','Estoque de Bobinas','Controle de Estoque e Distribuição',(SELECT id FROM public.categories WHERE slug='estoque'),9),
  ('construstock','ConstruStock','Gestão de Estoque para Loja de Construção',(SELECT id FROM public.categories WHERE slug='estoque'),10),
  ('gestao-maquinetas','Gestão de Maquinetas','Controle e Gestão de Máquinas de Pagamento',(SELECT id FROM public.categories WHERE slug='gestao'),11),
  ('bots-efc','Bots EFC','Bots e Automações para WhatsApp',(SELECT id FROM public.categories WHERE slug='automacao'),12),
  ('efc-analytics','EFC Analytics','Análise de Dados, Dashboards e Relatórios',(SELECT id FROM public.categories WHERE slug='dados'),13);
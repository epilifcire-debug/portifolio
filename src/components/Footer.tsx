import { Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";
const logo = { url: "/brand/logo-efc.png" };
const signature = { url: "/brand/efcsys-signature.png" };
import CircuitBackground from "@/components/CircuitBackground";

const NAV = [
  { to: "/", label: "Início" },
  { to: "/projects", label: "Projetos" },
  { to: "/about", label: "Sobre" },
  { to: "/technologies", label: "Tecnologias" },
  { to: "/contact", label: "Contato" },
] as const;

const SOLUTIONS = [
  "Sistemas de Gestão",
  "Aplicativos e PWAs",
  "Dashboards e Dados",
  "Automações e Bots",
  "Soluções para Eventos",
  "Integrações",
];

export function Footer() {
  return (
    <footer className="relative mt-24 overflow-hidden border-t border-border/70 bg-card/40">
      <CircuitBackground className="opacity-40" />
      <div className="relative mx-auto grid w-full max-w-6xl gap-10 px-4 py-14 sm:px-6 md:grid-cols-3">
        <div>
          <img
            src={logo.url}
            alt="EFC Tecnologia"
            width={200}
            height={200}
            loading="lazy"
            className="h-14 w-auto object-contain"
          />
          <p className="mt-4 max-w-xs text-sm leading-relaxed text-muted-foreground">
            Desenvolvimento de aplicativos, plataformas de gestão, dashboards e automações
            personalizadas.
          </p>
          <Link
            to="/contact"
            className="mt-6 inline-flex items-center gap-2 rounded-md border border-primary/60 px-4 py-2.5 text-sm font-semibold text-primary transition-colors duration-200 hover:bg-primary/10 [&:hover_svg]:translate-x-1"
          >
            Fale com a EFC <ArrowRight className="size-3.5 transition-transform duration-200" />
          </Link>
        </div>

        <div>
          <h3 className="text-sm font-semibold text-primary">
            Navegação
          </h3>
          <ul className="mt-4 space-y-2.5">
            {NAV.map((item) => (
              <li key={item.to}>
                <Link
                  to={item.to}
                  className="text-sm text-muted-foreground transition-colors duration-200 hover:text-primary"
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="text-sm font-semibold text-primary">
            Soluções
          </h3>
          <ul className="mt-4 space-y-2.5">
            {SOLUTIONS.map((item) => (
              <li key={item} className="text-sm text-muted-foreground">
                {item}
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="relative border-t border-border/60 px-4 py-8 text-center sm:px-6">
        <img
          src={signature.url}
          alt="EFC Tecnologia by EFCSYS — Soluções que conectam o seu futuro. © 2026 EFCSYS, todos os direitos reservados."
          width={1200}
          height={480}
          loading="lazy"
          className="mx-auto h-auto w-full max-w-md object-contain"
        />
      </div>
    </footer>
  );
}

export default Footer;

import { useEffect, useState } from "react";
import { Link } from "@tanstack/react-router";
import { ArrowRight, Menu, X, Sun, Moon } from "lucide-react";
const logo = { url: "/brand/logo-efc.png" };

const NAV = [
  { to: "/", label: "Início", hash: undefined },
  { to: "/projects", label: "Projetos", hash: undefined },
  { to: "/", label: "Soluções", hash: "solucoes" },
  { to: "/about", label: "Sobre", hash: undefined },
  { to: "/technologies", label: "Tecnologias", hash: undefined },
  { to: "/articles", label: "Artigos", hash: undefined },
  { to: "/contact", label: "Contato", hash: undefined },
] as const;

function ThemeToggle() {
  const [light, setLight] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem("efc-theme");
    setLight(stored === "light");
  }, []);

  useEffect(() => {
    document.documentElement.classList.toggle("light", light);
    localStorage.setItem("efc-theme", light ? "light" : "dark");
  }, [light]);

  return (
    <button
      type="button"
      onClick={() => setLight((v) => !v)}
      aria-label="Alternar tema"
      className="grid size-10 place-items-center rounded-md border border-border text-muted-foreground transition-colors duration-200 hover:border-primary/60 hover:text-primary"
    >
      {light ? <Moon className="size-4" /> : <Sun className="size-4" />}
    </button>
  );
}

export function Header() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`sticky top-0 z-50 transition-[background-color,border-color,backdrop-filter] duration-300 ease-[var(--ease-standard)] ${
        scrolled
          ? "border-b border-border/60 bg-background/92 backdrop-blur-xl"
          : "border-b border-transparent bg-background/40 backdrop-blur-sm"
      }`}
    >
      <div
        className={`mx-auto flex w-full max-w-6xl items-center gap-6 px-4 transition-[height] duration-300 ease-[var(--ease-standard)] sm:px-6 ${
          scrolled ? "h-14" : "h-20"
        }`}
      >
        <Link to="/" className="flex shrink-0 items-center py-2" onClick={() => setOpen(false)}>
          <img
            src={logo.url}
            alt="EFC Tecnologia"
            width={160}
            height={160}
            className={`w-auto object-contain transition-[height] duration-300 ${scrolled ? "h-9" : "h-12"}`}
          />
        </Link>

        <nav className="ml-auto hidden items-center gap-7 lg:flex">
          {NAV.map((item) => (
            <Link
              key={item.label}
              to={item.to}
              {...(item.hash ? { hash: item.hash } : {})}
              activeOptions={{ exact: item.to === "/" }}
              className="relative text-sm font-medium text-muted-foreground transition-colors duration-200 after:absolute after:-bottom-1.5 after:left-0 after:h-px after:w-0 after:bg-[var(--gradient-gold)] after:transition-[width] after:duration-300 hover:text-primary hover:after:w-full [&.active]:text-primary"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="ml-auto flex items-center gap-2 lg:ml-0">
          <ThemeToggle />
          <Link
            to="/contact"
            className="hidden items-center gap-2 rounded-md border border-primary/60 px-4 py-2.5 text-sm font-semibold text-primary transition-all duration-200 hover:bg-primary/10 sm:inline-flex [&:hover_svg]:translate-x-1"
          >
            Fale comigo <ArrowRight className="size-3.5 transition-transform duration-200" />
          </Link>
          <button
            type="button"
            aria-label={open ? "Fechar menu" : "Abrir menu"}
            aria-expanded={open}
            onClick={() => setOpen((v) => !v)}
            className="grid size-11 place-items-center rounded-md border border-border text-foreground lg:hidden"
          >
            {open ? <X className="size-4" /> : <Menu className="size-4" />}
          </button>
        </div>
      </div>

      {open && (
        <nav className="border-t border-border/70 bg-background lg:hidden">
          <div className="mx-auto flex max-w-6xl flex-col px-4 py-3 sm:px-6">
            {NAV.map((item) => (
              <Link
                key={item.label}
                to={item.to}
                {...(item.hash ? { hash: item.hash } : {})}
                onClick={() => setOpen(false)}
                className="border-b border-border/40 py-3.5 text-base text-muted-foreground last:border-0 [&.active]:text-primary"
              >
                {item.label}
              </Link>
            ))}
            <Link
              to="/contact"
              onClick={() => setOpen(false)}
              className="bg-gold-metal mt-4 inline-flex items-center justify-center gap-2 rounded-md px-5 py-3.5 text-sm font-semibold text-primary-foreground"
            >
              Fale comigo <ArrowRight className="size-4" />
            </Link>
          </div>
        </nav>
      )}
    </header>
  );
}

export default Header;

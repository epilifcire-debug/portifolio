import { useEffect, useState } from "react";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { LogIn } from "lucide-react";
import { toast } from "sonner";
import CircuitBackground from "@/components/CircuitBackground";
import { supabase } from "@/integrations/supabase/client";
import { APP_VERSION } from "@/lib/version";

export const Route = createFileRoute("/auth")({
  ssr: false,
  head: () => ({
    meta: [
      { title: "Acesso administrativo | EFC Tecnologia" },
      { name: "description", content: "Área restrita de administração do portfólio." },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: AuthPage,
});

function AuthPage() {
  const navigate = useNavigate();
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      if (data.session) navigate({ to: "/admin", replace: true });
    });
  }, [navigate]);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    try {
      if (mode === "signin") {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        navigate({ to: "/admin", replace: true });
      } else {
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
          options: { emailRedirectTo: window.location.origin + "/admin" },
        });
        if (error) throw error;
        if (data.session) {
          navigate({ to: "/admin", replace: true });
        } else {
          toast.success("Conta criada. Confirme o e-mail para entrar.");
        }
      }
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Não foi possível continuar.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="relative flex min-h-[70vh] items-center overflow-hidden">
      <CircuitBackground />
      <div className="relative mx-auto w-full max-w-md px-4 py-16 sm:px-6">
        <div className="panel p-7">
          <h1 className="text-2xl font-bold text-foreground">
            {mode === "signin" ? "Entrar no painel" : "Criar acesso"}
          </h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Área restrita para configurar o portfólio.
          </p>

          <form className="mt-6 space-y-4" onSubmit={onSubmit}>
            <label className="block text-xs text-muted-foreground">
              E-mail
              <input
                required
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="mt-1.5 w-full rounded-md border border-input bg-background/60 px-3 py-2.5 text-sm text-foreground outline-none focus:border-primary/60"
              />
            </label>
            <label className="block text-xs text-muted-foreground">
              Senha
              <input
                required
                type="password"
                minLength={6}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="mt-1.5 w-full rounded-md border border-input bg-background/60 px-3 py-2.5 text-sm text-foreground outline-none focus:border-primary/60"
              />
            </label>
            <button
              type="submit"
              disabled={loading}
              className="bg-gold-metal inline-flex w-full items-center justify-center gap-2 rounded-md px-5 py-3 text-sm font-semibold text-primary-foreground disabled:opacity-60"
            >
              <LogIn className="size-4" />
              {mode === "signin" ? "Entrar" : "Criar conta"}
            </button>
          </form>

          <button
            type="button"
            onClick={() => setMode(mode === "signin" ? "signup" : "signin")}
            className="mt-4 text-xs text-primary"
          >
            {mode === "signin" ? "Primeiro acesso? Criar conta" : "Já tenho conta. Entrar"}
          </button>
        </div>
        <p className="mt-6 text-center text-xs text-muted-foreground">{APP_VERSION}</p>
      </div>
    </section>
  );
}

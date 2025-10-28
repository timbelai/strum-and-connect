import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { GraduationCap } from "lucide-react";

const ProfessorAuth = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const checkUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        // Se já estiver logado, verifica a role e redireciona
        const { data: profile } = await supabase.from("profiles").select("role").eq("id", user.id).single();
        if (profile?.role === "professor") {
            navigate("/");
        }
      }
    };
    checkUser();
  }, [navigate]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
        const { data, error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        if (error) throw error;

        // Verificar se o usuário logado é um professor
        const { data: profile, error: profileError } = await supabase
            .from("profiles")
            .select("role")
            .eq("id", data.user!.id)
            .single();

        if (profileError || profile?.role !== "professor") {
            // Se não for professor, desloga e mostra erro
            await supabase.auth.signOut();
            throw new Error("Acesso negado. Esta área é exclusiva para professores.");
        }

        toast.success("Login de Professor realizado com sucesso!");
        navigate("/");
      
    } catch (error: any) {
      toast.error(error.message || "Erro na autenticação");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-background to-muted/30 p-4">
      <Card className="w-full max-w-md shadow-lg border-accent/10">
        <CardHeader className="space-y-4 text-center">
          <div className="mx-auto w-16 h-16 bg-accent/10 rounded-full flex items-center justify-center">
            <GraduationCap className="w-8 h-8 text-accent" />
          </div>
          <div>
            <CardTitle className="text-3xl font-bold bg-gradient-to-r from-accent to-primary bg-clip-text text-transparent">
              Acesso Professor
            </CardTitle>
            <CardDescription className="text-base mt-2">
              Entre com suas credenciais de professor
            </CardDescription>
          </div>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="professor@journeyapp.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="transition-all focus:ring-2 focus:ring-accent/20"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Senha</Label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={6}
                className="transition-all focus:ring-2 focus:ring-accent/20"
              />
            </div>
            <Button
              type="submit"
              className="w-full bg-gradient-to-r from-accent to-primary hover:opacity-90 transition-all"
              disabled={loading}
            >
              {loading ? "Aguarde..." : "Entrar como Professor"}
            </Button>
            <button
              type="button"
              onClick={() => navigate("/auth")}
              className="w-full text-sm text-muted-foreground hover:text-primary transition-colors"
            >
              Voltar para Login do Aluno
            </button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default ProfessorAuth;
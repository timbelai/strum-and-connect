import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { GraduationCap, Guitar } from "lucide-react";

const ProfileSetup = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const selectRole = async (role: "aluno" | "professor") => {
    setLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Usuário não encontrado");

      const { error } = await supabase.from("profiles").insert({
        id: user.id,
        nome: user.user_metadata?.nome || "Usuário",
        role,
      });

      if (error) throw error;
      toast.success(`Perfil ${role === "aluno" ? "de aluno" : "de professor"} criado!`);
      navigate("/");
    } catch (error: any) {
      toast.error(error.message || "Erro ao criar perfil");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-background to-muted/30 p-4">
      <div className="w-full max-w-2xl space-y-8">
        <div className="text-center space-y-2">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            Escolha seu perfil
          </h1>
          <p className="text-muted-foreground">
            Selecione como você quer usar o JourneyApp
          </p>
        </div>
        <div className="grid md:grid-cols-2 gap-6">
          <Card
            className="cursor-pointer hover:shadow-lg hover:border-primary/50 transition-all group"
            onClick={() => !loading && selectRole("aluno")}
          >
            <CardHeader className="text-center space-y-4">
              <div className="mx-auto w-20 h-20 bg-primary/10 group-hover:bg-primary/20 rounded-full flex items-center justify-center transition-colors">
                <Guitar className="w-10 h-10 text-primary" />
              </div>
              <CardTitle className="text-2xl">Aluno</CardTitle>
              <CardDescription className="text-base">
                Aprenda violão cristão com professores dedicados
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-2 text-sm text-muted-foreground">
              <p>✓ Participe de grupos de estudo</p>
              <p>✓ Envie vídeos para correção</p>
              <p>✓ Agende mentorias personalizadas</p>
            </CardContent>
          </Card>

          <Card
            className="cursor-pointer hover:shadow-lg hover:border-secondary/50 transition-all group"
            onClick={() => !loading && selectRole("professor")}
          >
            <CardHeader className="text-center space-y-4">
              <div className="mx-auto w-20 h-20 bg-secondary/10 group-hover:bg-secondary/20 rounded-full flex items-center justify-center transition-colors">
                <GraduationCap className="w-10 h-10 text-secondary" />
              </div>
              <CardTitle className="text-2xl">Professor</CardTitle>
              <CardDescription className="text-base">
                Ensine e oriente alunos na jornada musical
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-2 text-sm text-muted-foreground">
              <p>✓ Corrija tarefas dos alunos</p>
              <p>✓ Crie grupos temáticos</p>
              <p>✓ Ofereça mentorias individuais</p>
            </CardContent>
          </Card>
        </div>
        <Button
          variant="ghost"
          onClick={() => navigate("/auth")}
          className="w-full"
          disabled={loading}
        >
          Voltar
        </Button>
      </div>
    </div>
  );
};

export default ProfileSetup;

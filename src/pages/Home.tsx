import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { LogOut, MessageSquare, ClipboardList, Calendar, Plus, Pencil, BookOpen } from "lucide-react";
import { toast } from "sonner";
import { Card } from "@/components/ui/card";
import RegisterStudyDialog from "@/components/RegisterStudyDialog"; // Importar o novo componente

interface Profile {
  id: string;
  nome: string;
  avatar_url: string | null;
  role: "aluno" | "professor";
  cidade: string | null;
  curiosidade: string | null;
}

interface Group {
  id: string;
  nome: string;
  descricao: string | null;
}

const Home = () => {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [groups, setGroups] = useState<Group[]>([]);
  const [loading, setLoading] = useState(true);
  const [isRegisterStudyDialogOpen, setIsRegisterStudyDialogOpen] = useState(false); // Estado para o modal
  const navigate = useNavigate();

  useEffect(() => {
    checkAuthAndFetchGroups();
  }, []);

  const checkAuthAndFetchGroups = async () => {
    setLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        navigate("/auth");
        return;
      }

      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user.id)
        .single();

      if (error) {
        console.error("Profile not found, redirecting to auth:", error);
        navigate("/auth");
        return;
      }

      setProfile(data);
      await createDefaultGroups();
      await fetchGroups();
    } catch (error) {
      console.error("Auth or data fetch error:", error);
      toast.error("Erro ao carregar dados. Tente novamente.");
      navigate("/auth");
    } finally {
      setLoading(false);
    }
  };

  const defaultGroupNames = ["Bate-Papo", "Dúvidas", "Edificação"];

  const createDefaultGroups = async () => {
    const { data: existingGroups, error: fetchError } = await supabase
      .from("groups")
      .select("nome");

    if (fetchError) {
      console.error("Error fetching existing groups:", fetchError);
      return;
    }

    const existingGroupNames = new Set(existingGroups?.map(g => g.nome));
    const groupsToInsert = defaultGroupNames
      .filter(name => !existingGroupNames.has(name))
      .map(name => ({ nome: name, descricao: `Grupo para ${name.toLowerCase()}` }));

    if (groupsToInsert.length > 0) {
      const { error: insertError } = await supabase
        .from("groups")
        .insert(groupsToInsert);

      if (insertError) {
        console.error("Error inserting default groups:", insertError);
        toast.error("Erro ao criar grupos padrão.");
      } else {
        toast.success("Grupos padrão criados!");
      }
    }
  };

  const fetchGroups = async () => {
    const { data, error } = await supabase.from("groups").select("*").order("created_at", { ascending: false });
    if (error) {
      toast.error("Erro ao carregar grupos");
      return;
    }
    setGroups(data || []);
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/auth");
  };

  const joinGroup = async (groupId: string) => {
    if (!profile) return;
    
    const { error } = await supabase.from("group_members").insert({
      group_id: groupId,
      user_id: profile.id,
    });

    if (error) {
      if (error.code === "23505") {
        toast.info("Você já está neste grupo");
        navigate(`/chat/${groupId}`);
      } else {
        toast.error("Erro ao entrar no grupo");
      }
      return;
    }

    toast.success("Você entrou no grupo!");
    navigate(`/chat/${groupId}`);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-pulse text-muted-foreground">Carregando...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/30">
      {/* Header */}
      <header className="bg-card border-b border-border/50 shadow-sm sticky top-0 z-10">
        <div className="max-w-2xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Avatar className="w-10 h-10 border-2 border-primary/20">
              {profile?.avatar_url ? (
                <AvatarImage src={profile.avatar_url} alt="Avatar" />
              ) : (
                <AvatarFallback className="bg-primary/10 text-primary font-semibold">
                  {profile?.nome?.[0]?.toUpperCase()}
                </AvatarFallback>
              )}
            </Avatar>
            <div>
              <h2 className="font-semibold">{profile?.nome}</h2>
              <p className="text-xs text-muted-foreground capitalize">{profile?.role}</p>
            </div>
            <Button variant="ghost" size="icon" onClick={() => navigate("/profile-edit")} className="ml-2">
              <Pencil className="w-5 h-5 text-muted-foreground" />
            </Button>
          </div>
          <Button variant="ghost" size="icon" onClick={handleLogout}>
            <LogOut className="w-5 h-5" />
          </Button>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-2xl mx-auto px-4 py-6 space-y-6">
        {/* Quick Actions */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          <Button
            variant="outline"
            className="flex-col h-auto py-4 space-y-2"
            onClick={() => navigate("/tasks")}
          >
            <ClipboardList className="w-6 h-6 text-primary" />
            <span className="text-xs">Tarefas</span>
          </Button>
          <Button
            variant="outline"
            className="flex-col h-auto py-4 space-y-2"
            onClick={() => setIsRegisterStudyDialogOpen(true)} // Abre o modal
          >
            <BookOpen className="w-6 h-6 text-accent" />
            <span className="text-xs">Registrar Estudo</span>
          </Button>
          <Button
            variant="outline"
            className="flex-col h-auto py-4 space-y-2"
            onClick={() => navigate("/meetings")}
          >
            <Calendar className="w-6 h-6 text-secondary" />
            <span className="text-xs">Agendas</span>
          </Button>
          {profile?.role === "professor" && (
            <Button
              variant="outline"
              className="flex-col h-auto py-4 space-y-2"
              onClick={() => navigate("/create-group")}
            >
              <Plus className="w-6 h-6 text-accent" />
              <span className="text-xs">Criar Grupo</span>
            </Button>
          )}
        </div>

        {/* Groups List */}
        <div className="space-y-3">
          <h3 className="text-lg font-semibold px-1">Grupos disponíveis</h3>
          {groups.length === 0 ? (
            <Card className="p-8 text-center text-muted-foreground">
              Nenhum grupo disponível ainda
            </Card>
          ) : (
            groups.map((group) => (
              <Card
                key={group.id}
                className="p-4 hover:shadow-md transition-all cursor-pointer"
                onClick={() => joinGroup(group.id)}
              >
                <div className="flex items-start gap-3">
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <MessageSquare className="w-6 h-6 text-primary" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-semibold truncate">{group.nome}</h4>
                    <p className="text-sm text-muted-foreground line-clamp-2">
                      {group.descricao || "Sem descrição"}
                    </p>
                  </div>
                </div>
              </Card>
            ))
          )}
        </div>
      </main>

      {profile && (
        <RegisterStudyDialog
          isOpen={isRegisterStudyDialogOpen}
          onClose={() => setIsRegisterStudyDialogOpen(false)}
          userId={profile.id}
        />
      )}
    </div>
  );
};

export default Home;
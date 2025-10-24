import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { ArrowLeft, ExternalLink, CheckCircle, Clock } from "lucide-react";
import { toast } from "sonner";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

interface Task {
  id: string;
  link_video: string;
  status: "pendente" | "corrigida";
  comentario_professor: string | null;
  created_at: string;
  student_id: string;
  profiles: {
    nome: string;
  } | null;
}

const Tasks = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [profile, setProfile] = useState<any>(null);
  const [selectedTask, setSelectedTask] = useState<string | null>(null);
  const [comment, setComment] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      navigate("/auth");
      return;
    }

    const { data: profileData } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", user.id)
      .single();

    if (!profileData) {
      navigate("/profile-setup");
      return;
    }

    setProfile(profileData);
    fetchTasks(profileData);
  };

  const fetchTasks = async (userProfile: any) => {
    let query = supabase.from("tasks").select(`
      *,
      profiles!tasks_student_id_fkey (nome)
    `);

    if (userProfile.role === "aluno") {
      query = query.eq("student_id", userProfile.id);
    }

    const { data, error } = await query.order("created_at", { ascending: false });

    if (error) {
      toast.error("Erro ao carregar tarefas");
      return;
    }
    setTasks(data || []);
  };

  const correctTask = async (taskId: string) => {
    if (!comment.trim()) {
      toast.error("Adicione um comentário");
      return;
    }

    const { error } = await supabase
      .from("tasks")
      .update({
        status: "corrigida",
        comentario_professor: comment,
        professor_id: profile.id,
      })
      .eq("id", taskId);

    if (error) {
      toast.error("Erro ao corrigir tarefa");
      return;
    }

    toast.success("Tarefa corrigida!");
    setSelectedTask(null);
    setComment("");
    fetchTasks(profile);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/30">
      {/* Header */}
      <header className="bg-card border-b border-border/50 shadow-sm px-4 py-4 flex items-center gap-3">
        <Button variant="ghost" size="icon" onClick={() => navigate("/")}>
          <ArrowLeft className="w-5 h-5" />
        </Button>
        <h1 className="text-xl font-bold">Tarefas</h1>
      </header>

      {/* Content */}
      <main className="max-w-2xl mx-auto px-4 py-6 space-y-4">
        {profile?.role === "aluno" && (
          <Button
            onClick={() => navigate("/submit-task")}
            className="w-full bg-gradient-to-r from-primary to-accent"
          >
            Enviar nova tarefa
          </Button>
        )}

        {tasks.length === 0 ? (
          <Card className="p-8 text-center text-muted-foreground">
            {profile?.role === "aluno"
              ? "Você ainda não enviou nenhuma tarefa"
              : "Nenhuma tarefa pendente"}
          </Card>
        ) : (
          tasks.map((task) => (
            <Card key={task.id} className="p-4 space-y-3">
              <div className="flex items-start justify-between">
                <div className="space-y-1">
                  {profile?.role === "professor" && (
                    <p className="text-sm font-medium">Aluno: {task.profiles?.nome}</p>
                  )}
                  <p className="text-xs text-muted-foreground">
                    {format(new Date(task.created_at), "dd/MM/yyyy 'às' HH:mm", { locale: ptBR })}
                  </p>
                </div>
                <Badge variant={task.status === "corrigida" ? "default" : "secondary"}>
                  {task.status === "corrigida" ? (
                    <CheckCircle className="w-3 h-3 mr-1" />
                  ) : (
                    <Clock className="w-3 h-3 mr-1" />
                  )}
                  {task.status === "corrigida" ? "Corrigida" : "Pendente"}
                </Badge>
              </div>

              <a
                href={task.link_video}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-sm text-primary hover:underline"
              >
                <ExternalLink className="w-4 h-4" />
                Ver vídeo
              </a>

              {task.comentario_professor && (
                <div className="bg-muted/50 rounded-lg p-3 space-y-1">
                  <p className="text-xs font-medium text-muted-foreground">Feedback do professor:</p>
                  <p className="text-sm">{task.comentario_professor}</p>
                </div>
              )}

              {profile?.role === "professor" && task.status === "pendente" && (
                <>
                  {selectedTask === task.id ? (
                    <div className="space-y-2">
                      <Textarea
                        placeholder="Escreva seu feedback..."
                        value={comment}
                        onChange={(e) => setComment(e.target.value)}
                        rows={4}
                      />
                      <div className="flex gap-2">
                        <Button onClick={() => correctTask(task.id)} className="flex-1">
                          Enviar correção
                        </Button>
                        <Button
                          variant="outline"
                          onClick={() => {
                            setSelectedTask(null);
                            setComment("");
                          }}
                        >
                          Cancelar
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <Button
                      variant="outline"
                      onClick={() => setSelectedTask(task.id)}
                      className="w-full"
                    >
                      Corrigir tarefa
                    </Button>
                  )}
                </>
              )}
            </Card>
          ))
        )}
      </main>
    </div>
  );
};

export default Tasks;

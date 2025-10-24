import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { ArrowLeft } from "lucide-react";
import { toast } from "sonner";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface Group {
  id: string;
  nome: string;
}

const SubmitTask = () => {
  const [linkVideo, setLinkVideo] = useState("");
  const [selectedGroup, setSelectedGroup] = useState<string>("");
  const [groups, setGroups] = useState<Group[]>([]);
  const [loading, setLoading] = useState(false);
  const [userId, setUserId] = useState<string>("");
  const navigate = useNavigate();

  useEffect(() => {
    checkAuth();
    fetchUserGroups();
  }, []);

  const checkAuth = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      navigate("/auth");
      return;
    }
    setUserId(user.id);
  };

  const fetchUserGroups = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const { data: memberGroups } = await supabase
      .from("group_members")
      .select("group_id, groups:group_id (id, nome)")
      .eq("user_id", user.id);

    if (memberGroups) {
      const groupsList = memberGroups
        .map((mg: any) => mg.groups)
        .filter((g: any) => g !== null);
      setGroups(groupsList);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!linkVideo.trim()) {
      toast.error("Adicione o link do vídeo");
      return;
    }

    setLoading(true);

    try {
      const { error } = await supabase.from("tasks").insert({
        student_id: userId,
        link_video: linkVideo.trim(),
        group_id: selectedGroup || null,
        status: "pendente",
      });

      if (error) throw error;

      toast.success("Tarefa enviada com sucesso!");
      navigate("/tasks");
    } catch (error: any) {
      toast.error(error.message || "Erro ao enviar tarefa");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/30">
      <header className="bg-card border-b border-border/50 shadow-sm px-4 py-4 flex items-center gap-3">
        <Button variant="ghost" size="icon" onClick={() => navigate("/tasks")}>
          <ArrowLeft className="w-5 h-5" />
        </Button>
        <h1 className="text-xl font-bold">Enviar Tarefa</h1>
      </header>

      <main className="max-w-2xl mx-auto px-4 py-6">
        <Card className="p-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="link">Link do vídeo *</Label>
              <Input
                id="link"
                type="url"
                placeholder="https://youtube.com/... ou https://drive.google.com/..."
                value={linkVideo}
                onChange={(e) => setLinkVideo(e.target.value)}
                required
              />
              <p className="text-xs text-muted-foreground">
                Cole o link do YouTube, Google Drive, Loom ou outra plataforma
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="group">Grupo (opcional)</Label>
              <Select value={selectedGroup} onValueChange={setSelectedGroup}>
                <SelectTrigger id="group">
                  <SelectValue placeholder="Selecione um grupo" />
                </SelectTrigger>
                <SelectContent>
                  {groups.map((group) => (
                    <SelectItem key={group.id} value={group.id}>
                      {group.nome}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <p className="text-xs text-muted-foreground">
                Associe a tarefa a um grupo específico (opcional)
              </p>
            </div>

            <div className="pt-4 space-y-3">
              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? "Enviando..." : "Enviar tarefa"}
              </Button>
              <Button
                type="button"
                variant="outline"
                className="w-full"
                onClick={() => navigate("/tasks")}
              >
                Cancelar
              </Button>
            </div>
          </form>
        </Card>
      </main>
    </div>
  );
};

export default SubmitTask;

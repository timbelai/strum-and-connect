import { useState, useEffect } from "react";
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
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";

interface Group {
  id: string;
  nome: string;
}

interface SubmitTaskDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onTaskSubmitted: () => void;
}

const SubmitTaskDialog = ({ isOpen, onClose, onTaskSubmitted }: SubmitTaskDialogProps) => {
  const [linkVideo, setLinkVideo] = useState("");
  const [selectedGroup, setSelectedGroup] = useState<string>("");
  const [groups, setGroups] = useState<Group[]>([]);
  const [loading, setLoading] = useState(false);
  const [userId, setUserId] = useState<string>("");

  useEffect(() => {
    if (isOpen) {
      checkAuth();
      fetchUserGroups();
      setLinkVideo(""); // Reset form when dialog opens
      setSelectedGroup("");
    }
  }, [isOpen]);

  const checkAuth = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      // If user is not authenticated, close dialog and let parent handle navigation
      onClose();
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
      onTaskSubmitted(); // Notify parent to refresh tasks
      onClose(); // Close the dialog
    } catch (error: any) {
      toast.error(error.message || "Erro ao enviar tarefa");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Enviar Tarefa</DialogTitle>
          <DialogDescription>
            Preencha os detalhes da sua tarefa e envie para correção.
          </DialogDescription>
        </DialogHeader>
        <div className="py-4">
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
                onClick={onClose}
              >
                Cancelar
              </Button>
            </div>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default SubmitTaskDialog;
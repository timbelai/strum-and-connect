import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { format, isToday, startOfDay, endOfDay } from "date-fns";
import { ptBR } from "date-fns/locale";
import { BookOpen, Users, MonitorPlay, Sparkles } from "lucide-react";
import { Enums } from "@/integrations/supabase/types";

type StudyType = Enums<'study_type'>;

interface StudyOption {
  value: StudyType;
  label: string;
  icon: React.ElementType;
}

const studyOptions: StudyOption[] = [
  { value: "individual", label: "Estudo Individual", icon: BookOpen },
  { value: "group", label: "Estudo em Grupo", icon: Users },
  { value: "live", label: "Live/Aula Online", icon: MonitorPlay },
  { value: "composition", label: "Composição", icon: Sparkles },
];

interface RegisterStudyDialogProps {
  isOpen: boolean;
  onClose: () => void;
  userId: string;
}

const RegisterStudyDialog = ({ isOpen, onClose, userId }: RegisterStudyDialogProps) => {
  const [completedStudies, setCompletedStudies] = useState<Set<StudyType>>(new Set());
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen && userId) {
      fetchCompletedStudies();
    }
  }, [isOpen, userId]);

  const fetchCompletedStudies = async () => {
    setLoading(true);
    const todayStart = startOfDay(new Date()).toISOString();
    const todayEnd = endOfDay(new Date()).toISOString();

    const { data, error } = await supabase
      .from("user_studies")
      .select("study_type") // Não precisamos de completed_at aqui, já que o filtro é por data
      .eq("user_id", userId)
      .gte("completed_at", todayStart)
      .lte("completed_at", todayEnd);

    if (error) {
      toast.error("Erro ao carregar estudos registrados.");
      console.error("Error fetching completed studies:", error);
      setLoading(false);
      return;
    }

    const todayCompleted = new Set<StudyType>();
    data.forEach((study) => {
      todayCompleted.add(study.study_type);
    });
    setCompletedStudies(todayCompleted);
    setLoading(false);
  };

  const handleToggleStudy = async (studyType: StudyType, isChecked: boolean) => {
    if (!userId) {
      toast.error("Usuário não autenticado.");
      return;
    }
    setLoading(true);

    try {
      if (isChecked) {
        // Mark as complete
        const { error } = await supabase.from("user_studies").insert({
          user_id: userId,
          study_type: studyType,
          // completed_at usará o default now() do banco de dados, que é um timestamp com fuso horário
        });
        if (error) throw error;
        setCompletedStudies((prev) => new Set(prev).add(studyType));
        toast.success(`"${studyOptions.find(o => o.value === studyType)?.label}" registrado!`);
      } else {
        // Unmark (delete)
        const todayStart = startOfDay(new Date()).toISOString();
        const todayEnd = endOfDay(new Date()).toISOString();

        const { error } = await supabase
          .from("user_studies")
          .delete()
          .eq("user_id", userId)
          .eq("study_type", studyType)
          .gte("completed_at", todayStart)
          .lte("completed_at", todayEnd);
        if (error) throw error;
        setCompletedStudies((prev) => {
          const newSet = new Set(prev);
          newSet.delete(studyType);
          return newSet;
        });
        toast.info(`"${studyOptions.find(o => o.value === studyType)?.label}" desmarcado.`);
      }
    } catch (error: any) {
      toast.error(error.message || "Erro ao atualizar registro de estudo.");
      console.error("Error toggling study:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Registrar Estudo Diário</DialogTitle>
          <DialogDescription>
            Marque os tipos de estudo que você realizou hoje.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          {loading ? (
            <div className="text-center text-muted-foreground">Carregando...</div>
          ) : (
            studyOptions.map((option) => {
              const Icon = option.icon;
              const isChecked = completedStudies.has(option.value);
              return (
                <div key={option.value} className="flex items-center space-x-3">
                  <Checkbox
                    id={option.value}
                    checked={isChecked}
                    onCheckedChange={(checked) =>
                      handleToggleStudy(option.value, checked as boolean)
                    }
                    disabled={loading}
                  />
                  <Label
                    htmlFor={option.value}
                    className={`flex items-center gap-2 text-base font-medium cursor-pointer ${
                      isChecked ? "line-through text-muted-foreground" : ""
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                    {option.label}
                  </Label>
                </div>
              );
            })
          )}
        </div>
        <Button onClick={onClose} className="w-full">
          Fechar
        </Button>
      </DialogContent>
    </Dialog>
  );
};

export default RegisterStudyDialog;
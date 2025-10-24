import React, { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerDescription,
} from "@/components/ui/drawer";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar as CalendarIcon, Clock, User } from "lucide-react";
import { toast } from "sonner";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

interface ProfileSummary {
  id: string; // Adicionado o ID aqui
  nome: string;
}

interface Meeting {
  id: string;
  horario_inicio: string;
  horario_fim: string;
  aluno_profile: ProfileSummary | null;
  professor_profile: ProfileSummary | null;
}

interface AgendaFeedDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  userId: string;
}

const AgendaFeedDrawer = ({ isOpen, onClose, userId }: AgendaFeedDrawerProps) => {
  const [meetings, setMeetings] = useState<Meeting[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (isOpen && userId) {
      fetchMeetings();
    }
  }, [isOpen, userId]);

  const fetchMeetings = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("video_meetings")
      .select(`
        *,
        aluno_profile:profiles!video_meetings_aluno_id_fkey (id, nome),
        professor_profile:profiles!video_meetings_professor_id_fkey (id, nome)
      `)
      .or(`aluno_id.eq.${userId},professor_id.eq.${userId}`)
      .gte("horario_inicio", new Date().toISOString())
      .order("horario_inicio", { ascending: true });

    if (error) {
      toast.error("Erro ao carregar agendamentos");
      console.error("Error fetching meetings:", error);
      setLoading(false);
      return;
    }
    setMeetings(data || []);
    setLoading(false);
  };

  return (
    <Drawer open={isOpen} onOpenChange={onClose} direction="left">
      <DrawerContent className="w-full max-w-md h-full mt-0 rounded-none">
        <DrawerHeader className="bg-card border-b border-border/50 shadow-sm p-4">
          <DrawerTitle className="text-xl font-bold flex items-center gap-2">
            <CalendarIcon className="w-6 h-6" /> Próximas Mentorias
          </DrawerTitle>
          <DrawerDescription>Seus agendamentos futuros.</DrawerDescription>
        </DrawerHeader>
        <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-muted/30">
          {loading ? (
            <div className="text-center text-muted-foreground py-8">Carregando agendamentos...</div>
          ) : meetings.length === 0 ? (
            <Card className="p-8 text-center text-muted-foreground">
              <CalendarIcon className="w-12 h-12 mx-auto mb-4 text-muted-foreground/50" />
              <p>Nenhuma mentoria agendada</p>
            </Card>
          ) : (
            meetings.map((meeting) => {
              const isStudent = userId === meeting.aluno_profile?.id;
              const otherPersonName = isStudent
                ? meeting.professor_profile?.nome
                : meeting.aluno_profile?.nome;

              return (
                <Card key={meeting.id} className="p-4 space-y-3">
                  <div className="flex items-start justify-between">
                    <div className="space-y-1">
                      <p className="font-medium flex items-center gap-2">
                        <User className="w-4 h-4 text-muted-foreground" />
                        {isStudent ? "Professor:" : "Aluno:"} {otherPersonName}
                      </p>
                      <p className="text-sm text-muted-foreground flex items-center gap-1">
                        <CalendarIcon className="w-4 h-4" />
                        {format(new Date(meeting.horario_inicio), "dd/MM/yyyy", { locale: ptBR })}
                      </p>
                    </div>
                    <Badge variant="secondary">Agendado</Badge>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Clock className="w-4 h-4 text-muted-foreground" />
                    <span className="font-medium">
                      {format(new Date(meeting.horario_inicio), "HH:mm", { locale: ptBR })}
                    </span>
                    <span className="text-muted-foreground">-</span>
                    <span className="font-medium">
                      {format(new Date(meeting.horario_fim), "HH:mm", { locale: ptBR })}
                    </span>
                  </div>
                </Card>
              );
            })
          )}
        </div>
      </DrawerContent>
    </Drawer>
  );
};

export default AgendaFeedDrawer;
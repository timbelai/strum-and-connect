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
import { format, addDays, isToday, isTomorrow } from "date-fns";
import { ptBR } from "date-fns/locale";

interface ProfileSummary {
  id: string;
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
  const [groupedMeetings, setGroupedMeetings] = useState<Map<string, Meeting[]>>(new Map());
  const [displayedDates, setDisplayedDates] = useState<Date[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (isOpen && userId) {
      const today = new Date();
      const futureDates = generateFutureDates(today, 60); // Gerar datas para os próximos 60 dias
      setDisplayedDates(futureDates);
      fetchMeetings();
    }
  }, [isOpen, userId]);

  const generateFutureDates = (startDate: Date, numberOfDays: number): Date[] => {
    const dates: Date[] = [];
    for (let i = 0; i < numberOfDays; i++) {
      dates.push(addDays(startDate, i));
    }
    return dates;
  };

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

    const grouped = new Map<string, Meeting[]>();
    data?.forEach(meeting => {
      const dateKey = format(new Date(meeting.horario_inicio), "yyyy-MM-dd");
      if (!grouped.has(dateKey)) {
        grouped.set(dateKey, []);
      }
      grouped.get(dateKey)?.push(meeting);
    });
    setGroupedMeetings(grouped);
    setLoading(false);
  };

  return (
    <Drawer open={isOpen} onOpenChange={onClose} direction="left">
      <DrawerContent className="w-full sm:max-w-[min(33.33%,_400px)] h-full mt-0 rounded-none">
        <DrawerHeader className="bg-card border-b border-border/50 shadow-sm p-4">
          <DrawerTitle className="text-xl font-bold flex items-center gap-2">
            <CalendarIcon className="w-6 h-6" /> Próximas Mentorias
          </DrawerTitle>
          <DrawerDescription>Seus agendamentos futuros.</DrawerDescription>
        </DrawerHeader>
        <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-muted/30">
          {loading ? (
            <div className="text-center text-muted-foreground py-8">Carregando agendamentos...</div>
          ) : (
            displayedDates.map((date) => {
              const dateKey = format(date, "yyyy-MM-dd");
              const meetingsForDate = groupedMeetings.get(dateKey) || [];

              let dateLabel = format(date, "EEEE, dd 'de' MMMM", { locale: ptBR });
              if (isToday(date)) {
                dateLabel = "Hoje";
              } else if (isTomorrow(date)) {
                dateLabel = "Amanhã";
              }

              return (
                <div key={dateKey} className="space-y-3">
                  <h3 className="text-lg font-semibold text-foreground px-2 pt-4">{dateLabel}</h3>
                  {meetingsForDate.length === 0 ? (
                    <Card className="p-4 text-center text-muted-foreground">
                      Nenhuma mentoria agendada para este dia.
                    </Card>
                  ) : (
                    meetingsForDate.map((meeting) => {
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
              );
            })
          )}
        </div>
      </DrawerContent>
    </Drawer>
  );
};

export default AgendaFeedDrawer;
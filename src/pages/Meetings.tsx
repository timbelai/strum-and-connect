import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Calendar as CalendarIcon, Plus } from "lucide-react";
import { toast } from "sonner";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

interface Meeting {
  id: string;
  horario_inicio: string;
  horario_fim: string;
  aluno_profile: {
    nome: string;
  } | null;
  professor_profile: {
    nome: string;
  } | null;
}

const Meetings = () => {
  const [meetings, setMeetings] = useState<Meeting[]>([]);
  const [profile, setProfile] = useState<any>(null);
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
    fetchMeetings(profileData);
  };

  const fetchMeetings = async (userProfile: any) => {
    const { data, error } = await supabase
      .from("video_meetings")
      .select(`
        *,
        aluno_profile:profiles!video_meetings_aluno_id_fkey (nome),
        professor_profile:profiles!video_meetings_professor_id_fkey (nome)
      `)
      .or(`aluno_id.eq.${userProfile.id},professor_id.eq.${userProfile.id}`)
      .gte("horario_inicio", new Date().toISOString())
      .order("horario_inicio", { ascending: true });

    if (error) {
      toast.error("Erro ao carregar agendamentos");
      return;
    }
    setMeetings(data || []);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/30">
      <header className="bg-card border-b border-border/50 shadow-sm px-4 py-4 flex items-center gap-3">
        <Button variant="ghost" size="icon" onClick={() => navigate("/")}>
          <ArrowLeft className="w-5 h-5" />
        </Button>
        <h1 className="text-xl font-bold">Agendamentos</h1>
      </header>

      <main className="max-w-2xl mx-auto px-4 py-6 space-y-4">
        {profile?.role === "aluno" && (
          <Button
            onClick={() => navigate("/schedule-meeting")}
            className="w-full bg-gradient-to-r from-secondary to-accent"
          >
            <Plus className="w-5 h-5 mr-2" />
            Agendar mentoria
          </Button>
        )}

        {meetings.length === 0 ? (
          <Card className="p-8 text-center text-muted-foreground">
            <CalendarIcon className="w-12 h-12 mx-auto mb-4 text-muted-foreground/50" />
            <p>Nenhuma mentoria agendada</p>
          </Card>
        ) : (
          meetings.map((meeting) => {
            const isStudent = profile?.id === meeting.aluno_profile;
            const otherPerson = isStudent
              ? meeting.professor_profile?.nome
              : meeting.aluno_profile?.nome;

            return (
              <Card key={meeting.id} className="p-4 space-y-3">
                <div className="flex items-start justify-between">
                  <div className="space-y-1">
                    <p className="font-medium">
                      {isStudent ? "Professor:" : "Aluno:"} {otherPerson}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {format(new Date(meeting.horario_inicio), "dd/MM/yyyy", { locale: ptBR })}
                    </p>
                  </div>
                  <Badge variant="secondary">
                    <CalendarIcon className="w-3 h-3 mr-1" />
                    Agendado
                  </Badge>
                </div>
                <div className="flex items-center gap-2 text-sm">
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
      </main>
    </div>
  );
};

export default Meetings;

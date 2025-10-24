import React from "react";
import { Button } from "@/components/ui/button";
import { Calendar } from "lucide-react";

interface FloatingAgendaButtonProps {
  onOpenAgenda: () => void;
}

const FloatingAgendaButton = ({ onOpenAgenda }: FloatingAgendaButtonProps) => {
  return (
    <Button
      size="icon"
      className="fixed bottom-4 left-4 rounded-full w-14 h-14 shadow-lg bg-secondary hover:bg-secondary/90 transition-all duration-300 z-50"
      onClick={onOpenAgenda}
      aria-label="Agendas"
    >
      <Calendar className="w-6 h-6 text-secondary-foreground" />
    </Button>
  );
};

export default FloatingAgendaButton;
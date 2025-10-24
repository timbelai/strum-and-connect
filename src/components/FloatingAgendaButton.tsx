import React from "react";
import { Button } from "@/components/ui/button";
import { Calendar } from "lucide-react";
import { useNavigate } from "react-router-dom";

const FloatingAgendaButton = () => {
  const navigate = useNavigate();

  return (
    <Button
      size="icon"
      className="fixed bottom-4 left-4 rounded-full w-14 h-14 shadow-lg bg-secondary hover:bg-secondary/90 transition-all duration-300 z-50"
      onClick={() => navigate("/meetings")}
      aria-label="Agendas"
    >
      <Calendar className="w-6 h-6 text-secondary-foreground" />
    </Button>
  );
};

export default FloatingAgendaButton;
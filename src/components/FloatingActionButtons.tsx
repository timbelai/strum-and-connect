import React from "react";
import { Button } from "@/components/ui/button";
import { BookOpen, ClipboardList, Calendar } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";

interface FloatingActionButtonsProps {
  onRegisterStudyClick: () => void;
  onOpenAgenda: () => void;
}

const FloatingActionButtons = ({ onRegisterStudyClick, onOpenAgenda }: FloatingActionButtonsProps) => {
  const navigate = useNavigate();

  return (
    <div className="fixed bottom-4 right-4 flex flex-col items-end space-y-3 z-50">
      <Button
        size="icon"
        className="rounded-full w-14 h-14 shadow-lg bg-primary hover:bg-primary/90 transition-all duration-300"
        onClick={onRegisterStudyClick}
        aria-label="Registrar Estudo"
      >
        <BookOpen className="w-6 h-6 text-primary-foreground" />
      </Button>
      <Button
        size="icon"
        className="rounded-full w-14 h-14 shadow-lg bg-secondary hover:bg-secondary/90 transition-all duration-300"
        onClick={() => navigate("/tasks")}
        aria-label="Tarefas"
      >
        <ClipboardList className="w-6 h-6 text-secondary-foreground" />
      </Button>
      <Button
        size="icon"
        className="rounded-full w-14 h-14 shadow-lg bg-accent hover:bg-accent/90 transition-all duration-300"
        onClick={onOpenAgenda}
        aria-label="Agenda"
      >
        <Calendar className="w-6 h-6 text-accent-foreground" />
      </Button>
    </div>
  );
};

export default FloatingActionButtons;
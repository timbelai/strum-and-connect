import React from "react";
import { Button } from "@/components/ui/button";
import { BookOpen } from "lucide-react";

interface FloatingRegisterStudyButtonProps {
  onRegisterStudyClick: () => void;
}

const FloatingRegisterStudyButton = ({ onRegisterStudyClick }: FloatingRegisterStudyButtonProps) => {
  return (
    <Button
      size="icon"
      className="fixed bottom-4 right-4 rounded-full w-14 h-14 shadow-lg bg-primary hover:bg-primary/90 transition-all duration-300 z-50"
      onClick={onRegisterStudyClick}
      aria-label="Registrar Estudo"
    >
      <BookOpen className="w-6 h-6 text-primary-foreground" />
    </Button>
  );
};

export default FloatingRegisterStudyButton;
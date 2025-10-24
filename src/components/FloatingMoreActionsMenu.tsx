import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { ClipboardList, Plus, X } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";

interface FloatingMoreActionsMenuProps {
  profileRole: "aluno" | "professor" | undefined;
}

const FloatingMoreActionsMenu = ({ profileRole }: FloatingMoreActionsMenuProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();

  return (
    <div className="fixed bottom-24 right-4 flex flex-col items-end space-y-3 z-50">
      {isOpen && (
        <div className="flex flex-col items-end space-y-3">
          <Button
            variant="outline"
            size="icon"
            className="rounded-full w-12 h-12 shadow-lg bg-card hover:bg-muted/80 transition-all duration-300"
            onClick={() => {
              navigate("/tasks");
              setIsOpen(false);
            }}
            aria-label="Tarefas"
          >
            <ClipboardList className="w-5 h-5 text-primary" />
          </Button>
          {/* O botão "Criar Grupo" foi removido conforme a solicitação */}
        </div>
      )}
      <Button
        size="icon"
        className={cn(
          "rounded-full w-14 h-14 shadow-lg bg-accent hover:bg-accent/90 transition-all duration-300",
          isOpen && "rotate-45 bg-destructive hover:bg-destructive/90"
        )}
        onClick={() => setIsOpen(!isOpen)}
        aria-label={isOpen ? "Fechar menu de ações" : "Abrir menu de ações"}
      >
        {isOpen ? <X className="w-6 h-6 text-destructive-foreground" /> : <Plus className="w-6 h-6 text-accent-foreground" />}
      </Button>
    </div>
  );
};

export default FloatingMoreActionsMenu;
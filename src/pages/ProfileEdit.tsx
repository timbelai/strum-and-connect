import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ArrowLeft, Upload, User } from "lucide-react";
import { toast } from "sonner";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

const profileSchema = z.object({
  nome: z.string().min(1, "Nome é obrigatório"),
  cidade: z.string().optional(),
  curiosidade: z.string().optional(),
});

type ProfileFormValues = z.infer<typeof profileSchema>;

const ProfileEdit = () => {
  const [loading, setLoading] = useState(true);
  const [userId, setUserId] = useState<string | null>(null);
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const navigate = useNavigate();

  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      nome: "",
      cidade: "",
      curiosidade: "",
    },
  });

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    setLoading(true);
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      navigate("/auth");
      return;
    }
    setUserId(user.id);

    const { data, error } = await supabase
      .from("profiles")
      .select("nome, avatar_url, cidade, curiosidade")
      .eq("id", user.id)
      .single();

    if (error) {
      toast.error("Erro ao carregar perfil");
      console.error(error);
      setLoading(false);
      return;
    }

    if (data) {
      form.reset({
        nome: data.nome,
        cidade: data.cidade || "",
        curiosidade: data.curiosidade || "",
      });
      setAvatarUrl(data.avatar_url);
    }
    setLoading(false);
  };

  const handleAvatarChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      const file = event.target.files[0];
      setAvatarFile(file);
      setAvatarUrl(URL.createObjectURL(file)); // Create a preview URL
    }
  };

  const uploadAvatar = async (file: File, userId: string) => {
    const fileExt = file.name.split(".").pop();
    const fileName = `${userId}-${Date.now()}.${fileExt}`;
    const filePath = `avatars/${fileName}`;

    const { error: uploadError } = await supabase.storage
      .from("avatars") // Certifique-se de que este bucket existe no Supabase
      .upload(filePath, file, {
        cacheControl: "3600",
        upsert: false,
      });

    if (uploadError) {
      throw uploadError;
    }

    const { data: publicUrlData } = supabase.storage
      .from("avatars")
      .getPublicUrl(filePath);
    
    return publicUrlData.publicUrl;
  };

  const onSubmit = async (values: ProfileFormValues) => {
    if (!userId) return;
    setLoading(true);

    try {
      let newAvatarUrl = avatarUrl;

      if (avatarFile) {
        // Delete old avatar if it exists and is from Supabase Storage
        if (avatarUrl && avatarUrl.includes(supabase.storage.from("avatars").getPublicUrl("").data.publicUrl)) {
          const oldFileName = avatarUrl.split("/").pop();
          if (oldFileName) {
            await supabase.storage.from("avatars").remove([`avatars/${oldFileName}`]);
          }
        }
        newAvatarUrl = await uploadAvatar(avatarFile, userId);
      }

      const { error } = await supabase
        .from("profiles")
        .update({
          nome: values.nome,
          cidade: values.cidade,
          curiosidade: values.curiosidade,
          avatar_url: newAvatarUrl,
        })
        .eq("id", userId);

      if (error) throw error;

      toast.success("Perfil atualizado com sucesso!");
      navigate("/");
    } catch (error: any) {
      toast.error(error.message || "Erro ao atualizar perfil");
      console.error("Erro ao atualizar perfil:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-pulse text-muted-foreground">Carregando...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/30">
      <header className="bg-card border-b border-border/50 shadow-sm px-4 py-4 flex items-center gap-3">
        <Button variant="ghost" size="icon" onClick={() => navigate("/")}>
          <ArrowLeft className="w-5 h-5" />
        </Button>
        <h1 className="text-xl font-bold">Editar Perfil</h1>
      </header>

      <main className="max-w-2xl mx-auto px-4 py-6">
        <Card className="p-6">
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="flex flex-col items-center gap-4">
              <Avatar className="w-24 h-24 border-4 border-primary/20">
                {avatarUrl ? (
                  <AvatarImage src={avatarUrl} alt="Avatar" />
                ) : (
                  <AvatarFallback className="bg-primary/10 text-primary text-3xl font-semibold">
                    <User className="w-12 h-12" />
                  </AvatarFallback>
                )}
              </Avatar>
              <Label htmlFor="avatar-upload" className="cursor-pointer">
                <Input
                  id="avatar-upload"
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleAvatarChange}
                />
                <Button type="button" variant="outline" asChild>
                  <span>
                    <Upload className="w-4 h-4 mr-2" />
                    Alterar foto
                  </span>
                </Button>
              </Label>
            </div>

            <div className="space-y-2">
              <Label htmlFor="nome">Nome completo *</Label>
              <Input
                id="nome"
                type="text"
                placeholder="Seu nome"
                {...form.register("nome")}
                className="transition-all focus:ring-2 focus:ring-primary/20"
              />
              {form.formState.errors.nome && (
                <p className="text-destructive text-sm">{form.formState.errors.nome.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="cidade">Cidade</Label>
              <Input
                id="cidade"
                type="text"
                placeholder="Sua cidade"
                {...form.register("cidade")}
                className="transition-all focus:ring-2 focus:ring-primary/20"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="curiosidade">Uma curiosidade sobre você</Label>
              <Textarea
                id="curiosidade"
                placeholder="Conte algo interessante sobre você..."
                {...form.register("curiosidade")}
                rows={4}
                className="transition-all focus:ring-2 focus:ring-primary/20"
              />
            </div>

            <div className="pt-4 space-y-3">
              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? "Salvando..." : "Salvar alterações"}
              </Button>
              <Button
                type="button"
                variant="outline"
                className="w-full"
                onClick={() => navigate("/")}
              >
                Cancelar
              </Button>
            </div>
          </form>
        </Card>
      </main>
    </div>
  );
};

export default ProfileEdit;
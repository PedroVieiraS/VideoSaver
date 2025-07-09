"use client"

import z from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import AppSidebar from "@/components/app-sidebar"
import { useForm } from "react-hook-form"
import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Card } from "@/components/ui/card"
import { useRouter } from "next/navigation"

const createVideoSchema = z.object({
  title: z.string().min(1, "Título obrigatório"),
  url: z.string().url("URL inválida"),
  minute: z.number().min(1, "Minutos obrigatórios"),
  category: z.object({
    type: z.string().min(1, "Tipo obrigatório"),
  }),
});

export default function Register() {
  const router = useRouter();

  const form = useForm<z.infer<typeof createVideoSchema>>({
    resolver: zodResolver(createVideoSchema),
    defaultValues: {
      title: "",
      url: "",
      minute: 1,
      category: {
        type: ""
      }
    }
  })

  async function onSubmit(values: z.infer<typeof createVideoSchema>) {
    console.log("test", values);
    try {
      const response = await fetch("http://localhost:3001/cadastrar_video", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values)
      });
      const result = await response.json().catch(() => null);
      console.log(result);
      if (!response.ok) throw new Error("Erro ao Salvar video")
      alert("Video Salvo")
      router.push("/");
    } catch (error) {
      alert("erro ao cadastrar")
      console.log("erro:", error)
    }
  }

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarTrigger />
      <main className="w-full h-min-screen">
        <div className="flex flex-col items-center justify-center w-full h-full">
          <Card className="p-5 w-100 h-120 overflow-hidden flex flex-col">
            <Form {...form}>
              <form 
                onSubmit={form.handleSubmit(onSubmit)} 
                className="h-full flex flex-col items-center text-center"
              >
                <FormLabel className="mb-5 text-3xl font-bold">Cadastrar Video</FormLabel>
                
                {/* Container com scroll para os campos */}
                <div className="flex-1 overflow-y-auto space-y-4 w-full px-2">
                  <FormField
                    control={form.control}
                    name="title"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="font-extrabold text-white">Digite o titulo do Video</FormLabel>
                        <FormControl>
                          <Input placeholder="Título" className="border-neutral-900 w-80 p-5 bg-black" {...field} />
                        </FormControl>
                        <FormMessage className="text-red-400 text-sm min-h-[1.25rem]" />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="url"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="font-extrabold text-white">Digite a Url</FormLabel>
                        <FormControl>
                          <Input placeholder="Url" className="border-neutral-900 w-80 p-5 bg-black" {...field} />
                        </FormControl>
                        <FormMessage className="text-red-400 text-sm min-h-[1.25rem]" />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="minute"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="font-extrabold text-white">Minutos</FormLabel>
                        <FormControl>
                          <Input 
                            type="number" 
                            className="border-neutral-900 w-80 p-5 bg-black"
                            {...field} 
                            onChange={e => field.onChange(Number(e.target.value))} 
                          />
                        </FormControl>
                        <FormMessage className="text-red-400 text-sm min-h-[1.25rem]" />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="category.type"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="font-extrabold text-white">Digite a descricao</FormLabel>
                        <FormControl>
                          <Input placeholder="Descricao" className="border-neutral-900 w-80 p-5 bg-black" {...field} />
                        </FormControl>
                        <FormMessage className="text-red-400 text-sm min-h-[1.25rem]" />
                      </FormItem>
                    )}
                  />
                </div>

                {/* Botão fixo na parte inferior */}
                <div className="mt-4 pb-2">
                  <Button type="submit" className="w-80 h-12 bg-neutral-800 hover:bg-neutral-700 text-white font-semibold rounded-lg">
                    Cadastrar Video
                  </Button>
                </div>
              </form>
            </Form>
          </Card>
        </div>
      </main>
    </SidebarProvider>
  )
}
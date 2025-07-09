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


const createVideoSchema = z.object({
  title: z.string().min(1, "Título obrigatório"),
  url: z.string().url("URL inválida"),
  minute: z.number().min(1, "Minutos obrigatórios"),
  category: z.object({
    type: z.string().min(1, "Tipo obrigatório"),
  }),
});


export default function Register() {

  const form = useForm<z.infer<typeof createVideoSchema>>({
    resolver: zodResolver(createVideoSchema),
    defaultValues: {
      title: "",
      url: "",
      minute:1,
      category: {
        type: ""
      }
    }
  })

  async function onSubmit(values: z.infer<typeof createVideoSchema>) {
    console.log("test",values);
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
          <Card className="p-5">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-3 flex flex-col items-center text-center">
            <FormLabel className="mb-5 text-3xl font-bold">Cadastrar Video</FormLabel>
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Digite o titulo do Video</FormLabel>
                    <FormControl>
                      <Input placeholder="Título" className="border-neutral-900 bg-black" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              {/* Aqui e a URL */}
              <FormField
                control={form.control}
                name="url"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel >Digite a Url</FormLabel>
                    <FormControl>
                      <Input placeholder="Url" className="border-neutral-900 bg-black" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              {/* Aqui sao os minutos */}
              <FormField
                control={form.control}
                name="minute"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel >Minutos</FormLabel>
                    <FormControl>
                      <Input 
                      type="number" 
                      className="border-neutral-900 bg-black" 
                      {...field} 
                      onChange={e => field.onChange(Number(e.target.value))} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              {/* Aqui e a descricao */}
              <FormField
                control={form.control}
                name="category.type"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel >Digite a descricao</FormLabel>
                    <FormControl>
                      <Input placeholder="Descricao" className="border-neutral-900 bg-black" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button type="submit">Enviar</Button>
            </form>
          </Form>
          </Card>
        </div>
      </main>
    </SidebarProvider>
  )
}


"use client"


import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import AppSidebar from "@/components/app-sidebar"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { useState } from "react"
import Link from "next/link"

interface Video {
  id: number;
  title: string;
  url: string;
}


export default function Search({ children }: { children: React.ReactNode }) {
  const [search, setSearch] = useState("");
  const [results, setResults] = useState<Video[]>([]);
  const [loading, setLoading] = useState(false);


  const handleSearch = async () => {
    setLoading(true);
    try {
      const response = await fetch(`http://localhost:3001/pesquisa?name=${search}`);
      const data = await response.json();
      setResults(data);
      console.log(data)
    } catch (error) {
      alert("Erro ao buscar vídeos");
      setResults([]);
    }
    setLoading(false);
  };




  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarTrigger />
      <main className="w-full h-min-screen">

        <div className="w-full h-full flex flex-col items-center mt-15">
          <h1 className="font-bold mb-5 text-2xl">Pesquisar Video</h1>
          <div className="flex justify-center items-center gap-2">
            <Input 
            className="w-100"
            value={search}
            onChange={e => setSearch(e.target.value)}
            />
            <Button 
            disabled={loading} 
            onClick={handleSearch}
            >
              {loading ? "Buscando..." : "Pesquisar"}
            </Button>
          </div>

          <div className="mt-8 w-full flex flex-col items-center">
            {results.length === 0 && !loading && (
              <span className="text-gray-400">Nenhum resultado encontrado</span>
            )}
            {results.map(video => (
              <div key={video.id} className="mb-4 p-4 border rounded w-full max-w-xl bg-neutral-900 text-white">
                <h2 className="font-bold text-lg">{video.title}</h2>
                <Link href={`/videos/${video.id}`} rel="noopener noreferrer" className="text-blue-400 underline">
                  Assistir
                </Link>
              </div>
            ))}
          </div>
        </div>
      </main>
    </SidebarProvider>
  )
}


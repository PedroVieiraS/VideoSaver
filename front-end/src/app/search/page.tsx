"use client"


import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import AppSidebar from "@/components/app-sidebar"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { useEffect, useState } from "react"
import Link from "next/link"
import CardVazio from "@/components/card_vazio"
import videos from "@/app/page"

interface Video {
  id: number;
  title: string;
  url: string;
  minute: number;
  category: {
      id: number;
      type: string;
  };
}


export default function Search() {
  const [search, setSearch] = useState("");
  const [results, setResults] = useState<Video[]>([]);
  const [loading, setLoading] = useState(false);

  const [videos, setVideos] = useState<Video[]>([]);

  useEffect(() => {
    const fetchVideos = async () => {
      let response = await fetch("http://localhost:3001/videos")
      let videos = await response.json()
      setVideos(videos)
    }
    fetchVideos();
  }, [])


  const handleSearch = async () => {
    setLoading(true);
    try {
      const response = await fetch(`http://localhost:3001/pesquisa?name=${search}`);
      const data = await response.json();
      setResults(data);
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
          
          {/* <div className="w-full max-w-xl mb-8">
            <h1 className="font-bold text-2xl text-left">Pesquisar Video</h1>
          </div> */}

          <div className="w-full max-w-xl mb-8">
            <div className="flex gap-2">
              <Input
                className="flex-1"
                value={search}
                onChange={e => setSearch(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleSearch()}
              />
              <Button
                disabled={loading}
                onClick={handleSearch}
              >
                {loading ? "Buscando..." : "Pesquisar"}
              </Button>
            </div>

          </div>

          <div className="mt-8 w-full flex flex-col items-center">
            {results.length === 0 && !loading && (
              // <span className="text-gray-400">Nenhum resultado encontrado</span>
              <CardVazio videos={videos}/>
            )}
            {/* {results.map(video => (
              <div key={video.id} className=" flex mb-4 p-4 justify-between items-center border rounded-xl w-full max-w-xl bg-neutral-900 text-white">
                <h2 className="font-bold text-lg">{video.title}</h2>
                <Button>
                  <Link href={`/videos/${video.id}`} rel="noopener noreferrer">
                    Assistir
                  </Link>
                </Button>
              </div>
            ))} */}
            <CardVazio videos={results}/>
          </div>
        </div>
      </main>
    </SidebarProvider>
  )
}


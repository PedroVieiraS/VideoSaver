"use client"

import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import  AppSidebar  from "@/components/app-sidebar"
import { useState, useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useParams } from "next/navigation";

interface Video {
  id: number;
  title: string;
  url: string;
  categories: {
    id: number;
    type: string;
  };
}


export default function Videos() {

  const params = useParams()
  const {id} = params;

  const [video, setVideo] = useState<Video| null>(null);

  useEffect(() => {
    const fetchVideo = async () => {
      let response = await fetch(`http://localhost:3001/video/${id}`)
      let data = await response.json()
      setVideo(data)
    }
    if (id) fetchVideo();
  }, [id])

  if (!video) {
    return <div className="text-white">Carregando...</div>
  }

  const getYoutubeId = (url: string) => {
    if (!url) return null;
    const regExp = /(?:youtube\.com\/(?:watch\?v=|embed\/)|youtu\.be\/)([\w\-]+)/;
    const match = url.match(regExp);
    return match ? match[1] : null;
  };
  const videoId = getYoutubeId(video.url);
  const embedUrl = videoId ? `https://www.youtube.com/embed/${videoId}` : null;

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarTrigger />
    <div className=" w-full min-h-screen flex flex-col items-center justify-center py-8">
      <div className="aspect-video w-full max-w-[90vw] md:max-w-2xl 2xl:max-w-5xl rounded-xl overflow-hidden bg-black shadow-lg">
        {embedUrl ? (
          <iframe
            className="w-full h-full"
            src={embedUrl}
            title={video.title}
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        ) : (
          <video className="w-full h-full" controls>
            <source src={video.url} type="video/mp4" />
            Seu navegador não suporta o elemento de vídeo.
          </video>
        )}
      </div>
      <h3 className="text-white text-center mt-6 text-2xl font-bold">{video.title}</h3>
    </div>
    </SidebarProvider>
  )
}
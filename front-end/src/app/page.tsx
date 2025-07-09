"use client"

import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import { CardVideos } from "@/components/cards_video"
import { useEffect, useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import  AppSidebar  from "@/components/app-sidebar";


interface Video {
  id: number;
  title: string;
  url: string;
  categories: {
    id: number;
    type: string;
  };
}

export default function Home() {

  const [videos, setVideos] = useState<Video[]>([]);

  useEffect(() => {
    const fetchVideos = async () => {
      let response = await fetch("http://localhost:3001/videos")
      let videos = await response.json()
      setVideos(videos)
    }
    fetchVideos();
  }, [])

  return (
    <>

      <SidebarProvider>
        <AppSidebar />
        <SidebarTrigger />
        {/* <main className=""> */}
        <div className="flex h-full w-full flex-col justify-center items-center">
          <div className=" w-full flex flex-col justify-center items-center">
            <h1 className="text-white text-5xl font-bold m-10">VideoSaver</h1>
          </div>
          <ul className="grid grid-cols-1 md:grid-cols-2 2xl:grid-cols-3 justify-center mb-0 ">
            {videos.map((video: Video) => (
              <li className=" m-2" key={video.id}>
                <CardVideos {...video} />
              </li>
            ))}
          </ul>
        </div>
        {/* </main> */}
      </SidebarProvider>
    </>
  )
}

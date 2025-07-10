"use client"

// React
import { useEffect, useState } from "react";

// Shadcn
import {
    Card,
    CardAction,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link";
import { Trash2 } from "lucide-react";
import { METHODS } from "http";
import { headers } from "next/headers";

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

interface CardVazioProps {
    videos: Video[];
}

export default function CardVazio({ videos }: CardVazioProps) {

    const [videospesq, setVideospesq] = useState<Video[]>([]);

    useEffect(() => {
        setVideospesq(videos);
    }, [videos]);

    const getYoutubeId = (url: string) => {
        if (!url) return null;
        const regExp = /(?:youtube\.com\/(?:watch\?v=|embed\/)|youtu\.be\/)([\w\-]+)/;
        const match = url.match(regExp);
        return match ? match[1] : null;
    }

    const handleDelete = async (id: number) => {
        await fetch(`http://localhost:3001/video/${id}`, {
            method: "DELETE",
            headers: { "Content-Type": "application/json" }
        })
        console.log("deletado", id)
    }


    return (
        <>
            <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 p-4 place-items-center">
                {videospesq.map((video, key) => {
                    const videoId = getYoutubeId(video.url);
                    const embedUrl = videoId ? `https://www.youtube.com/embed/${videoId}` : undefined;
                    return (
                        <li className="w-full max-w-sm p-1" key={video.id}>
                            <Card className="w-full min-h-[330px] max-h-[330px] max-w-3xl mx-auto">
                                <CardHeader className="text-center">
                                    {video.title.split(" ").slice(0, 4).join(" ")}{video.title.split(" ").length > 5}
                                </CardHeader>
                                <CardContent>
                                    <div className="flex justify-center w-full">
                                        <div
                                            className="
                                            aspect-video
                                            w-full
                                            max-w-[90vw]
                                            md:max-w-2xl
                                            2xl:max-w-5xl
                                            rounded-xl
                                            overflow-hidden
                                            bg-gray-200
                                            shadow-lg
                                            "
                                        />
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
                                </CardContent>
                                <CardFooter className="flex items-center justify-center gap-5">
                                    <Link href={`/videos/${video.id}`}>
                                        <Button variant="outline">
                                            Assistir
                                        </Button>
                                    </Link>
                                    <Button
                                        variant="outline"
                                        onClick={() => {
                                            handleDelete(video.id);
                                            setVideospesq((prev) => prev.filter((v) => v.id !== video.id));
                                        }}
                                    >
                                        <Trash2 className="w-8" />
                                    </Button>
                                </CardFooter>
                            </Card>
                        </li>
                    )
                })}
            </ul>
        </>
    );
}
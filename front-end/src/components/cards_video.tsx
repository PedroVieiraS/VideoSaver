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

interface Video {
    id: number;
    title: string;
    url: string;
    category: {
      id: number;
      type: string;
    };
  }

export function CardVideos({id, title, category, url}:Video) {

    const getYoutubeId = (url:string) => {
        if (!url) return null;
        const regExp = /(?:youtube\.com\/(?:watch\?v=|embed\/)|youtu\.be\/)([\w\-]+)/;
        const match = url.match(regExp);
        return match ? match[1] : null;
    }
    const videoId = getYoutubeId(url);
    const embedUrl = videoId ? `https://www.youtube.com/embed/${videoId}` : undefined;

    return (
        <Card className="w-full min-h-[330px] max-h-[330px] max-w-3xl mx-auto">
            <CardHeader title={title} className="text-center">
            {title.split(" ").slice(0, 6).join(" ")}{title.split(" ").length > 5}
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
                            bg-black
                            shadow-lg
                        "
                    >
                        {embedUrl ? (
                            <iframe
                                className="w-full h-full"
                                src={embedUrl}
                                title={title}
                                frameBorder="0"
                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                allowFullScreen
                            />
                        ) : (
                            <video className="w-full h-full" controls>
                                <source src={url} type="video/mp4" />
                                Seu navegador não suporta o elemento de vídeo.
                            </video>
                        )}
                    </div>
                </div>
            </CardContent>
            <CardFooter className=" flex flex-col gap-5">
                <Link href={`/videos/${id}`}>
                    <Button variant="outline">
                        Assistir
                    </Button>
                </Link>
            </CardFooter>
        </Card>
    )
}
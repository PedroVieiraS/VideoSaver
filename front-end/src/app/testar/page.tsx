"use client"

import CardNovo from "@/components/cardsnovos";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import Link from "next/link"
import CardVazio from "@/components/card_vazio";



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

export default function Testar() {

    const [search, setSearch] = useState("");
    const [results, setResults] = useState<Video[]>([]);
    const [loading, setLoading] = useState(false);

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
        <>
            <main className="w-full h-min-screen flex flex-col justify-center items-center">
                <div className="w-full max-w-xl mb-8 mt-10">
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
              <CardNovo />
            )}
            <CardVazio videos={results}/>
          </div>
            </main>
        </>
    )
}
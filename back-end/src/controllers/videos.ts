import { Request, Response, Router } from "express";
import { PrismaClient } from "../../generated/prisma";
import { title } from "process";

const prisma = new PrismaClient();

export const cadastrar_video = (req: Request, res: Response) => {
    (async () => {
        try {
            const { title, url, minute, category } = req.body;

            // Validações dos campos obrigatórios
            if (!title || !url || minute === undefined || !category?.type) {
                return res.status(400).json({
                    error: "Todos os campos são obrigatórios: title, url, minute, categories{type}"
                });
            }

            // Validação do título
            if (typeof title !== 'string' || title.trim().length === 0) {
                return res.status(400).json({
                    error: "O título deve ser uma string não vazia"
                });
            }

            // Validação da URL
            if (typeof url !== 'string' || url.trim().length === 0) {
                return res.status(400).json({
                    error: "A URL deve ser uma string não vazia"
                });
            }

            // Validação do minuto
            if (typeof minute !== 'number' || minute < 0) {
                return res.status(400).json({
                    error: "O minuto deve ser um número positivo"
                });
            }

            // Buscar ou criar a categoria
            let categoria = await prisma.category.findFirst({
                where: { type: category.type }
            });

            if (!categoria) {
                categoria = await prisma.category.create({
                    data: { type: category.type }
                });
            }

            // Criar o vídeo
            const video = await prisma.video.create({
                data: {
                    title: title.trim(),
                    url: url.trim(),
                    minute,
                    categoryId: categoria.id
                },
                include: {
                    categories: true
                }
            });

            return res.status(201).json({
                message: "Vídeo cadastrado com sucesso!",
                video
            });

        } catch (error) {
            console.error("Erro ao cadastrar vídeo:", error);
            return res.status(500).json({
                error: "Erro interno do servidor"
            });
        }
    })();
};

export const ver_videos = (req: Request, res: Response) => {
    (async () => {
        try {
            const videos = await prisma.video.findMany({
                include: {
                    categories: true
                }
            });
            return res.status(200).json(videos);
        } catch (error) {
            console.error("Erro ao buscar vídeos:", error);
            return res.status(500).json({
                error: "Erro interno do servidor"
            });
        }
    })();
};

export const find_video = (req: Request, res: Response) => {
    (async () => {
        try {
            const { id } = req.params

            const videoId = Number(id)

            const user = await prisma.video.findUnique({
                where: {
                    id: videoId
                }
                , include: {
                    categories: true
                }
            })
            return res.status(200).json(user)
        } catch (error) {
            console.log(error)
        }
    })()
}

export const find_video_name = (req: Request, res: Response) => {
    (async () => {
        try {
            const { name } = req.query;

            if (!name || typeof name !== "string") {
                return res.status(200).json([]); // ou talvez 400, se quiser exigir o nome
            }

            const videos = await prisma.video.findMany({
                where: {
                    title: {
                        contains: name, // opcional: ignora maiúsculas/minúsculas
                    },
                },
                include: {
                    categories: true,
                },
            });

            return res.status(200).json(videos);
        } catch (error) {
            console.log(error);
            return res.status(500).json({ error: "Erro interno do servidor." });
        }
    })();
};

export const deletar_video = (req: Request, res: Response) => {
    (async () => {
        try {
            const { id } = req.params;

            const videoId = Number(id);
            if (isNaN(videoId)) {
                return res.status(400).json({ error: "ID inválido." });
            }

            const video = await prisma.video.findUnique({
                where: { id: videoId }
            });

            if (!video) {
                return res.status(404).json({ error: "Vídeo não encontrado." });
            }

            await prisma.video.delete({
                where: { id: videoId }
            });

            return res.status(200).json({ message: "Vídeo deletado com sucesso." });

        } catch (error) {
            console.error("Erro ao deletar vídeo:", error);
            return res.status(500).json({ error: "Erro interno do servidor." });
        }
    })();
};

export const atualizar_video = (req: Request, res: Response) => {
    (async () => {
        try {
            const { id } = req.params;
            const { title, url, minute, category } = req.body;

            const videoId = Number(id);
            if (isNaN(videoId)) {
                return res.status(400).json({ error: "ID inválido." });
            }

            // Verificar se o vídeo existe
            const videoExistente = await prisma.video.findUnique({
                where: { id: videoId }
            });

            if (!videoExistente) {
                return res.status(404).json({ error: "Vídeo não encontrado." });
            }

            // Preparar dados para atualização
            const dadosAtualizacao: any = {};

            // Validar e adicionar título se fornecido
            if (title !== undefined) {
                if (typeof title !== 'string' || title.trim().length === 0) {
                    return res.status(400).json({
                        error: "O título deve ser uma string não vazia"
                    });
                }
                dadosAtualizacao.title = title.trim();
            }

            // Validar e adicionar URL se fornecida
            if (url !== undefined) {
                if (typeof url !== 'string' || url.trim().length === 0) {
                    return res.status(400).json({
                        error: "A URL deve ser uma string não vazia"
                    });
                }
                dadosAtualizacao.url = url.trim();
            }

            // Validar e adicionar minuto se fornecido
            if (minute !== undefined) {
                if (typeof minute !== 'number' || minute < 0) {
                    return res.status(400).json({
                        error: "O minuto deve ser um número positivo"
                    });
                }
                dadosAtualizacao.minute = minute;
            }

            // Validar e atualizar categoria se fornecida
            if (category?.type !== undefined) {
                let categoria = await prisma.category.findFirst({
                    where: { type: category.type }
                });

                if (!categoria) {
                    categoria = await prisma.category.create({
                        data: { type: category.type }
                    });
                }

                dadosAtualizacao.categoryId = categoria.id;
            }

            // Atualizar o vídeo
            const videoAtualizado = await prisma.video.update({
                where: { id: videoId },
                data: dadosAtualizacao,
                include: {
                    categories: true
                }
            });

            return res.status(200).json({
                message: "Vídeo atualizado com sucesso!",
                video: videoAtualizado
            });

        } catch (error) {
            console.error("Erro ao atualizar vídeo:", error);
            return res.status(500).json({ error: "Erro interno do servidor." });
        }
    })();
};

export const find_categorias = (req:Request,res:Response) =>{
    (async()=>{
        try {
            // const id = req.params
            // const categoryId = Number(id)

            const category = await prisma.category.findMany()
            res.status(200).json(category)
        } catch (error) {
            console.error(error)
        }
    })()
}


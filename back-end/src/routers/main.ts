import { Router } from "express";
import * as pingControler from "../controllers/ping";
import { cadastrar_video, deletar_video, ver_videos, atualizar_video, find_video, find_categorias, find_video_name } from "../controllers/videos";

export const mainRouter: Router = Router();

mainRouter.get('/ping', pingControler.ping);

// Videos

mainRouter.post("/cadastrar_video", cadastrar_video);

mainRouter.get("/videos",ver_videos)
mainRouter.get("/video/:id", find_video)
mainRouter.get("/pesquisa", find_video_name)

mainRouter.put("/video/:id", atualizar_video)

mainRouter.delete("/video/:id", deletar_video)

// Categorias
mainRouter.get("/categorias", find_categorias)

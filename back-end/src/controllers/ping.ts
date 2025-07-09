import { Response, Request } from "express"


export const ping = (req:Request, res:Response) =>{
    res.json({pong:true})
}
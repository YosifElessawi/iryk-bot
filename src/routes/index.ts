import { Router, Request, Response } from "express"
import { getWebHook, postWebHook } from "../controllers/chatbotcontroller"
let router = Router()

router.get("/", (_req: Request, res: Response) => {
  res.send("Main api route")
})
router.get("/webhook", getWebHook)
router.post("/webhook", postWebHook)
export default router

import { Router, json } from "express";
import userRouter from "./user";

const router = Router();
router.use(json());
router.use("/user", userRouter);
router.get("/", (req, res) => res.send("Hello World!"));
export default router;

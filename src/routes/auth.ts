import { Router } from "express";

const router = Router();

router.post("/login", async (req, res) => {
  const { username, password } = req.body;
});

export default router;

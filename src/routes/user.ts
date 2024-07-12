import { Router } from "express";
import zodValidate from "../helpers/zodValidateMiddleware";
import databasePromise from "../database";
import z from "zod";

const router = Router();

const validate = zodValidate(
  z.object({
    body: z
      .object({
        username: z.string(),
        password: z.string(),
      })
      .strict(),
  })
);

const validatePagination = zodValidate(
  z.object({
    query: z.object({
      page: z.string().optional(),
      rowsPerPage: z.string().optional(),
    }),
  })
);

router.get("/", validatePagination, async (req, res) => {
  const database = await databasePromise;
  if ("page" in req.query) {
    const page = parseInt(req.query.page as string);
    const rowsPerPage = (parseInt(req.query.rowsPerPage as string) ?? 50) % 51;
    const users = await database.all("SELECT * FROM users LIMIT ? OFFSET ?", [
      rowsPerPage,
      (page - 1) * rowsPerPage,
    ]);
    return res.json(users);
  }
  const users = await database.all("SELECT * FROM users");
  return res.json(users);
});

router.get("/:id", async (req, res) => {
  const database = await databasePromise;
  const user = await database.get("SELECT * FROM users WHERE id = ?", [
    req.params.id,
  ]);
  return res.json(user);
});

router.post("/", validate, async (req, res) => {
  try {
    const database = await databasePromise;
    await database.run("INSERT INTO users (username, password) VALUES (?, ?)", [
      req.body.username,
      req.body.password,
    ]);
    return res.json({ message: "User created" });
  } catch (error: any) {
    if (error.code === "SQLITE_CONSTRAINT") {
      return res.status(400).json({ message: "User already exists" });
    }
    return res.status(500).json({ message: "Internal server error" });
  }
});

router.put("/:id", validate, async (req, res) => {
  try {
    const database = await databasePromise;
    await database.run(
      "UPDATE users SET username=:username, password=:password WHERE id=:id ",
      {
        ":username": req.body.username,
        ":password": req.body.password,
        ":id": req.params.id,
      }
    );
    return res.json({ message: "User updated" });
  } catch (error: any) {
    console.log(error);
    if (error.code === "SQLITE_CONSTRAINT")
      return res.status(400).json({ message: "User already exists" });
    return res.status(500).json({ message: "Internal server error" });
  }
});

router.delete("/:id", async (req, res) => {
  const database = await databasePromise;
  await database.run("DELETE FROM users WHERE id = ?", [req.params.id]);
  return res.json({ message: "User deleted" });
});

export default router;

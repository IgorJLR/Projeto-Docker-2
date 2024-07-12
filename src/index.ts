import "dotenv/config";
import "./database";
import express from "express";
import router from "./routes";

const envsNames = ["JWT_SECRET", "PORT"];
const notFoundEnvs = envsNames.filter((e: string) => !process.env[e]);

if (notFoundEnvs.length) {
  console.error(`Missing environment variables: ${notFoundEnvs.join(", ")}`);
  process.exit(1);
}

const app = express();
const PORT = process.env.PORT || 3000;
app.use(router);
app.listen(PORT, () => console.log(`🔥 Servidor rodando na porta ${PORT}`));

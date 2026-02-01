import express from "express";
import { PrismaClient } from "@prisma/client";

const port = 3000;
const app = express();
const prisma = new PrismaClient();

app.get("/", async (req, res) => {
  const movies = await prisma.movie.findMany({
    orderBy: {
      title: "asc",
    },
    include: {
      genres: true,
      languages: true,
    },
  });
  res.json(movies);
});

app.get("/movies", (_, res) => {
  res.send("Listagem de filmes");
});

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
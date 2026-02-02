import express from "express";
import { PrismaClient } from "@prisma/client";

const port = 3000;
const app = express();
const prisma = new PrismaClient();

app.use(express.json());

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

app.post("/movies", async (req, res) => {

  const { title, genre_id, language_id, oscar_count, release_date } = req.body;

  try {

    // Verificar no banco se já existe um filme com o mesmo título

    const moviewithSameTitle = await prisma.movie.findFirst({
      where: { title: { equals: title, mode: "insensitive" } },
    });

    if (moviewithSameTitle) {
      return res.status(409).send({ message: "Já existe um filme cadastrado com esse título" });
    }

  await prisma.movie.create({
    data: {
      title,
      genre_id,
      language_id,
      oscar_count,
      release_date: new Date(release_date)
    },
  });
  } catch (error) {
    return res.status(500).send({ message: "Falha ao cadastrar um filme" });
  }

  res.status(201).send();
});

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
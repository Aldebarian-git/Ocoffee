// Importer les variables d'environnement
import "dotenv/config";

// Importer les dépendances
import express from "express";
import router from "./router.js";
import session from 'express-session';
import { RedisStore } from 'connect-redis';
import { createClient } from 'redis';

// Créer une app
const app = express();

async function startServer() {
  // Création du client Redis
  const redisClient = createClient({ url: process.env.REDIS_URL });

  redisClient.on('error', (err) => console.error('Redis Error:', err));

  await redisClient.connect();

  const redisStore = new RedisStore({
    client: redisClient,
    disableTouch: true,
  });

  app.use(
    session({
      store: redisStore,
      secret: process.env.SESSION_SECRET,
      resave: false,
      saveUninitialized: false,
      cookie: { secure: false, httpOnly: true, maxAge: 1000 * 60 * 60 * 24 },
    })
  );

  // Configurer le moteur de rendu (EJS)
  app.set("view engine", "ejs");
  app.set("views", "views");

  // Configurer un dossier d'assets statiques
  app.use(express.static("public"));

  // Ajout d'un body parser
  app.use(express.urlencoded({ extended: true }));

  // Brancher le routeur
  app.use(router);

  // Lancer un serveur
  const port = process.env.PORT || 3000;
  app.listen(port, () => {
    console.log(`Server started at http://localhost:${port}`);
  });
}

// Lancer l'application
startServer().catch((err) => {
  console.error("Error starting server:", err);
});


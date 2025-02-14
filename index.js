// Importer les variables d'environnement
import "dotenv/config";

// Importer les dépendances
import express from "express";
import router from "./router.js";
import session from "express-session";
import { RedisStore } from "connect-redis";
import { createClient } from "redis";
import { createAdmin } from "./utils/createAdmin.js";

// Créer une app
const app = express();

async function startServer() {
  let sessionMiddleware;

  if (process.env.NODE_ENV === "production") {
    // Création du client Redis en production
    const redisClient = createClient({ url: process.env.REDIS_URL });

    redisClient.on("error", (err) => console.error("Redis Error:", err));

    await redisClient.connect();

    const redisStore = new RedisStore({
      client: redisClient,
      disableTouch: true,
    });

    sessionMiddleware = session({
      store: redisStore,
      secret: process.env.SESSION_SECRET,
      resave: false,
      saveUninitialized: false,
      cookie: { secure: true, httpOnly: true, maxAge: 1000 * 60 * 60 * 24 },
    });
  } else {
    // Utilisation de la session Express classique en développement
    sessionMiddleware = session({
      secret: process.env.SESSION_SECRET,
      resave: false,
      saveUninitialized: false,
      cookie: { secure: false, httpOnly: true, maxAge: 1000 * 60 * 60 * 24 },
    });
  }

  app.use(sessionMiddleware);

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

// Exemple d'appel de la fonction
createAdmin("Admin", "admin");

// Lancer l'application
startServer().catch((err) => {
  console.error("Error starting server:", err);
});



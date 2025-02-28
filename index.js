// Importer les variables d'environnement
import "dotenv/config";

// Importer les dépendances
import express from "express";
import router from "./router.js";
import session from "express-session";
import { RedisStore } from "connect-redis";
import { createClient } from "redis";
import path from "path"; // Import correct du module path

// import { createAdmin } from "./utils/createAdmin.js";

// Créer une app
const app = express();
app.set("trust proxy", 1);

async function startServer() {
  let sessionMiddleware;

  if (process.env.NODE_ENV === "production") {
    // Création du client Redis en production
    const redisClient = createClient({ url: process.env.REDIS_URL });
    redisClient.on("error", (err) => console.error("Redis Error:", err));
    redisClient.on("connect", () => console.log("Connected to Redis"));

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

  // Serve les fichiers d'images depuis /mnt/data/coffees
  app.use("/coffeesUp", express.static(path.join("/mnt/data", "coffeesUp")));

  // Ajout d'un body parser
  app.use(express.urlencoded({ extended: true }));

  app.use((req, res, next) => {
    res.locals.admin = req.session.isAdmin || false;
    next();
  });

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

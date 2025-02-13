// Importer les variables d'environnement
// ⚠️ au début du fichier, AVANT les autres imports ⚠️
import "dotenv/config";

// Importer les dépendances
import express from "express";
import router from "./router.js";
import session from 'express-session';
import redis from 'redis';
import { default as connectRedis } from 'connect-redis';


// Créer une app
const app = express();

// Connexion à Redis via les variables d'environnement de Railway
const redisClient = redis.createClient({
  host: process.env.REDIS_HOST,
  port: process.env.REDIS_PORT || 6379,
  password: process.env.REDIS_PASSWORD,
});

// Configurer Redis Store pour les sessions
const RedisStore = connectRedis(session);

// Utiliser les sessions avec Redis Store
app.use(session({
  store: new RedisStore({ client: redisClient }),
  secret: process.env.SESSION_SECRET || 'your-secret-key',
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: process.env.NODE_ENV === 'production',
    httpOnly: true,
    maxAge: 1000 * 60 * 60 * 24, // Durée de vie du cookie (1 jour)
  },
}));

// Configurer le moteur de rendu (EJS)
app.set("view engine", "ejs"); // choix du view engine
app.set("views", "views"); // préciser la localisation du dossier "views"

// Configurer un dossier d'assets statiques
// Permet de rendre accessible via leur chemin de fichier tous les fichiers présents dans le dossier "public".
app.use(express.static("public"));

// Ajout d'un body parser (avant le router)
app.use(express.urlencoded({ extended: true })); // permet de récupérer les données du PAYLOAD des <form> et les ajouter à req.body

// Brancher le routeur
app.use(router);

// Lancer un serveur
const port = process.env.PORT || 3000; // Fallback (valeur par défaut) au cas où le .env ne serait pas défini
app.listen(port, () => {
  console.log(`Server started at http://localhost:${port}`);
});

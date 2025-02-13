// Importer les variables d'environnement
// ⚠️ au début du fichier, AVANT les autres imports ⚠️
import "dotenv/config";

// Importer les dépendances
import express from "express";
import router from "./router.js";
import session from "express-session";

import { createClient } from "redis";
import connectRedis from "connect-redis";

// Créer un client Redis
const redisClient = createClient({
  url: process.env.REDIS_URL // Assurez-vous que REDIS_URL est bien défini dans vos variables d'environnement
});

// Gérer les erreurs de connexion Redis
redisClient.on('error', (err) => console.log('Redis Client Error', err));
await redisClient.connect(); // Assurez-vous que la connexion est bien établie

// Initialiser RedisStore
const RedisStore = connectRedis(session); // Utiliser directement connectRedis avec session



// Créer une app
const app = express();

app.use(
  session({
    store: new RedisStore({ client: redisClient }), // Utilisation de RedisStore avec le client Redis
    secret: process.env.SESSION_SECRET, // Assurez-vous que SESSION_SECRET est bien défini
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: process.env.NODE_ENV === "production", // Assurez-vous que les cookies sont sécurisés en production
      httpOnly: true,
      maxAge: 1000 * 60 * 60 * 24 * 7 // Exemple : 1 semaine
    },
  })
);

console.log("Session middleware chargé");

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

// Importer les variables d'environnement
// ⚠️ au début du fichier, AVANT les autres imports ⚠️
import "dotenv/config";

// Importer les dépendances
import express from "express";
import router from "./router.js";
import session from 'express-session';
import redis from 'redis';
import connectRedis from 'connect-redis';


// Créer une app
const app = express();

// Créer un client Redis
const redisClient = redis.createClient({
  host: 'localhost', // Host de Redis (ajuste si nécessaire)
  port: 6379, // Port de Redis (le port par défaut est 6379)
});

// Configurer Redis Store pour les sessions
const RedisStore = connectRedis(session);

// Utiliser les sessions avec Redis Store
app.use(session({
  store: new RedisStore({ client: redisClient }), // Utiliser le client Redis pour le store
  secret: 'your-secret-key', // Clé secrète pour signer les sessions
  resave: false, // Ne pas resauvegarder la session si elle n'a pas changé
  saveUninitialized: false, // Ne pas sauvegarder les sessions non initialisées
  cookie: {
    secure: false, // Définir à `true` si vous utilisez HTTPS (en production)
    httpOnly: true, // Ne pas rendre le cookie accessible via JavaScript
    maxAge: 1000 * 60 * 60 * 24, // Durée de vie du cookie (par exemple 1 jour)
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

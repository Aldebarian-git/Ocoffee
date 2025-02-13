// Importer les variables d'environnement
// ⚠️ au début du fichier, AVANT les autres imports ⚠️
import "dotenv/config";



// Importer les dépendances
import express from "express";
import path from "node:path";
import router from "./router.js";
import session from "express-session";


// Créer une app
const app = express();

app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
    cookie: {
      secure: false,
      maxAge: 24 * 60 * 60 * 1000,
    },
  })
);

// Configurer le moteur de rendu (EJS)
app.set("view engine", "ejs"); // choix du view engine
app.set("views", "views"); // préciser la localisation du dossier "views"

// Configurer un dossier d'assets statiques
// Permet de rendre accessible via leur chemin de fichier tous les fichiers présents dans le dossier "public".
app.use(express.static( "public"));

// Ajout d'un body parser (avant le router)
app.use(express.urlencoded({ extended: true })); // permet de récupérer les données du PAYLOAD des <form> et les ajouter à req.body

// Brancher le routeur
app.use(router);



// Lancer un serveur
const port = process.env.PORT || 3000; // Fallback (valeur par défaut) au cas où le .env ne serait pas défini
app.listen(port, () => {
  console.log(`Server started at http://localhost:${port}`);
});

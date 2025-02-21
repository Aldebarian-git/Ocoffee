import multer from "multer";
import path from "node:path";
import fs from "fs";

// Configuration Multer pour stocker les images dans le volume Railway
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    // Vérifie si on est en environnement de production
    const isProduction = process.env.NODE_ENV === "production";
    console.log(isProduction);

    let dir;

    if (isProduction) {
      // Enregistre dans le volume monté à /mnt/data/coffees
      dir = path.join("/mnt/assets", "coffees");
    } else {
      // En développement, enregistre dans public/assets/coffees
      dir = path.join(process.cwd(), "public", "assets", "coffees");
    }

    // Vérifie si le dossier existe, sinon le crée
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }

    cb(null, dir); // Répertoire de destination
  },
  filename: (req, file, cb) => {
    if (!req.body.reference) {
      return cb(
        new Error(
          "Le champ 'reference' est obligatoire pour nommer le fichier."
        )
      );
    }

    const fileName = `${req.body.reference}.png`;

    cb(null, fileName); // Nom du fichier
  },
});

const upload = multer({ storage });

export default upload;

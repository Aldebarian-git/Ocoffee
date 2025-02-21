import multer from "multer";
import path from "node:path";
import fs from "fs";

// Configuration Multer (unique et globale)
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const dir = path.join(process.cwd(), "public", "assets", "coffees");

    // Vérifie si le dossier existe, sinon le crée
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }

    cb(null, dir); // Répertoire de destination
  },
  filename: (req, file, cb) => {
    if (!req.body.reference) {
      return cb(
        new Error("Le champ 'reference' est obligatoire pour nommer le fichier.")
      );
    }

    const fileName = `${req.body.reference}.png`;
    const filePath = path.join(process.cwd(), "public", "assets", "coffees", fileName);

    // Vérifie si le fichier existe déjà et le supprime avant d'enregistrer le nouveau
    if (fs.existsSync(filePath)) {
      fs.unlink(filePath, (err) => {
        if (err) {
          console.error("Erreur lors de la suppression du fichier existant :", err);
          return cb(new Error("Erreur lors du remplacement du fichier."));
        }
        cb(null, fileName); // Continue avec le même nom après suppression
      });
    } else {
      cb(null, fileName); // Enregistre directement si le fichier n'existe pas
    }
  },
});

const upload = multer({ storage });

export default upload;


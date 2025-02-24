import bcrypt from "bcrypt";
import client from "./database-client.js"; 


async function hashPassword(plainPassword) {
  const saltRounds = 10;
  return await bcrypt.hash(plainPassword, saltRounds);
}

async function updateAdminPasswords() {
  try {
    const admins = await client.query('SELECT * FROM "admins"');

    for (const admin of admins.rows) {
      // Vérifier si le mot de passe est déjà hashé
      if (admin.password.startsWith("$2b$")) {
        console.log(`Le mot de passe de ${admin.username} est déjà hashé.`);
        continue;
      }

      const hashedPassword = await hashPassword(admin.password);

      await client.query('UPDATE "admins" SET "password" = $1 WHERE "id" = $2', [
        hashedPassword,
        admin.id,
      ]);

      console.log(`Mot de passe hashé pour l'admin ${admin.username}`);
    }

    console.log("Tous les mots de passe ont été hashés !");
  } catch (error) {
    console.error("Erreur lors du hash des mots de passe :", error);
  } finally {
    client.end(); // Ferme la connexion à la BDD
  }
}

updateAdminPasswords();

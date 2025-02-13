import pkg from 'pg';
import bcrypt from 'bcrypt';

const { Client } = pkg;

// Configuration de la connexion à PostgreSQL (sur Railway)
const client = new Client({
  connectionString: process.env.PG_URL,
  ssl: {
    rejectUnauthorized: false
  }
});

// Connexion à la base de données (à ne faire qu'une fois)
await client.connect();

// Fonction pour hasher le mot de passe
const hashPassword = async (password) => {
  const saltRounds = 10; // Nombre de rounds pour le salage
  return await bcrypt.hash(password, saltRounds);
};

// Fonction pour créer un admin avec un mot de passe hashé
export const createAdmin = async (username, password) => {
  try {
    // Vérifier si l'admin existe déjà
    const checkQuery = 'SELECT * FROM "admins" WHERE username = $1';
    const existingAdmin = await client.query(checkQuery, [username]);

    if (existingAdmin.rows.length > 0) {
      console.log("Cet admin existe déjà !");
      return;
    }

    // Hashage du mot de passe
    const hashedPassword = await hashPassword(password);

    // Insérer l'utilisateur avec le mot de passe hashé
    const query = 'INSERT INTO "admins" ("username", "password") VALUES ($1, $2)';
    const values = [username, hashedPassword];

    await client.query(query, values);
    console.log("Admin créé avec succès !");
  } catch (error) {
    console.error("Erreur lors de la création de l'admin", error);
  }
};

// Fermer la connexion proprement à la fin du programme
process.on('exit', async () => {
  await client.end();
  console.log("Connexion à la base de données fermée.");
});



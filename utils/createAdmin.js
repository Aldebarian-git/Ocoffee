// createAdmin.js

import pkg from 'pg';
const { Client } = pkg;


// Configuration de la connexion à PostgreSQL (sur Railway)
const client = new Client({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false
  }
});

// Fonction pour hasher le mot de passe
const hashPassword = async (password) => {
  const saltRounds = 10; // Le nombre de rounds de salage
  const hashedPassword = await bcrypt.hash(password, saltRounds);
  return hashedPassword;
};

// Fonction pour créer un admin avec un mot de passe hashé
export const createAdmin = async (username, password) => {
  try {
    await client.connect();
    
    // Hashage du mot de passe
    const hashedPassword = await hashPassword(password);

    // Insérer l'utilisateur avec le mot de passe hashé
    const query = 'INSERT INTO "admins" ("username", "password") VALUES ($1, $2)';
    const values = [username, hashedPassword];

    await client.query(query, values);
    console.log("Admin créé avec succès !");
  } catch (error) {
    console.error("Erreur lors de la création de l'admin", error);
  } finally {
    await client.end();
  }
};

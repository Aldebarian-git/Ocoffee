// Charge les variables d'environnement
import "dotenv/config";

// Import du module PG
import pg from "pg";

// L'URL de la base de données
// PROTOCOL://USER:PASSWORD@HOST:PORT/BDD

// Créer un client de connexion (tunnel) vers notre base de données PostgreSQL
const client = new pg.Client({
  connectionString: process.env.PG_URL,
  // Définir explicitement l'encodage
  client_encoding: "UTF8",
  ssl: false, // Désactiver SSL ici
});

// Ouvrir la connexion
client.connect();

// Test manuel
// console.log(await client.query(`SELECT * FROM "coffees"`));

// Exporter cette connexion, pour s'en servir dans d'autres fichiers
export default client;

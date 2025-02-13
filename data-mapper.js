import client from "./database-client.js";
import bcrypt from "bcrypt";

const dataMapper = {
  async getAllCoffees() {
    const result = await client.query(
      `
        SELECT coffees.*, categories.name AS category 
        FROM "coffees" 
        JOIN "categories" ON coffees.category_id = categories.id
      `
    );
    const coffees = result.rows;

    return coffees;
  },
  async getCategoryNameById(id) {
    const result = await client.query(
      `
      SELECT categories.name 
      FROM "coffees" 
      JOIN "categories" ON coffees.category_id = categories.id
      WHERE coffees.id = $1
      `,
      [id]
    );

    // Vérifier si un résultat a été trouvé
    if (result.rows.length > 0) {
      return result.rows[0].name; // Récupérer le nom de la catégorie
    } else {
      return null; // Si aucun résultat n'est trouvé
    }
  },
  async getCoffeesByNameOrRef(searchterm) {
    const result = await client.query(
      `
        SELECT * 
        FROM "coffees" 
        WHERE "reference" ILIKE $1
        OR "name" ILIKE $1
      `,
      [`%${searchterm}%`]
    );
    const coffees = result.rows;
    console.log(coffees);

    return coffees;
  },

  async getLastCoffees() {
    const result = await client.query(
      `
        SELECT * FROM "coffees" LIMIT 3
      `
    );
    const coffees = result.rows;
    return coffees;
  },
  async getOneCoffeeById(id) {
    const result = await client.query(
      `
        SELECT * FROM "coffees" WHERE id = $1`,
      [id]
    );
    const coffee = result.rows[0];
    return coffee;
  },

  async addCoffeeToDatabase(newCoffeeData) {
    // Vérifications des données
    if (
      !newCoffeeData ||
      !newCoffeeData.category ||
      !newCoffeeData.name ||
      !newCoffeeData.description ||
      !newCoffeeData.reference ||
      !newCoffeeData.origin ||
      !newCoffeeData.price_per_kg ||
      !newCoffeeData.available
    ) {
      console.error("Erreur : Données manquantes dans newCoffeeData.");
      return;
    }

    // Ajout ou mise à jour de la catégorie
    await client.query(
      'INSERT INTO "categories" ("name") VALUES ($1) ON CONFLICT ("name") DO NOTHING',
      [newCoffeeData.category]
    );

    // Récupère l'ID de la catégorie, qu'elle soit nouvelle ou existante
    const { rows } = await client.query(
      'SELECT id FROM "categories" WHERE "name" = $1',
      [newCoffeeData.category]
    );

    // Vérification si la catégorie a bien été récupérée
    if (rows.length === 0) {
      console.error("Erreur : Catégorie introuvable après insertion.");
      return;
    }

    // On assigne l'ID de la catégorie à newCoffeeData
    newCoffeeData.category_id = rows[0]?.id;

    // Supprime la propriété 'category' de newCoffeeData
    delete newCoffeeData.category;

    // Ajout du café à la base de données
    await client.query(
      'INSERT INTO "coffees" ("name", "description","reference","origin","price_per_kg", "available", "category_id") VALUES ($1,$2,$3,$4,$5,$6,$7)',
      [
        newCoffeeData.name,
        newCoffeeData.description,
        newCoffeeData.reference,
        newCoffeeData.origin,
        newCoffeeData.price_per_kg,
        newCoffeeData.available,
        newCoffeeData.category_id,
      ]
    );

    // Console log final pour afficher la catégorie et le café ajoutés
    console.log("Catégorie ajoutée : ", rows[0]?.name);
    console.log("Café ajouté : ", {
      name: newCoffeeData.name,
      description: newCoffeeData.description,
      reference: newCoffeeData.reference,
      origin: newCoffeeData.origin,
      price_per_kg: newCoffeeData.price_per_kg,
      available: newCoffeeData.available,
      category_id: newCoffeeData.category_id,
    });
  },

  async deleteCoffeeToDatabase(reference) {
    const insertQuery = 'DELETE FROM "coffees" WHERE "reference" = $1';
    const values = [reference];

    try {
      const result = await client.query(insertQuery, values);
      console.log(`${result.rowCount} café(s) supprimé(s)`); // Affiche le nombre de lignes supprimées
      return result.rowCount; // Renvoie simplement le nombre de lignes supprimées
    } catch (error) {
      console.error("Erreur lors de la suppression du café:", error);
    }
  },
  async isAdmin({ username, password }) {
    const query = 'SELECT * FROM "admins" WHERE "username" = $1';
    const values = [username];
  
    try {
      const result = await client.query(query, values);
  
      if (result.rowCount === 0) {
        // Aucun admin trouvé avec ce username
        console.log("Aucun admin trouvé avec ce username");
        return false;
      }
  
      const admin = result.rows[0];
  
      // Affichage du mot de passe stocké dans la base de données pour débogage
      console.log("Mot de passe stocké : ", admin.password);
  
      // Vérification du mot de passe hashé
      const passwordMatch = await bcrypt.compare(password, admin.password);
  
      if (passwordMatch) {
        console.log("Mot de passe correct");
        return true;
      } else {
        console.log("Mot de passe incorrect");
        return false;
      }
    } catch (error) {
      console.error("Erreur lors de la recherche dans la base de données", error);
      return false; // En cas d'erreur, retourne false
    }
  },
  

  async editCoffeeToDatabase(editCoffeeData, coffeeId) {
    try {
      // Ajout ou mise à jour de la catégorie
      await client.query(
        'INSERT INTO "categories" ("name") VALUES ($1) ON CONFLICT ("name") DO NOTHING',
        [editCoffeeData.category]
      );

      // Récupère l'ID de la catégorie, qu'elle soit nouvelle ou existante
      const { rows } = await client.query(
        'SELECT id FROM "categories" WHERE "name" = $1',
        [editCoffeeData.category]
      );

      // Vérification si la catégorie a bien été récupérée
      if (rows.length === 0) {
        console.error("Erreur : Catégorie introuvable après insertion.");
        return;
      }

      // On assigne l'ID de la catégorie à newCoffeeData
      editCoffeeData.category_id = rows[0]?.id;

      // Supprime la propriété 'category' de newCoffeeData
      delete editCoffeeData.category;
      

      const result = await client.query(
        'UPDATE "coffees" SET "name" = $1, "description" = $2, "reference" = $3, "origin" = $4, "price_per_kg" = $5, "available" = $6, "category_id" = $7 WHERE "id" = $8 RETURNING *',
        [
          editCoffeeData.name,
          editCoffeeData.description,
          editCoffeeData.reference,
          editCoffeeData.origin,
          editCoffeeData.price_per_kg,
          editCoffeeData.available,
          editCoffeeData.category_id,
          coffeeId, // Utilisation de l'ID du café pour la mise à jour
        ]
      );

      // Si la mise à jour réussit, on affiche les informations du café mis à jour
      console.log("Café mis à jour : ", result.rows[0]);
    } catch (error) {
      console.error("Erreur lors de la mise à jour du café :", error);
      throw new Error("Erreur lors de la mise à jour du café");
    }
  },
};

export default dataMapper;

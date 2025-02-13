import dataMapper from "../data-mapper.js";
import path from "node:path";
import fs from "fs";
import upload from "../middlewares/multer.js";

const adminController = {
  async deleteCoffee(req, res) {
    try {
      const reference = req.body.reference;
      const result = await dataMapper.deleteCoffeeToDatabase(reference);

      if (result === 0) {
        console.log("⚠️ Aucune référence trouvée en base de données.");
        return res.render("admin", {
          noReferenceFindMessage: `Aucune référence ${reference} trouvée dans la base de données`,
          page: "admin",
        });
      }

      // Vérification du fichier
      const filePath = path.join(
        process.cwd(),
        "public",
        "assets",
        "coffees",
        `${reference}.png`
      );

      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
        console.log(`✅ Fichier supprimé: ${filePath}`);
      } else {
        console.log(`❌ Aucun fichier trouvé pour ${reference}.png`);
      }

      res.redirect("/admin");
    } catch (error) {
      console.error("🔥 Erreur dans deleteCoffee:", error);
      res.status(500).send("Erreur interne lors de la suppression du café.");
    }
  },

  async addCoffee(req, res) {
    try {
      let newCoffeeData = req.body;

      // Vérifier que le prix est un nombre au format décimal avec 2 chiffres après la virgule
      const price = parseFloat(newCoffeeData.price_per_kg);

      // Vérification si price_per_kg est un nombre valide et au format décimal
      if (
        isNaN(price) ||
        !/^(\d+(\.\d{1,2})?)?$/.test(newCoffeeData.price_per_kg)
      ) {
        return res
          .status(400)
          .send(
            "Le prix par kg doit être un nombre décimal avec 2 chiffres après la virgule."
          );
      }

      // Si le prix est valide, on formate à 2 décimales
      newCoffeeData.price_per_kg = price.toFixed(2);

      // Si l'utilisateur est admin, on peut ajouter le café à la base de données
      await dataMapper.addCoffeeToDatabase(newCoffeeData);

      // Redirection vers la page d'administration après l'ajout
      res.redirect("/admin");
    } catch (error) {
      console.error(error);
      res.status(500).send("Erreur interne lors de l'ajout du café.");
    }
  },

  async renderAdminPage(req, res) {
    try {
      res.render("admin", { page: "admin" });
    } catch (error) {
      console.error(error);
      res.status(500).send("Erreur interne lors du rendu de la page admin");
    }
  },
  async renderResultSearchPage(req, res) {
    try {
      const searchterm = req.query.searchterm;
      const coffees = await dataMapper.getCoffeesByNameOrRef(searchterm);

      res.render("searchResult", { page: "admin", coffees, searchterm });
    } catch (error) {
      console.error(error);
      res.status(500).send("Erreur interne lors du rendu de la page admin");
    }
  },
  async renderEditCoffeePage(req, res) {
    try {
      const id = req.params.id;
      const coffee = await dataMapper.getOneCoffeeById(id);
      const categoryName = await dataMapper.getCategoryNameById(id);

      res.render("editCoffee", { page: "admin", coffee, categoryName });
    } catch (error) {
      console.error(error);
      res.status(500).send("Erreur interne lors du rendu de la page admin");
    }
  },
  async editCoffee(req, res) {
    try {
      const coffeeId = req.params.id;
      let editCoffeeData = req.body;

      // Vérifier que le prix est un nombre au format décimal avec 2 chiffres après la virgule
      const price = parseFloat(editCoffeeData.price_per_kg);

      // Vérification si price_per_kg est un nombre valide et au format décimal
      if (
        isNaN(price) ||
        !/^(\d+(\.\d{1,2})?)?$/.test(editCoffeeData.price_per_kg)
      ) {
        return res
          .status(400)
          .send(
            "Le prix par kg doit être un nombre décimal avec 2 chiffres après la virgule."
          );
      }
      // Si le prix est valide, on formate à 2 décimales
      editCoffeeData.price_per_kg = price.toFixed(2);

      // Si l'utilisateur est admin, on peut editer le café à la base de données
      await dataMapper.editCoffeeToDatabase(editCoffeeData, coffeeId);

      res.redirect(`/admin/edit-coffee/${coffeeId}`);
    } catch (error) {
      console.error(error);
      res.status(500).send("Erreur interne lors du rendu de la page admin");
    }
  },
};

export { adminController, upload };

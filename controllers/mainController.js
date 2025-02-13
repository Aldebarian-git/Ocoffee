import dataMapper from "../data-mapper.js";

const mainController = {
  // Rendre la page d'accueil avec les derniers cafés
  async renderHomePage(req, res) {
    try {
      const coffees = await dataMapper.getLastCoffees();
      res.render("home", { coffees});
    } catch (error) {
      console.error(error);
      res.status(500).send("Erreur interne lors de la récupération des cafés");
    }
  },

  // Rendre la page du catalogue avec une liste de cafés mélangée
  async renderCatalogPage(req, res) {
    try {
      const coffeesToShuffle = await dataMapper.getAllCoffees();      
      const coffees = [...coffeesToShuffle].sort(() => Math.random() - 0.5);
      
      res.render('catalog', {coffees });
    } catch (error) {
      console.error(error);
      res.status(500).send("Erreur interne lors du rendu de la page catalogue");
    }
  },

  // Rendre la page de la boutique (contact dans ce cas ?)
  renderShopPage(req, res) {
    try {
      res.render("shop",{page:'shop'});
    } catch (error) {
      console.error(error);
      res.status(500).send("Erreur interne lors du rendu de la page boutique");
    }
  },

  // Rendre la page d'un café spécifique en fonction de son ID
  async renderCoffeePage(req, res) {
    try {
      const id = Number(req.params.id);
  
      // Vérifier si l'ID est un nombre valide
      if (isNaN(id)) {
        console.warn(`ID invalide reçu: ${req.params.id}`);
        return res.status(400).render("404");
      }
  
      const coffee = await dataMapper.getOneCoffeeById(id);
  
      // Vérifier si le café existe
      if (!coffee) {
        console.warn(`Café avec ID ${id} non trouvé`);
        return res.status(404).render("404");
      }
  
      res.render("coffee", { coffee });
    } catch (error) {
      console.error("Erreur interne lors du rendu de la page café :", error);
      res.status(500).render("500", { message: "Erreur interne du serveur" });
    }
  },
  

  // Rendre la page de contact
  async renderContactPage(req, res) {
    try {
      res.render("contact", { page: 'contact' });
    } catch (error) {
      console.error(error);
      res.status(500).send("Erreur interne lors du rendu de la page café");
    }
  },
};

export default mainController;


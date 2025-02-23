import dataMapper from "../data-mapper.js";

const loginController = {
  renderLoginPage(req, res) {
    try {
      // Récupérer le message de pop-up depuis la session
      const popUpMessage = req.session.popUpMessage;

      // Supprimer le message de la session après qu'il ait été affiché
      delete req.session.popUpMessage;

      res.render("login", { page: "admin", popUpMessage });
    } catch (error) {
      console.error(error);
      res.status(500).send("Erreur interne lors du rendu de la page login");
    }
  },

  async renderLoginSuccesPage(req, res) {
    try {
      // Vérification des identifiants avec le dataMapper
      const isAdmin = await dataMapper.isAdmin(req.body);
      const user = req.body.username;

      if (!isAdmin) {
        res.send("Utilisateur inconnu");
        return;
      }

      // Si l'utilisateur est un administrateur, on crée une session
      req.session.isAdmin = true;

      const popUpMessage = {
        notificationTitle: "Connexion réussie",
        details: `Vous êtes connecté en tant que : ${user}`,
        type: "success",
      };

      req.session.popUpMessage = popUpMessage;

      // Redirection vers la page admin
      res.redirect("/admin");
    } catch (error) {
      console.error(error);
      res.status(500).send("Erreur interne lors du rendu de la page admin");
    }
  },
  async logOut(req, res) {
    try {
      // Créer le message de notification
      const popUpMessage = {
        notificationTitle: "Déconnexion réussie",
        details: "Vous êtes déconnecté",
        type: "success",
      };
  
      // Ajouter le message à la session
      req.session.popUpMessage = popUpMessage;
  
      // Supprimer uniquement la propriété isAdmin de la session
      delete req.session.isAdmin;
  
      // Rediriger l'utilisateur vers la page de connexion
      res.redirect("/login");
    } catch (error) {
      console.error(error);
      res.status(500).send("Erreur interne lors de la déconnexion");
    }
  }
  
};

export default loginController;

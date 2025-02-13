import dataMapper from "../data-mapper.js";

const loginController = {
  renderLoginPage(req, res) {
    try {
      res.render("login", { page: "admin" });
    } catch (error) {
      console.error(error);
      res.status(500).send("Erreur interne lors du rendu de la page login");
    }
  },

  async renderLoginSuccesPage(req, res) {
    try {
      // Vérification des identifiants avec le dataMapper
      const isAdmin = await dataMapper.isAdmin(req.body);       
      console.log(req.body);
      console.log(isAdmin);
      
      if (!isAdmin) {
        res.send("Utilisateur inconnu");
        return;
      }

      // Si l'utilisateur est un administrateur, on crée une session
      req.session.isAdmin = true;      
      
      // Redirection vers la page admin
      res.render("admin", { page: "admin" });
    } catch (error) {
      console.error(error);
      res.status(500).send("Erreur interne lors du rendu de la page admin");
    }
  },
  async logOut(req, res) {
    try {
      req.session.destroy((err) => {
        if (err) {
          return res.status(500).send("Erreur lors de la déconnexion");
        }
        // Une fois la session détruite, on redirige l'utilisateur vers la page de connexion
        res.redirect("/login"); 
      });
    } catch (error) {
      console.error(error);
      res.status(500).send("Erreur interne lors de la déconnexion");
    }
  }
  
};

export default loginController;

// middlewares/authMiddleware.js
const authMiddleware = {
  isAdminMiddleware(req, res, next) {
    if (req.session.isAdmin === true) {
      return next();
    } else {
      return res.redirect("/login"); // Redirige vers une page de connexion si non admin
    }
  },
};

export default authMiddleware;

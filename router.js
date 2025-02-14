import { Router } from "express";
import mainController from "./controllers/mainController.js";
import { adminController} from "./controllers/adminController.js";
import loginController from "./controllers/loginController.js";
import authMiddleware  from './middlewares/authMiddleware.js';
import upload from "./middlewares/multer.js";

const router = Router();


// Définition des routes
router.get("/", mainController.renderHomePage);
router.get("/shop", mainController.renderShopPage);
router.get("/coffee/:id", mainController.renderCoffeePage);
router.get("/contact", mainController.renderContactPage);
router.get("/catalog", mainController.renderCatalogPage);
router.get("/login", loginController.renderLoginPage);
router.get("/admin",authMiddleware.isAdminMiddleware,adminController.renderAdminPage);


// Route d'admin protégée avec le middleware
router.get("/login/admin",authMiddleware.isAdminMiddleware,adminController.renderAdminPage);
router.post("/login/admin",loginController.renderLoginSuccesPage);
router.post("/logout",loginController.logOut);

// Applique le middleware upload à la route d'ajout de café
router.post("/admin/add-coffee",authMiddleware.isAdminMiddleware,upload.single("file"), adminController.addCoffee);
router.post("/admin/delete-coffee",authMiddleware.isAdminMiddleware,adminController.deleteCoffee);
router.post("/admin/edit-coffee/:id",authMiddleware.isAdminMiddleware,upload.single("file"),adminController.editCoffee);
router.get("/admin/edit-coffee/:id",authMiddleware.isAdminMiddleware,adminController.renderEditCoffeePage);

router.get("/admin/search-coffee",authMiddleware.isAdminMiddleware, adminController.renderResultSearchPage);

// Middleware 404
router.use((req, res) => {
  res.status(404).render("404");
});

// Exporter le router
export default router;


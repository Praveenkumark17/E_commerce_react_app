import { register,login } from "../controller/authController.js";
import { addBrand, getBrand, getByIdBrand, updateBrand, deleteBrand } from "../controller/brandController.js";
import { Router } from "express";
import { addProduct, deleteProduct, getProductById, getProducts, updateProduct } from "../controller/productController.js";
import { addCategory ,getCategorys,getCategoryById,updateCategory,deleteCategory } from "../controller/categoryController.js"
import { addCart, deleteCartById, getcart, getCartByEmail, updateCartById } from "../controller/cartController.js";
import { addFav, deleteFavById, getfav } from "../controller/favController.js";

const router = Router();

router.post("/register", register);
router.post("/login", login);

router.post("/addbrand",addBrand);
router.get("/getbrand",getBrand)
router.get("/getbrandid/:id", getByIdBrand)
router.put("/updatebrand/:id", updateBrand)
router.delete("/deletebrand/:id", deleteBrand)

router.post('/addproduct',addProduct);
router.get('/getproduct',getProducts);
router.get('/getproductid/:id',getProductById);
router.put('/updateproduct/:id',updateProduct);
router.delete('/deleteproduct/:id',deleteProduct);

router.post('/addcategory', addCategory);
router.get('/getcategory',getCategorys);
router.get('/getcategoryid/:id',getCategoryById);
router.put('/updatecategory/:id',updateCategory);
router.delete('/deletecategory/:id',deleteCategory);

router.post('/addcart',addCart);
router.get('/getcart',getcart);
router.get('/getcartemail/:email',getCartByEmail);
router.put('/updatecart/:id',updateCartById);
router.delete('/deletecart/:id',deleteCartById);

router.post('/addfav',addFav);
router.get('/getfav',getfav);
router.delete('/deletefav/:id',deleteFavById);

export default router;
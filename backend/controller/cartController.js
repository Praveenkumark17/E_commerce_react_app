import Cart from "../model/cart.js";

export const addCart = async (req, res) => {
    try {
      const { category, productname, quantity, price, description, email, image } = req.body;
      if (!category || !productname || !quantity || !price || !description || !email || !image) {
        return res.status(400).json({ message: "All fields are required" });
      }
      const existingCart = await Cart.findOne({ productname,email });
      if (existingCart) {
        await Cart.deleteOne({ productname,email });
        return res.status(200).json({ message: "Existing cart deleted successfully" });
      }
      const newCart = new Cart({
        category, productname, quantity, price, description, email, image
      });
      await newCart.save();
      res.status(201).json({ message: "Cart added successfully", newCart });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  };


  export const getcart = async (req, res) => {
    try {
      const cart = await Cart.find();
      res.status(200).json(cart);
    } catch (error) {
      console.error("Error fetching cart:", error);  // Log the error for debugging
      res.status(500).json({ message: error.message });
    }
  };  
    
   

  export const getCartByEmail = async (req, res) => {
    try {
      const { email } = req.params; // Assuming email is passed as a URL parameter
      if (!email) {
        return res.status(400).json({ message: "Email is required" });
      }
      const cart = await Cart.find({ email });
      if (!cart) {
        return res.status(404).json({ message: "No cart found for this email" });
      }
      res.status(200).json(cart);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  };

  export const updateCartById = async (req, res) => {
    try {
      const { id } = req.params; // Assuming the ID is passed as a URL parameter
      const updateData = req.body; // Assuming the data to update is passed in the request body
  
      if (!id) {
        return res.status(400).json({ message: "ID is required" });
      }
  
      const cart = await Cart.findByIdAndUpdate(id, updateData, { new: true });
  
      if (!cart) {
        return res.status(404).json({ message: "No cart found with this ID" });
      }
  
      res.status(200).json({ message: "Cart updated successfully", cart });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  };
  

  export const deleteCartById = async (req, res) => {
    try {
      const { id } = req.params; // Assuming the ID is passed as a URL parameter
      if (!id) {
        return res.status(400).json({ message: "ID is required" });
      }
      const cart = await Cart.findByIdAndDelete(id);
      if (!cart) {
        return res.status(404).json({ message: "No cart found with this ID" });
      }
      res.status(200).json({ message: "Cart deleted successfully" });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  };
  
  
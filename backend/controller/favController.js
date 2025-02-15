import Fav from "../model/fav.js";

export const addFav = async (req, res) => {
    try {
      const { category, productname, quantity, price, description, email, image } = req.body;
      if (!category || !productname || !quantity || !price || !description || !email || !image) {
        return res.status(400).json({ message: "All fields are required" });
      }
      const existingfav = await Fav.findOne({ productname, email });
      if (existingfav) {
        await Fav.deleteOne({ productname, email });
        return res.status(200).json({ message: "Existing Fav deleted successfully" });
      }
      const newfav = new Fav({
        category, productname, quantity, price, description, email, image
      });
      await newfav.save();
      res.status(201).json({ message: "Fav added successfully", newfav });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  };  

  export const getfav = async (req, res) => {
      try {
        const fav = await Fav.find();
        res.status(200).json(fav);
      } catch (error) {
        console.error("Error fetching fav:", error);  // Log the error for debugging
        res.status(500).json({ message: error.message });
      }
    };  

    export const deleteFavById = async (req, res) => {
      try {
        const { id } = req.params; // Assuming the ID is passed as a URL parameter
        if (!id) {
          return res.status(400).json({ message: "ID is required" });
        }
        const fav = await Fav.findByIdAndDelete(id);
        if (!fav) {
          return res.status(404).json({ message: "No fav found with this ID" });
        }
        res.status(200).json({ message: "fav deleted successfully" });
      } catch (error) {
        res.status(500).json({ message: error.message });
      }
    };
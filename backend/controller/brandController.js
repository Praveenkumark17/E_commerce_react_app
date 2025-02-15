import Brand from "../model/brand.js";

export const addBrand = async (req, res) => {
  try {
    const { owner, brand, phone, city, status, description, email } = req.body;
    if (!owner || !brand || !phone || !city || !status || !description || !email) {
      return res.status(400).json({ message: "All fields are required" });
    }
    const existingBrand = await Brand.findOne({ brand });
    if (existingBrand) {
      return res.status(400).json({ message: "Brand already exists" });
    }
    const newBrand = new Brand({ owner, brand, phone, city, status, description, email });
    await newBrand.save();
    res.status(201).json({ message: "Brand added successfully", newBrand });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getBrand = async (req, res) => {
  try {
    const brands = await Brand.find();
    res.status(200).json(brands);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getByIdBrand = async (req, res) => {
  try {
    const { id } = req.params;
    const brand = await Brand.findById(id);
    if (!brand) {
      return res.status(404).json({ message: "Brand not found" });
    }
    res.status(200).json(brand);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateBrand = async (req, res) => {
  try {
    const { id } = req.params;
    const { owner, brand, phone, city, status, description, email } = req.body;
    const existingBrand = await Brand.findOne({ brand });
    if (existingBrand && existingBrand._id.toString() !== id) {
      return res.status(400).json({ message: "Brand already exists" });
    }
    const updatedBrand = await Brand.findByIdAndUpdate(
      id,
      { owner, brand, phone, city, status, description, email },
      { new: true }
    );
    if (!updatedBrand) {
      return res.status(404).json({ message: "Brand not found" });
    }
    res.status(200).json({ message: "Brand updated successfully", updatedBrand });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const deleteBrand = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedBrand = await Brand.findByIdAndDelete(id);
    if (!deletedBrand) {
      return res.status(404).json({ message: "Brand not found" });
    }
    res.status(200).json({ message: "Brand deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
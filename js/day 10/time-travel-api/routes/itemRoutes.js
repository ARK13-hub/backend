const express = require("express");
const Item = require("../models/Item");
const ItemHistory = require("../models/ItemHistory");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();


// CREATE ITEM
router.post("/", authMiddleware, async (req, res) => {
  try {

    const { name, price } = req.body;

    const item = new Item({
      name,
      price,
      owner: req.user.id
    });

    await item.save();

    res.json({
      message: "Item created successfully",
      item
    });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});


// UPDATE ITEM
router.put("/:id", authMiddleware, async (req, res) => {
  try {

    const item = await Item.findById(req.params.id);

    if (!item) {
      return res.status(404).json({ message: "Item not found" });
    }

    // Save current version
    const history = new ItemHistory({
      itemId: item._id,
      version: item.__v + 1,
      data: {
        name: item.name,
        price: item.price
      }
    });

    await history.save();

    const { name, price } = req.body;

    item.name = name || item.name;
    item.price = price || item.price;

    await item.save();

    res.json({
      message: "Item updated successfully",
      item
    });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});


// GET ITEM HISTORY
router.get("/:id/history", authMiddleware, async (req, res) => {
  try {

    const history = await ItemHistory.find({
      itemId: req.params.id
    }).sort({ version: 1 });

    res.json({
      itemId: req.params.id,
      versions: history
    });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// RESTORE ITEM VERSION
router.post("/:id/restore/:version", authMiddleware, async (req, res) => {
  try {

    const itemId = req.params.id;
    const versionNumber = parseInt(req.params.version);

    const history = await ItemHistory.findOne({
      itemId: itemId,
      version: versionNumber
    });

    if (!history) {
      return res.status(404).json({ message: "Version not found" });
    }

    const item = await Item.findById(itemId);

    if (!item) {
      return res.status(404).json({ message: "Item not found" });
    }

    // restore data
    item.name = history.data.name;
    item.price = history.data.price;

    await item.save();

    res.json({
      message: `Item restored to version ${versionNumber}`,
      item
    });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});


module.exports = router;
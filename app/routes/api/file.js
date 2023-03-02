const express = require("express");
const router = express.Router();

const FilesController = require("../../controllers/FilesController");

router.post("/upload", FilesController.upload); 
router.get("/list", FilesController.list);
router.get("/:id", FilesController.getById);
router.delete("/:id", FilesController.deleteById);
router.get("/download/:id", FilesController.downloadById);
router.put("/update/:id", FilesController.updateById);

module.exports = router;
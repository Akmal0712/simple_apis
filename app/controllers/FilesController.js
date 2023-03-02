const File = require("../models/File");
const secret = require("../../config").jwt.secret;
const path = require("path");
const fs = require("fs");
const jwt = require("jsonwebtoken");

const upload = async (req, res) => {
  const name = req.files.file.name;
  const mimeType = req.files.file.mimetype; 
  const size = req.files.file.size; 
  let ext = name.split(".");
  ext = ext[ext.length - 1];
  try {

    const token = req.headers.authorization.split(" ")[1];
    const user = jwt.verify(token, secret);
    const file = File.build({
      user_id: user.id,
      name,
      extension: ext,
      mime_type: mimeType,
      size,
      created_at: Date.now()
    });

    await file.save();

    const p = path.resolve("./") + "\\static\\files\\" + file.id + name;
    await req.files.file.mv(p);

    res.json({
      id: file.id,
      message: "File uploaded"
    });
  }
  catch (error) {
    res.status(400).json(error);
  }
};

const list = async (req, res) => {
  const { page, list_size } = req.query;
  const limit = list_size ? +list_size : 10;
  const offset = page ? page * limit : 0;

  try {
    const response = await File.findAndCountAll({ limit, offset });

    res.json(response);
  }
  catch (e) {
    res.json(e);
  }
};

const getById = async (req, res) => {
  const id = req.params.id;
  try {
    const file = await File.findOne({ where: { id } });

    if (!file) {
      res.json({ message: `File with this id: ${id} not found` });
    }

    res.json(file);
  }
  catch (e) {
    res.json(e);
  }
};

const deleteById = async (req, res) => {
  const id = req.params.id;
  try {
    const file = await File.findOne({ where: { id }, attributes: ["name", "id"]});
    const result = await File.destroy({ where: { id } });

    if (!result) {
      res.json({ message: `File with id: ${id} not found` });
    }

    fs.unlinkSync(path.resolve("./") + "\\static\\files\\" + file.id + file.name);

    res.json({ message: `File with id: ${id} was deleted` });
  }
  catch (e) {
    res.json(e);
  }};

const downloadById = async (req,res) => {
  const id = req.params.id;
  try {
    const file = await File.findOne({ where: { id }, attributes: ["name", "id"]});
    const filePath = path.resolve("./") + "\\static\\files\\" + file.id + file.name;

    res.download(filePath);
  }
  catch (e) {
    res.json(e);
  }
};

const updateById = async (req,res) => {
  const id = req.params.id;

  const name = req.files.file.name;
  const mimeType = req.files.file.mimetype;
  const size = req.files.file.size;
  let ext = name.split(".");
  ext = ext[ext.length - 1];
  try {
    const oldFile = await File.findOne({ where: {id}, attributes: ["id", "name"] });
    if (!oldFile)
      res.json({ message: `File with id: ${id} not found` });

    const file = await File.findOne({ where: { id } });
    file.name = name;
    file.extension = ext;
    file.mime_type = mimeType;
    file.size = size;

    await file.save();
    fs.unlinkSync(path.resolve("./") + "\\static\\files\\" + oldFile.id + oldFile.name);
    const p = path.resolve("./") + "\\static\\files\\" + file.id + file.name;
    await req.files.file.mv(p);

    res.json({
      id: file.id,
      message: "File has been updated"
    });
  }
  catch (e) {
    res.json(e);
  }

};

module.exports = {
  upload,
  list,
  getById,
  deleteById,
  updateById,
  downloadById
};
const Colour = require("../models/colour");

let create = async (req, res, next) => {
  let colour_name = req.body.colour_name;
  if (colour_name === undefined)
    return res.status(400).send("Trường tên màu không tồn tại");
  let colour = await Colour.findOne({ where: { colour_name } });
  if (colour) return res.status(409).send("Tên màu đã tồn tại");
  else {
    let newColour = await Colour.create({ colour_name });
    return res.send(newColour);
  }
};

let list = async (req, res, next) => {
  let colours = await Colour.findAll({
    attributes: ["colour_id", "colour_name"],
    raw: true,
  });
  return res.send(colours);
};

const deleteColor = async (req, res, next) => {
  let colour_id = req.params.id;
  if (!colour_id) return res.status(400).send("Thiếu thông tin ID màu");
  let colour = await Colour.findOne({ where: { colour_id } });
  if (!colour) return res.status(404).send("Màu không tồn tại");
  await colour.destroy();
  return res.send({ message: "Xóa màu thành công" });
};

module.exports = {
  create,
  deleteColor,
  list,
};

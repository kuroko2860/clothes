const Size = require("../models/size");

let create = async (req, res, next) => {
  let size_name = req.body.size_name;
  if (size_name === undefined)
    return res.status(400).send("Trường tên size không tồn tại");
  let size = await Size.findOne({ where: { size_name } });
  if (size) return res.status(409).send("Tên size đã tồn tại");
  else {
    let newSize = await Size.create({ size_name });
    return res.send(newSize);
  }
};

let deleteSize = async (req, res, next) => {
  try {
    const size_id = req.params.id;
    if (!size_id) return res.status(400).send("Thiếu thông tin ID size");
    let size = await Size.findOne({ where: { size_id } });
    if (!size) return res.status(404).send("Size không tồn tại");
    await Size.destroy({ where: { size_id } });
    return res.send("Xóa size thành công");
  } catch (err) {
    console.log(err);
    return res.status(500).send("Gặp lỗi khi xóa size");
  }
};

let list = async (req, res, next) => {
  let sizes = await Size.findAll({
    attributes: ["size_id", "size_name"],
    raw: true,
  });
  return res.send(sizes);
};

module.exports = {
  create,
  deleteSize,
  list,
};

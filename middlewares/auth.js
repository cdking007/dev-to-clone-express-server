const jwt = require("jsonwebtoken");
const User = require("../models/user");

module.exports = async (req, res, next) => {
  try {
    const authToken = req.header("Authorization").replace("Bearer ", "");
    const decode = jwt.verify(authToken, process.env.JWT_SEC);
    const user = await User.findOne({
      _id: decode._id,
      "tokens.token": authToken,
    });
    if (!user) {
      throw new Error("user not found");
    }
    req.token = authToken;
    req.user = user;
    next();
  } catch (err) {
    return res.send({ error: err });
  }
};

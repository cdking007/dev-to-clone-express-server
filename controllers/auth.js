const User = require("../models/user");

// signup
exports.postSignup = async (req, res) => {
  const { name, email, password, username } = req.body;
  if (!name || !email || !password || !username) {
    return res.json({ error: "Please fill all the details" });
  }
  try {
    const temp = await User.find({ email });
    const temp2 = await User.find({ username });
    if (temp.length !== 0) {
      return res.send({ error: "Useralready exist with this email" });
    }
    if (temp2.length !== 0) {
      return res.send({ error: "Useralready exist with this username" });
    }
    const user = new User({ name, email, password, username });
    await user.save();
    const token = await user.generateAuthToken();
    return res.json({ user, token });
  } catch (error) {
    return res.json({ error: error });
  }
};

// signin
exports.postSignin = async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findByCredentials(email, password);
  if (!user) {
    return res.json({ error: "Invalid username or password" });
  }
  const token = await user.generateAuthToken();
  return res.json({ user, token });
};

// logout3
exports.postLogout = async (req, res) => {
  try {
    req.user.tokens = req.user.tokens.filter((token) => {
      return token.token !== req.token;
    });
    await req.user.save();
    return res.send({ msg: "Logged out!" });
  } catch (err) {
    return res.json({ error: err });
  }
};

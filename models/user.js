const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const Schema = mongoose.Schema;

const userSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      maxlength: 15,
    },
    username: {
      type: String,
      required: true,
      trim: true,
      maxlength: 15,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      validate(value) {
        if (!validator.isEmail(value)) {
          throw new Error("Email is Not Valid");
        }
      },
    },
    password: {
      type: String,
      required: true,
      minlength: 6,
      validate(value) {
        if (value.toLowerCase().includes("password")) {
          throw new Error("Password is not secure!");
        }
      },
    },
    role: {
      type: Number,
      default: 0,
    },
    tokens: [
      {
        token: {
          type: String,
        },
      },
    ],
  },
  {
    timestamps: true,
  }
);

userSchema.methods.toJSON = function () {
  const user = this;
  const tempUser = user.toObject();
  delete tempUser.password;
  delete tempUser.tokens;
  return tempUser;
};

// hasing the individual password
userSchema.statics.hashPassword = async (password) => {
  const _pw = password;
  const _hpw = await bcrypt.hash(_pw, 10);
  return _hpw;
};

// generating the auth token
userSchema.methods.generateAuthToken = async function () {
  try {
    const user = this;
    const token = await jwt.sign(
      { _id: user._id.toString() },
      process.env.JWT_SEC,
      {
        expiresIn: "7 days",
      }
    );
    user.tokens = user.tokens.concat({ token });
    await user.save();
    return token;
  } catch (err) {
    throw new Error(err);
  }
};

// finding the user if available

userSchema.statics.findByCredentials = async (email, password) => {
  try {
    const user = await User.findOne({ email });
    if (!user) {
      return;
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return;
    }
    return user;
  } catch (error) {
    throw new Error(error);
  }
};

// Hasing the password before saving it
userSchema.pre("save", async function (next) {
  const user = this;
  if (user.isModified("password")) {
    user.password = await bcrypt.hash(user.password, 10);
  }
  next();
});

const User = mongoose.model("User", userSchema);

module.exports = User;

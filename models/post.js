const mongoose = require("mongoose");
const marked = require("marked");
const createDomPurify = require("dompurify");
const { JSDOM } = require("jsdom");
const domPurify = createDomPurify(new JSDOM().window);
const slugify = require("slugify");
const Schema = mongoose.Schema;

const postSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
    },
    url: {
      type: String,
      required: true,
      unique: true,
    },
    description: {
      type: String,
      default: "No Description Found",
    },
    body: {
      type: String,
      required: true,
    },
    sanHtmlBody: {
      type: String,
      required: true,
    },
    photo: {
      type: String,
    },
    likes: [
      {
        type: Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    comments: [
      {
        text: {
          type: String,
        },
        postedBy: {
          type: Schema.Types.ObjectId,
          ref: "User",
        },
      },
    ],
    postedBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
  },
  {
    timestamps: true,
  }
);

postSchema.pre("validate", function (next) {
  if (this.title) {
    this.url = slugify(this.title, {
      lower: true,
      strict: true,
    });
  }
  if (this.body) {
    this.sanHtmlBody = domPurify.sanitize(marked(this.body));
  }
  next();
});

postSchema.pre("update", function (next) {
  if (this.title) {
    this.url = slugify(this.title, {
      lower: true,
      strict: true,
    });
  }
  if (this.body) {
    this.sanHtmlBody = domPurify.sanitize(marked(this.body));
  }
  next();
});

postSchema.pre("updateOne", function (next) {
  if (this.title) {
    this.url = slugify(this.title, {
      lower: true,
      strict: true,
    });
  }
  if (this.body) {
    this.sanHtmlBody = domPurify.sanitize(marked(this.body));
  }
  next();
});
postSchema.pre("findOneAndUpdate", function (next) {
  if (this.title) {
    this.url = slugify(this.title, {
      lower: true,
      strict: true,
    });
  }
  if (this.body) {
    this.sanHtmlBody = domPurify.sanitize(marked(this.body));
  }
  next();
});

const Post = mongoose.model("Post", postSchema);

module.exports = Post;

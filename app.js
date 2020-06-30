// loading the npm module
const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");

// routes
const authRoutes = require("./routes/auth");
const postRoutes = require("./routes/post");
const userRoutes = require("./routes/user");

// including the db to the site
require("./db/mongodb");

// initializng the express into the app
const app = express();

app.use(cors());
// using the middlewares
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
// settings the routers
app.use("/api/auth", authRoutes);
app.use("/api", postRoutes);
app.use("/api", userRoutes);
// listening on the port  of the server
const port = process.env.PORT || 3001;

// starting the sever on the above port
app.listen(port, () => {
  console.log(`server is started on ${port}`);
});

const express = require("express");
const app = express();
const mongoose = require("mongoose");
var routes = require("./route/routes");
const cors = require("cors");

const corsOpts = {
    origin: '*',
  
    methods: [
      'GET',
      'POST',
      'DELETE',
      'PATCH',
      'PUT'
    ],
  
    allowedHeaders: [
      'Content-Type',
    ],
  };
  app.use(cors(corsOpts));

app.listen(5000, () => {
  console.log("App is listning on port 5000");
});

mongoose
  .connect(
    "mongodb+srv://archeedoshi:root@cluster0.26erypz.mongodb.net/xyz",
    {}
  )
  .then(() => {
    console.log("connection done");
  })
  .catch((e) => {
    console.log("connection unsucessfull");
  });
app.use(express.json());
app.use(routes);

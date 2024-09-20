const express = require("express");
const app = express();
const server = require("http").createServer(app);
const router = express.Router();
const bodyParser = require('body-parser');
const cors = require('cors');
const multer = require('multer');

require("dotenv").config();
// require("./global")(server);

var corsOptions = {
  origin: '*',
  optionsSuccessStatus: 200 // some legacy browsers (IE11, various SmartTVs) choke on 204
}
app.use(cors(corsOptions));
app.use(bodyParser.json());
app.use(express.json());
app.use(express.urlencoded({ extended: true}));
app.use(multer().any());

router.use("", require('./router/'));


app.use(router);

const port = 3001;
server.listen(port, () => {
    console.log(`Server up and running on: ${port} !`)
});
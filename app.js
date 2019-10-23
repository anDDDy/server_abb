const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
let API_ROUTER = require('./routes/api');
const STATIC = path.join(__dirname, 'client');
const app = express();

app.use(bodyParser.json());
app.use(express.static(STATIC));
app.use('/API', API_ROUTER);
app.get('/', (req, res) => {

});

app.listen(3012, () => {
  console.log('API app started');
});

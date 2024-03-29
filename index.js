const express = require('express');
const path = require('path');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 3000;

app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '/index.html'));
});

app.get('/api/bearerToken', (req, res) => {
  const json = { data: process.env.SKYFLOW_BEARER_TOKEN };
  res.json(json);
});

app.listen(port, () => {
  console.log(`Skyflow Demo listening at http://localhost:${port}`);
});

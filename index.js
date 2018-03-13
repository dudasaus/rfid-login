const express = require('express');

const app = express();

app.all('/api/*', (req, res) => {
  res.end('API');
});

app.use(express.static('public'));

app.listen(8080);

const express = require('express');
const app = express();
const path = require('path');

app.use(express.static(__dirname + '/dist/chat-client'));

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '/dist/chat-client/index.html'));
});

app.listen(process.env.PORT || 80, () => {
  console.log(`Server running on port ${process.env.PORT || 80}`);
});

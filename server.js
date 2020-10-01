const app = require('./app.js');
// prints url as clickable link
const port = process.env.PORT || 8090;
app.listen(port, () => {
  console.log('listening on http://127.0.0.1:%d', port);
});

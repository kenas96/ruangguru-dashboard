const express = require('express');

const app = express();
const port = process.env.PORT || 8080;
app.use('/assets', express.static(`${__dirname}/assets`));
app.use('/css', express.static(`${__dirname}/css`));
app.use('/js', express.static(`${__dirname}/js`));

app.get('*', (req, res) => {
  res.set('Content-Type', 'text/html');
  res.sendFile(`${__dirname}/index.html`);
})

app.listen(port, (error) => {
  if (error) {
    console.error(error);
  } else {
    console.info('==> 🌎  Listening on port %s. Open up http://localhost:%s/ in your browser.', port, port);
  }
});

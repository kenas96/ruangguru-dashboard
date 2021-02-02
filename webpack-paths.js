const path = require('path');

const root = path.resolve(__dirname, '..');

module.exports = {
  root,
  src: path.join(__dirname, 'src'),
  build: path.join(__dirname, 'build'),
  components: path.join(__dirname, 'src/components')
};

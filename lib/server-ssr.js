const path = require('path');
const { createSsrServer } = require('./server');

const server = createSsrServer({
  bundle: path.resolve(__dirname, './bundle.json'),
  dirname: __dirname,
});

const port = process.env.PORT_PC || process.env.PORT || 3002;
const host = process.env.HOST || '127.0.0.1';
server.listen(port, host, () => {
  console.log(`listen --> ${host}:${port}`);
});

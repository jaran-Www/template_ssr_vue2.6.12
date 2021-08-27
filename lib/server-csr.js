const { createCsrServer } = require('./server');

const server = createCsrServer({
  dirname: __dirname,
});

const port = process.env.PORT_MOBILE || process.env.PORT || 4002;
const host = process.env.HOST || '127.0.0.1';
server.listen(port, host, () => {
  console.log(`listen --> ${host}:${port}`);
});

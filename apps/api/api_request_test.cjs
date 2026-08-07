const http = require('http');

const request = (path, options = {}) =>
  new Promise((resolve, reject) => {
    const req = http.request(
      {
        hostname: 'localhost',
        port: 5000,
        path,
        method: options.method || 'GET',
        headers: options.headers || {},
      },
      (res) => {
        let body = '';
        res.on('data', (chunk) => (body += chunk));
        res.on('end', () => resolve({ status: res.statusCode, body }));
      }
    );

    req.on('error', reject);
    if (options.body) req.write(options.body);
    req.end();
  });

(async () => {
  try {
    console.log('Health check');
    console.log(await request('/api/health'));

    console.log('Products check');
    console.log(await request('/api/products?page=1&sort=newest'));

    console.log('Login check');
    console.log(
      await request('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: 'admin@shop.com', password: 'Admin123!' }),
      })
    );
  } catch (err) {
    console.error('ERROR', err);
    process.exit(1);
  }
})();

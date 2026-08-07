import fetch from 'node-fetch';
const base = 'http://localhost:5000/api';

async function run() {
  const r = await fetch(`${base}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: 'admin@shop.com', password: 'Admin123!' }),
  });
  console.log('login status', r.status);
  console.log('login body', await r.text());

  const p = await fetch(`${base}/products?page=1&sort=newest`);
  console.log('products status', p.status);
  console.log('products body', await p.text());
}

run().catch(err => { console.error(err); process.exit(1); });

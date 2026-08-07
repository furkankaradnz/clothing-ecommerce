const base = 'http://localhost:5000/api';

async function run() {
  const login = await fetch(`${base}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: 'admin@shop.com', password: 'Admin123!' }),
  });
  const loginText = await login.text();
  console.log('login status', login.status);
  console.log('login body', loginText);

  const products = await fetch(`${base}/products?page=1&sort=newest`);
  const productsText = await products.text();
  console.log('products status', products.status);
  console.log('products body', productsText);
}

run().catch((err) => {
  console.error('error', err);
  process.exit(1);
});

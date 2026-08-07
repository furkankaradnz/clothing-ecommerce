const fetch = globalThis.fetch;
if (!fetch) {
  throw new Error('Global fetch is not available in this Node runtime');
}

const BASE = 'http://localhost:5000/api';

async function request(path, options = {}) {
  const res = await fetch(`${BASE}${path}`, options);
  const body = await res.text();
  let data;
  try {
    data = JSON.parse(body);
  } catch {
    data = body;
  }
  return { status: res.status, data };
}

async function main() {
  console.log('1) Login');
  const loginRes = await request('/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: 'admin@shop.com', password: 'Admin123!' }),
  });
  console.log('login:', loginRes.status, loginRes.data);
  if (loginRes.status !== 200 || !loginRes.data?.success) {
    throw new Error('Login failed');
  }
  const token = loginRes.data.data.accessToken;
  if (!token) throw new Error('No accessToken returned');

  console.log('2) Get products');
  const productsRes = await request('/products?page=1&sort=newest', {
    headers: { Authorization: `Bearer ${token}` },
  });
  console.log('products:', productsRes.status);
  if (productsRes.status !== 200 || !productsRes.data?.success) {
    throw new Error('Product list failed');
  }
  const products = productsRes.data.products;
  const firstProduct = Array.isArray(products) ? products[0] : null;
  if (!firstProduct) throw new Error('No products returned');
  const variant = firstProduct.variants?.find((v) => v.stock > 0) || firstProduct.variants?.[0];
  if (!variant) throw new Error('No product variant found');
  console.log('chosen product:', firstProduct.name, 'variantId:', variant.id);

  console.log('3) Add to cart');
  const addRes = await request('/cart/items', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
    body: JSON.stringify({ variantId: variant.id, quantity: 2 }),
  });
  console.log('add to cart:', addRes.status, addRes.data);
  if (addRes.status !== 201 || !addRes.data?.success) {
    throw new Error('Add to cart failed');
  }

  console.log('4) Get cart');
  const cartRes = await request('/cart', {
    headers: { Authorization: `Bearer ${token}` },
  });
  console.log('cart:', cartRes.status, cartRes.data);
  const cartItem = cartRes.data?.data?.items?.[0];
  if (!cartItem) throw new Error('Cart item missing after add');

  console.log('5) Update cart item quantity');
  const updateRes = await request(`/cart/items/${cartItem.id}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
    body: JSON.stringify({ quantity: 3 }),
  });
  console.log('update cart item:', updateRes.status, updateRes.data);
  if (updateRes.status !== 200 || !updateRes.data?.success) {
    throw new Error('Update cart item failed');
  }

  console.log('6) Add address');
  const addressRes = await request('/addresses', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
    body: JSON.stringify({
      title: 'Ev',
      fullName: 'Ali Veli',
      phone: '05551234567',
      city: 'Bursa',
      district: 'Nilüfer',
      fullAddress: 'Örnek mahallesi, 123. sokak, No:4 D:5',
      zipCode: '16110',
      isDefault: true,
    }),
  });
  console.log('add address:', addressRes.status, addressRes.data);
  if (addressRes.status !== 201 || !addressRes.data?.success) {
    throw new Error('Add address failed');
  }

  console.log('--- FLOW COMPLETE ---');
  console.log('user:', loginRes.data.data.user.firstName, loginRes.data.data.user.lastName);
  console.log('cart item count:', cartRes.data.data.items.length);
  console.log('final item quantity:', updateRes.data.data.items[0]?.quantity || cartItem.quantity);
  console.log('address id:', addressRes.data.data.id);
}

main().catch((err) => {
  console.error('ERROR:', err.message || err);
  process.exit(1);
});

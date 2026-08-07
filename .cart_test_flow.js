const base = 'http://localhost:5000/api';

async function request(path, options = {}) {
  const res = await fetch(`${base}${path}`, options);
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
  console.log('login status', loginRes.status, loginRes.data);
  if (loginRes.status !== 200 || !loginRes.data?.success) {
    throw new Error('Login failed');
  }
  const token = loginRes.data.data?.accessToken || loginRes.data.data?.token || loginRes.data.data?.access_token;
  if (!token) throw new Error('No access token returned');

  console.log('2) Get current user profile');
  const meRes = await request('/auth/me', { headers: { Authorization: `Bearer ${token}` } });
  console.log('me status', meRes.status, meRes.data);
  const userName = meRes.data?.data?.firstName;

  console.log('3) Get products');
  const productsRes = await request('/products', { headers: { Authorization: `Bearer ${token}` } });
  console.log('products status', productsRes.status);
  if (!productsRes.data?.success) throw new Error('Failed to list products');
  const products = productsRes.data.products || productsRes.data.data || [];
  if (!Array.isArray(products) || products.length === 0) {
    throw new Error('No products available');
  }
  const firstProduct = products[0];
  const variantId = firstProduct?.variants?.[0]?.id;
  if (!variantId) throw new Error('No variantId found on first product');
  console.log('selected variantId', variantId);

  console.log('4) Add to cart');
  const addRes = await request('/cart/items', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
    body: JSON.stringify({ variantId, quantity: 2 }),
  });
  console.log('add to cart status', addRes.status, addRes.data);
  if (addRes.status !== 201 || !addRes.data?.success) throw new Error('Failed to add to cart');

  console.log('5) Get cart after add');
  const cartRes = await request('/cart', { headers: { Authorization: `Bearer ${token}` } });
  console.log('cart status', cartRes.status, cartRes.data);
  const itemId = cartRes.data?.data?.items?.[0]?.id;
  if (!itemId) throw new Error('No cart item id available');

  console.log('6) Update cart item quantity');
  const updateRes = await request(`/cart/items/${itemId}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
    body: JSON.stringify({ quantity: 3 }),
  });
  console.log('update status', updateRes.status, updateRes.data);

  console.log('7) Add address');
  const addrRes = await request('/addresses', {
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
  console.log('address status', addrRes.status, addrRes.data);

  console.log('--- RESULT ---');
  console.log('user', userName);
  console.log('cart items', cartRes.data?.data?.items?.length);
  console.log('selected itemId', itemId);
  console.log('address created id', addrRes.data?.data?.id);
}

main().catch((err) => {
  console.error('ERROR:', err.message || err);
  process.exit(1);
});

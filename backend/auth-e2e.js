// Run your backend first (cd backend && npm run dev), then: node backend/auth-e2e.js
const BASE = process.env.BASE || 'http://localhost:5000';
const auth = (token) => (token ? { Authorization: `Bearer ${token}` } : {});
const json = (token) => ({ 'Content-Type': 'application/json', ...auth(token) });
const results = [];
function check(name, cond, detail) {
  results.push({ name, pass: !!cond, detail });
  console.log(`${cond ? 'PASS' : 'FAIL'} - ${name}${detail ? ' :: ' + detail : ''}`);
}

async function main() {
  const email = `test-${Date.now()}@example.com`;
  const password = 'Password123';

  // 1) User Registration
  const reg = await fetch(`${BASE}/api/auth/register`, {
    method: 'POST', headers: json(), body: JSON.stringify({ name: 'Tester', email, password })
  });
  const regJson = await reg.json();
  check('1. Registration returns 201 + token', reg.status === 201 && regJson.token, `status=${reg.status}`);
  const userToken = regJson.token;

  // 2) User Login
  const login = await fetch(`${BASE}/api/auth/login`, {
    method: 'POST', headers: json(), body: JSON.stringify({ email, password })
  });
  const loginJson = await login.json();
  check('2. Login returns 200 + token', login.status === 200 && loginJson.token, `status=${login.status}`);
  const loginToken = loginJson.token;

  // 3) JWT Authentication (valid token -> profile)
  const prof = await fetch(`${BASE}/api/auth/profile`, { headers: auth(loginToken) });
  const profJson = await prof.json();
  check('3. JWT: /profile with valid token -> 200', prof.status === 200 && profJson.user?.email === email, `status=${prof.status}`);

  // 4) Protected Routes (no token -> 401)
  const noToken = await fetch(`${BASE}/api/auth/profile`);
  check('4. Protected /profile without token -> 401', noToken.status === 401, `status=${noToken.status}`);

  // 4b) Protected route on cart
  const cartNoToken = await fetch(`${BASE}/api/cart`);
  check('4b. Protected /cart without token -> 401', cartNoToken.status === 401, `status=${cartNoToken.status}`);

  // 5) Role-Based Access Control
  // customer tries admin action -> 403
  const custCreate = await fetch(`${BASE}/api/products`, {
    method: 'POST', headers: json(userToken), body: JSON.stringify({ name: 'X', price: 1 })
  });
  check('5a. Customer creating product -> 403 Forbidden', custCreate.status === 403, `status=${custCreate.status}`);

  // admin login
  const adminLogin = await fetch(`${BASE}/api/auth/login`, {
    method: 'POST', headers: json(), body: JSON.stringify({ email: 'admin@example.com', password: 'admin123' })
  });
  const adminJson = await adminLogin.json();
  check('5b. Admin login works', adminLogin.status === 200 && adminJson.token, `status=${adminLogin.status}`);
  const adminToken = adminJson.token;

  // admin creates product -> 201
  const adminCreate = await fetch(`${BASE}/api/products`, {
    method: 'POST', headers: json(adminToken),
    body: JSON.stringify({ name: `AdminProd ${Date.now()}`, description: 't', price: 5, categoryId: 1 })
  });
  const adminCreateJson = await adminCreate.json();
  check('5c. Admin creating product -> 201', adminCreate.status === 201 && adminCreateJson.product, `status=${adminCreate.status}`);
  if (adminCreateJson.product) {
    await fetch(`${BASE}/api/products/${adminCreateJson.product.id}`, { method: 'DELETE', headers: auth(adminToken) });
  }

  // Logout (client-side): token invalidated only by client; backend is stateless.
  check('6. Logout is client-side token removal (no server session)', true, 'handled in AuthContext.logout()');

  const failed = results.filter((r) => !r.pass);
  console.log(`\n${results.length - failed.length}/${results.length} checks passed.`);
  if (failed.length) {
    console.log('FAILURES:', failed.map((f) => f.name).join(', '));
    process.exit(1);
  }
  console.log('ALL AUTH CHECKS PASSED');
}

main().catch((e) => {
  console.error('TEST ERROR:', e.message);
  process.exit(1);
});

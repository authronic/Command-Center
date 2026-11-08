async function testAuth() {
  const fs = require('fs');
  const env = fs.readFileSync('.env.local', 'utf8');
  const username = env.match(/ADMIN_USERNAME=(.+)/)?.[1]?.trim();
  const password = env.match(/ADMIN_PASSWORD=(.+)/)?.[1]?.trim();

  // 1. Get CSRF token
  const csrfRes = await fetch('http://localhost:3000/api/auth/csrf');
  const csrfData = await csrfRes.json();
  const initialCookies = csrfRes.headers.get('set-cookie');
  console.log('CSRF token obtained:', !!csrfData.csrfToken);

  // 2. Perform sign in
  const body = new URLSearchParams({
    username: username,
    password: password,
    csrfToken: csrfData.csrfToken,
    redirect: 'false'
  });

  const signinRes = await fetch('http://localhost:3000/api/auth/callback/credentials', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      'Cookie': initialCookies || ''
    },
    body: body.toString(),
    redirect: 'manual'
  });

  console.log('Sign in status:', signinRes.status);
  const authCookies = signinRes.headers.getSetCookie ? signinRes.headers.getSetCookie() : [signinRes.headers.get('set-cookie')];
  console.log('Received auth cookies:', authCookies.length > 0);
  const cookieHeader = authCookies.map(c => c.split(';')[0]).join('; ');

  // 3. Request /dashboard with the session cookie
  const dashRes = await fetch('http://localhost:3000/dashboard', {
    headers: { 'Cookie': cookieHeader },
    redirect: 'manual'
  });
  console.log('Dashboard response status with auth cookie:', dashRes.status);
  const text = await dashRes.text();
  console.log('Contains expected header:', text.includes('Your operations, in one place.'));
}

testAuth().catch(console.error);

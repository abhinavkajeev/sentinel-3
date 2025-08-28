// Admin related API calls
export async function loginAdmin(data) {
  const res = await fetch('/api/admin/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  });
  const result = await res.json();
  if (res.ok) {
    console.log('POST /api/admin/login success:', { sent: data, received: result });
  } else {
    console.log('POST /api/admin/login failed:', { sent: data, received: result });
  }
  return result;
}

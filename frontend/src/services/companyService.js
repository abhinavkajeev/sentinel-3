// Company related API calls
export async function registerCompany(data) {
  const res = await fetch('/api/company/register', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  });
  const result = await res.json();
  if (res.ok) {
    console.log('POST /api/company/register success:', { sent: data, received: result });
  } else {
    console.log('POST /api/company/register failed:', { sent: data, received: result });
  }
  return result;
}

export async function loginCompanyPin(companyPin) {
  const res = await fetch('/api/company/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ companyPin })
  });
  return res.json();
}

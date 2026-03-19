export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();

  const SLUG   = process.env.PK_SLUG   || 'xzrinx';
  const APIKEY = process.env.PK_APIKEY || 'xtD5iywEs2Df8HsoY0VFQ1n9oLgfTtKb';

  // POST — buat QRIS
  if (req.method === 'POST') {
    const { amount, order_id, customer_name, customer_phone } = req.body || {};
    if (!amount || !order_id || !customer_name) {
      return res.status(400).json({ error: 'Missing fields', required: ['amount','order_id','customer_name'] });
    }
    try {
      const pkRes = await fetch('https://app.pakasir.com/api/transactioncreate/qris', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
        body: JSON.stringify({
          project: SLUG,
          api_key: APIKEY,
          amount: Number(amount),
          order_id: String(order_id),
          customer_name: String(customer_name),
          customer_phone: customer_phone ? String(customer_phone) : '',
        }),
      });
      const text = await pkRes.text();
      let data;
      try { data = JSON.parse(text); } catch { data = { raw: text }; }
      // Return semua field agar frontend bisa detect
      return res.status(200).json({ _status: pkRes.status, ...data });
    } catch (err) {
      return res.status(500).json({ error: err.message });
    }
  }

  // GET — cek status
  if (req.method === 'GET') {
    const { order_id, amount } = req.query || {};
    if (!order_id || !amount) {
      return res.status(400).json({ error: 'Missing params', required: ['order_id','amount'] });
    }
    try {
      const url = `https://app.pakasir.com/api/transactiondetail?project=${encodeURIComponent(SLUG)}&amount=${encodeURIComponent(amount)}&order_id=${encodeURIComponent(order_id)}&api_key=${encodeURIComponent(APIKEY)}`;
      const pkRes = await fetch(url, { headers: { 'Accept': 'application/json' } });
      const text = await pkRes.text();
      let data;
      try { data = JSON.parse(text); } catch { data = { raw: text }; }
      return res.status(200).json({ _status: pkRes.status, ...data });
    } catch (err) {
      return res.status(500).json({ error: err.message });
    }
  }

  return res.status(405).json({ error: 'Method not allowed' });
}

export default async function handler(req, res) {
  // CORS — allow from anywhere (restrict to your domain in production)
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();

  const SLUG   = process.env.PK_SLUG;
  const APIKEY = process.env.PK_APIKEY;

  if (!SLUG || !APIKEY) {
    return res.status(500).json({ error: 'Pakasir credentials not set in env' });
  }

  // POST /api/payment?action=create — buat QRIS baru
  if (req.method === 'POST') {
    const { amount, order_id, customer_name, customer_phone } = req.body;

    try {
      const pkRes = await fetch('https://app.pakasir.com/api/transactioncreate/qris', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          project: SLUG,
          api_key: APIKEY,
          amount,
          order_id,
          customer_name,
          customer_phone,
        }),
      });

      const data = await pkRes.json();
      return res.status(200).json(data);
    } catch (err) {
      return res.status(500).json({ error: 'Failed to create QRIS', detail: err.message });
    }
  }

  // GET /api/payment?order_id=xxx&amount=xxx — cek status
  if (req.method === 'GET') {
    const { order_id, amount } = req.query;

    try {
      const url = `https://app.pakasir.com/api/transactiondetail?project=${encodeURIComponent(SLUG)}&amount=${amount}&order_id=${encodeURIComponent(order_id)}&api_key=${encodeURIComponent(APIKEY)}`;
      const pkRes = await fetch(url);
      const data = await pkRes.json();
      return res.status(200).json(data);
    } catch (err) {
      return res.status(500).json({ error: 'Failed to check status', detail: err.message });
    }
  }

  return res.status(405).json({ error: 'Method not allowed' });
}

export default async function handler(req, res) {
  // CORS — allow from anywhere (restrict to your domain in production)
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();

  const SLUG   = process.env.PK_SLUG || 'xzrinx';
  const APIKEY = process.env.PK_APIKEY || 'xtD5iywEs2Df8HsoY0VFQ1n9oLgfTtKb';

  if (!SLUG || !APIKEY) {
    return res.status(500).json({ 
      error: 'Pakasir credentials not set in env',
      slugExists: !!SLUG,
      apikeyExists: !!APIKEY
    });
  }

  // POST /api/payment — buat QRIS baru
  if (req.method === 'POST') {
    const { amount, order_id, customer_name, customer_phone } = req.body;

    // Validasi input
    if (!amount || !order_id || !customer_name) {
      return res.status(400).json({ 
        error: 'Missing required fields',
        required: ['amount', 'order_id', 'customer_name']
      });
    }

    try {
      console.log('Creating QRIS:', { amount, order_id, customer_name, customer_phone });
      
      const pkRes = await fetch('https://app.pakasir.com/api/transactioncreate/qris', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({
          project: SLUG,
          api_key: APIKEY,
          amount: Number(amount),
          order_id: String(order_id),
          customer_name: String(customer_name),
          customer_phone: customer_phone ? String(customer_phone) : ''
        }),
      });

      const data = await pkRes.json();
      
      // Log response dari Pakasir untuk debugging
      console.log('Pakasir response:', data);

      // Return response dengan status yang sesuai
      return res.status(pkRes.ok ? 200 : 400).json(data);
      
    } catch (err) {
      console.error('Error creating QRIS:', err);
      return res.status(500).json({ 
        error: 'Failed to create QRIS', 
        detail: err.message 
      });
    }
  }

  // GET /api/payment — cek status transaksi
  if (req.method === 'GET') {
    const { order_id, amount } = req.query;

    // Validasi query parameters
    if (!order_id || !amount) {
      return res.status(400).json({ 
        error: 'Missing required query parameters',
        required: ['order_id', 'amount']
      });
    }

    try {
      console.log('Checking status:', { order_id, amount });
      
      const url = `https://app.pakasir.com/api/transactiondetail?project=${encodeURIComponent(SLUG)}&amount=${encodeURIComponent(amount)}&order_id=${encodeURIComponent(order_id)}&api_key=${encodeURIComponent(APIKEY)}`;
      
      const pkRes = await fetch(url, {
        headers: {
          'Accept': 'application/json'
        }
      });
      
      const data = await pkRes.json();
      
      // Log response untuk debugging
      console.log('Status check response:', data);
      
      return res.status(pkRes.ok ? 200 : 400).json(data);
      
    } catch (err) {
      console.error('Error checking status:', err);
      return res.status(500).json({ 
        error: 'Failed to check status', 
        detail: err.message 
      });
    }
  }

  // Method tidak diizinkan
  return res.status(405).json({ 
    error: 'Method not allowed',
    allowedMethods: ['GET', 'POST', 'OPTIONS']
  });
}

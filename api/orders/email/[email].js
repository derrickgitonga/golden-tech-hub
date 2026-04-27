import { sql } from '../../_db.js';

export default async function handler(req, res) {
    if (req.method !== 'GET') {
        return res.status(405).json({ error: 'Method Not Allowed' });
    }

    const { email } = req.query;

    try {
        const orders = await sql`
            SELECT * FROM orders WHERE customer_email = ${decodeURIComponent(email)} ORDER BY created_at DESC
        `;
        orders.forEach(o => { o.items = JSON.parse(o.items); });
        res.json(orders);
    } catch (err) {
        console.error('Fetch orders by email error:', err);
        res.status(500).json({ error: 'Failed to fetch orders' });
    }
}

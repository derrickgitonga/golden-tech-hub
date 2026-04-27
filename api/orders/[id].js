import { sql } from '../_db.js';

export default async function handler(req, res) {
    const { id } = req.query;

    if (req.method === 'GET') {
        try {
            const [order] = await sql`SELECT * FROM orders WHERE id = ${id}`;
            if (!order) return res.status(404).json({ error: 'Order not found' });
            order.items = JSON.parse(order.items);
            return res.json(order);
        } catch (err) {
            console.error('Fetch order error:', err);
            return res.status(500).json({ error: 'Failed to fetch order' });
        }
    }

    res.status(405).json({ error: 'Method Not Allowed' });
}

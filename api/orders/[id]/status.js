import { sql } from '../../_db.js';

export default async function handler(req, res) {
    if (req.method !== 'PATCH') {
        return res.status(405).json({ error: 'Method Not Allowed' });
    }

    const { id } = req.query;
    const { status } = req.body;

    if (!status) return res.status(400).json({ error: 'Missing status' });

    try {
        const [order] = await sql`
            UPDATE orders SET status = ${status} WHERE id = ${id} RETURNING *
        `;
        if (!order) return res.status(404).json({ error: 'Order not found' });
        order.items = JSON.parse(order.items);
        res.json(order);
    } catch (err) {
        console.error('Update order status error:', err);
        res.status(500).json({ error: 'Failed to update order status' });
    }
}

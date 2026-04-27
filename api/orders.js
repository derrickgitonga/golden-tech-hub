import { sql } from './_db.js';

export default async function handler(req, res) {
    if (req.method === 'GET') {
        try {
            const orders = await sql`SELECT * FROM orders ORDER BY created_at DESC`;
            orders.forEach(o => { o.items = JSON.parse(o.items); });
            return res.json(orders);
        } catch (err) {
            console.error('Fetch orders error:', err);
            return res.status(500).json({ error: 'Failed to fetch orders' });
        }
    }

    if (req.method === 'POST') {
        const { customer_email, customer_phone, total_amount, status, items, payment_method } = req.body;

        if (!customer_email || !total_amount || !items || !payment_method) {
            return res.status(400).json({ error: 'Missing required fields' });
        }

        try {
            const [order] = await sql`
                INSERT INTO orders (customer_email, customer_phone, total_amount, status, items, payment_method)
                VALUES (
                    ${customer_email},
                    ${customer_phone ?? null},
                    ${total_amount},
                    ${status ?? 'pending'},
                    ${JSON.stringify(items)},
                    ${payment_method}
                )
                RETURNING *
            `;
            order.items = JSON.parse(order.items);
            return res.status(201).json(order);
        } catch (err) {
            console.error('Create order error:', err);
            return res.status(500).json({ error: 'Failed to create order' });
        }
    }

    res.status(405).json({ error: 'Method Not Allowed' });
}

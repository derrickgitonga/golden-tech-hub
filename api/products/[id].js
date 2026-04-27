import { sql } from '../_db.js';

export default async function handler(req, res) {
    if (req.method !== 'DELETE') {
        return res.status(405).json({ error: 'Method Not Allowed' });
    }

    const { id } = req.query;

    try {
        const [deleted] = await sql`DELETE FROM products WHERE id = ${id} RETURNING id`;
        if (!deleted) return res.status(404).json({ error: 'Product not found' });
        res.json({ success: true });
    } catch (err) {
        console.error('Delete product error:', err);
        res.status(500).json({ error: 'Failed to delete product' });
    }
}

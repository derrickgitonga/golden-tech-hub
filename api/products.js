import { sql } from './_db.js';

export default async function handler(req, res) {
    if (req.method === 'GET') {
        try {
            const products = await sql`SELECT * FROM products ORDER BY created_at DESC`;
            products.forEach(p => {
                p.images = JSON.parse(p.images || '[]');
                p.features = JSON.parse(p.features || '[]');
            });
            return res.json(products);
        } catch (err) {
            console.error('Fetch products error:', err);
            return res.status(500).json({ error: 'Failed to fetch products' });
        }
    }

    if (req.method === 'POST') {
        const { name, brand, price, original_price, rating, reviews, images, badge, category, description, features } = req.body;

        if (!name || !brand || !price || !images?.length) {
            return res.status(400).json({ error: 'Missing required fields' });
        }

        try {
            const [product] = await sql`
                INSERT INTO products (name, brand, price, original_price, rating, reviews, images, badge, category, description, features)
                VALUES (
                    ${name},
                    ${brand},
                    ${price},
                    ${original_price ?? null},
                    ${rating ?? 5},
                    ${reviews ?? 0},
                    ${JSON.stringify(images)},
                    ${badge ?? null},
                    ${category ?? 'smartphones'},
                    ${description ?? null},
                    ${JSON.stringify(features ?? [])}
                )
                RETURNING *
            `;
            product.images = JSON.parse(product.images);
            product.features = JSON.parse(product.features || '[]');
            return res.status(201).json(product);
        } catch (err) {
            console.error('Create product error:', err);
            return res.status(500).json({ error: 'Failed to create product' });
        }
    }

    res.status(405).json({ error: 'Method Not Allowed' });
}

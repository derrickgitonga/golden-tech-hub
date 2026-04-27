import { sql } from './_db.js';

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method Not Allowed — use POST' });
    }

    const secret = req.headers['x-migrate-secret'];
    if (!secret || secret !== process.env.MIGRATE_SECRET) {
        return res.status(401).json({ error: 'Unauthorized — set MIGRATE_SECRET env var and pass it as X-Migrate-Secret header' });
    }

    try {
        await sql`
            CREATE TABLE IF NOT EXISTS orders (
                id             SERIAL PRIMARY KEY,
                created_at     TIMESTAMPTZ NOT NULL DEFAULT NOW(),
                customer_email TEXT        NOT NULL,
                customer_phone TEXT,
                total_amount   DECIMAL(10,2) NOT NULL,
                status         TEXT        NOT NULL DEFAULT 'pending',
                items          TEXT        NOT NULL,
                payment_method TEXT        NOT NULL
            )
        `;

        await sql`
            CREATE TABLE IF NOT EXISTS products (
                id             SERIAL PRIMARY KEY,
                created_at     TIMESTAMPTZ NOT NULL DEFAULT NOW(),
                name           TEXT        NOT NULL,
                brand          TEXT        NOT NULL,
                price          DECIMAL(10,2) NOT NULL,
                original_price DECIMAL(10,2),
                rating         DECIMAL(3,2) DEFAULT 5,
                reviews        INTEGER     DEFAULT 0,
                images         TEXT        NOT NULL DEFAULT '[]',
                badge          TEXT,
                category       TEXT        DEFAULT 'smartphones',
                description    TEXT,
                features       TEXT        DEFAULT '[]'
            )
        `;

        res.json({ ok: true, message: 'Schema created (or already existed).' });
    } catch (err) {
        console.error('Migration error:', err);
        res.status(500).json({ error: err.message });
    }
}

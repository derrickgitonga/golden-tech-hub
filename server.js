import express from 'express';
import cors from 'cors';
import compression from 'compression';
import path from 'path';
import { fileURLToPath } from 'url';
import axios from 'axios';
import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
import fs from 'fs';
import Database from 'better-sqlite3';
import Stripe from 'stripe';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ─── SQLite setup ───────────────────────────────────────────────────────────
const db = new Database(path.join(__dirname, 'data.db'));
db.pragma('journal_mode = WAL');

db.exec(`
    CREATE TABLE IF NOT EXISTS orders (
        id           INTEGER PRIMARY KEY AUTOINCREMENT,
        created_at   TEXT    NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')),
        customer_email TEXT  NOT NULL,
        customer_phone TEXT,
        total_amount REAL    NOT NULL,
        status       TEXT    NOT NULL DEFAULT 'pending',
        items        TEXT    NOT NULL,
        payment_method TEXT  NOT NULL
    );

    CREATE TABLE IF NOT EXISTS products (
        id             INTEGER PRIMARY KEY AUTOINCREMENT,
        created_at     TEXT    NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')),
        name           TEXT    NOT NULL,
        brand          TEXT    NOT NULL,
        price          REAL    NOT NULL,
        original_price REAL,
        rating         REAL    DEFAULT 5,
        reviews        INTEGER DEFAULT 0,
        images         TEXT    NOT NULL,
        badge          TEXT,
        category       TEXT    DEFAULT 'smartphones',
        description    TEXT,
        features       TEXT
    );
`);

// ─── Express setup ───────────────────────────────────────────────────────────
const app = express();
app.use(compression());
app.use(cors());
app.use(express.json());

app.use(express.static(path.join(__dirname, 'dist'), {
    maxAge: '1y',
    etag: false
}));

const PORT = 3000;

const logError = (message, error) => {
    const logMessage = `${new Date().toISOString()} - ${message}: ${JSON.stringify(error, null, 2)}\n`;
    console.error(message, error);
    fs.appendFileSync('server.log', logMessage);
};

// ─── M-Pesa credentials ──────────────────────────────────────────────────────
const CONSUMER_KEY = process.env.MPESA_CONSUMER_KEY;
const CONSUMER_SECRET = process.env.MPESA_CONSUMER_SECRET;
const PASSKEY = process.env.MPESA_PASSKEY;
const SHORTCODE = process.env.MPESA_SHORTCODE;

// ─── Email transporter ───────────────────────────────────────────────────────
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});

// ─── M-Pesa access token middleware ──────────────────────────────────────────
const getAccessToken = async (req, res, next) => {
    try {
        const auth = Buffer.from(`${CONSUMER_KEY}:${CONSUMER_SECRET}`).toString('base64');
        const url = 'https://api.safaricom.co.ke/oauth/v1/generate?grant_type=client_credentials';
        const response = await axios.get(url, { headers: { Authorization: `Basic ${auth}` } });
        req.accessToken = response.data.access_token;
        next();
    } catch (error) {
        const errorDetails = error.response ? error.response.data : error.message;
        logError('Access Token Error', errorDetails);
        res.status(500).json({ error: 'Failed to get access token', details: errorDetails });
    }
};

// ─── Stripe: create payment intent ───────────────────────────────────────────
app.post('/api/create-payment-intent', async (req, res) => {
    if (!process.env.STRIPE_SECRET_KEY) {
        return res.status(503).json({ error: 'Payment service not configured' });
    }

    const { items } = req.body;
    if (!Array.isArray(items) || items.length === 0) {
        return res.status(400).json({ error: 'Invalid items' });
    }

    let amount;
    try {
        amount = Math.round(
            items.reduce((sum, item) => {
                const price = parseFloat(item.price);
                const qty = parseInt(item.quantity, 10);
                if (!isFinite(price) || !isFinite(qty) || price <= 0 || qty <= 0) {
                    throw new RangeError('Invalid item price or quantity');
                }
                return sum + price * qty;
            }, 0) * 100
        );
    } catch (validationError) {
        return res.status(400).json({ error: validationError.message });
    }

    if (amount < 50) {
        return res.status(400).json({ error: 'Order total is below the minimum charge amount ($0.50)' });
    }

    try {
        const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
        const paymentIntent = await stripe.paymentIntents.create({
            amount,
            currency: 'usd',
            automatic_payment_methods: { enabled: true },
        });
        res.json({ clientSecret: paymentIntent.client_secret });
    } catch (error) {
        const message = error?.message ?? 'Unknown error';
        logError('Stripe PaymentIntent Error', { message, code: error?.code });
        res.status(500).json({ error: 'Failed to initialize payment' });
    }
});

// ─── Orders REST API ──────────────────────────────────────────────────────────
app.post('/api/orders', (req, res) => {
    const { customer_email, customer_phone, total_amount, status, items, payment_method } = req.body;

    if (!customer_email || !total_amount || !items || !payment_method) {
        return res.status(400).json({ error: 'Missing required fields' });
    }

    try {
        const stmt = db.prepare(`
            INSERT INTO orders (customer_email, customer_phone, total_amount, status, items, payment_method)
            VALUES (?, ?, ?, ?, ?, ?)
        `);
        const result = stmt.run(
            customer_email,
            customer_phone ?? null,
            total_amount,
            status ?? 'pending',
            JSON.stringify(items),
            payment_method
        );
        const order = db.prepare('SELECT * FROM orders WHERE id = ?').get(result.lastInsertRowid);
        order.items = JSON.parse(order.items);
        res.status(201).json(order);
    } catch (error) {
        logError('Create order error', error);
        res.status(500).json({ error: 'Failed to create order' });
    }
});

app.get('/api/orders', (_req, res) => {
    try {
        const orders = db.prepare('SELECT * FROM orders ORDER BY created_at DESC').all();
        orders.forEach(o => { o.items = JSON.parse(o.items); });
        res.json(orders);
    } catch (error) {
        logError('Fetch orders error', error);
        res.status(500).json({ error: 'Failed to fetch orders' });
    }
});

// Must come before /api/orders/:id
app.get('/api/orders/email/:email', (req, res) => {
    try {
        const orders = db.prepare(
            'SELECT * FROM orders WHERE customer_email = ? ORDER BY created_at DESC'
        ).all(req.params.email);
        orders.forEach(o => { o.items = JSON.parse(o.items); });
        res.json(orders);
    } catch (error) {
        logError('Fetch orders by email error', error);
        res.status(500).json({ error: 'Failed to fetch orders' });
    }
});

app.get('/api/orders/:id', (req, res) => {
    try {
        const order = db.prepare('SELECT * FROM orders WHERE id = ?').get(req.params.id);
        if (!order) return res.status(404).json({ error: 'Order not found' });
        order.items = JSON.parse(order.items);
        res.json(order);
    } catch (error) {
        logError('Fetch order error', error);
        res.status(500).json({ error: 'Failed to fetch order' });
    }
});

app.patch('/api/orders/:id/status', (req, res) => {
    const { status } = req.body;
    if (!status) return res.status(400).json({ error: 'Missing status' });

    try {
        const result = db.prepare('UPDATE orders SET status = ? WHERE id = ?').run(status, req.params.id);
        if (result.changes === 0) return res.status(404).json({ error: 'Order not found' });
        const order = db.prepare('SELECT * FROM orders WHERE id = ?').get(req.params.id);
        order.items = JSON.parse(order.items);
        res.json(order);
    } catch (error) {
        logError('Update order status error', error);
        res.status(500).json({ error: 'Failed to update order status' });
    }
});

// ─── Products REST API ────────────────────────────────────────────────────────
app.get('/api/products', (_req, res) => {
    try {
        const products = db.prepare('SELECT * FROM products ORDER BY created_at DESC').all();
        products.forEach(p => {
            p.images = JSON.parse(p.images || '[]');
            p.features = JSON.parse(p.features || '[]');
        });
        res.json(products);
    } catch (error) {
        logError('Fetch products error', error);
        res.status(500).json({ error: 'Failed to fetch products' });
    }
});

app.post('/api/products', (req, res) => {
    const { name, brand, price, original_price, rating, reviews, images, badge, category, description, features } = req.body;

    if (!name || !brand || !price || !images?.length) {
        return res.status(400).json({ error: 'Missing required fields' });
    }

    try {
        const stmt = db.prepare(`
            INSERT INTO products (name, brand, price, original_price, rating, reviews, images, badge, category, description, features)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `);
        const result = stmt.run(
            name, brand, price, original_price ?? null,
            rating ?? 5, reviews ?? 0,
            JSON.stringify(images), badge ?? null,
            category ?? 'smartphones', description ?? null,
            JSON.stringify(features ?? [])
        );
        const product = db.prepare('SELECT * FROM products WHERE id = ?').get(result.lastInsertRowid);
        product.images = JSON.parse(product.images);
        product.features = JSON.parse(product.features || '[]');
        res.status(201).json(product);
    } catch (error) {
        logError('Create product error', error);
        res.status(500).json({ error: 'Failed to create product' });
    }
});

app.delete('/api/products/:id', (req, res) => {
    try {
        const result = db.prepare('DELETE FROM products WHERE id = ?').run(req.params.id);
        if (result.changes === 0) return res.status(404).json({ error: 'Product not found' });
        res.json({ success: true });
    } catch (error) {
        logError('Delete product error', error);
        res.status(500).json({ error: 'Failed to delete product' });
    }
});

// ─── M-Pesa STK Push ─────────────────────────────────────────────────────────
app.post('/api/stkpush', getAccessToken, async (req, res) => {
    const { phoneNumber, amount, accountReference, transactionDesc } = req.body;
    const timestamp = new Date().toISOString().replace(/[^0-9]/g, '').slice(0, -3);
    const password = Buffer.from(`${SHORTCODE}${PASSKEY}${timestamp}`).toString('base64');

    try {
        const callbackUrl = process.env.MPESA_CALLBACK_URL || 'https://mydomain.com/path';
        const response = await axios.post(
            'https://api.safaricom.co.ke/mpesa/stkpush/v1/processrequest',
            {
                BusinessShortCode: SHORTCODE,
                Password: password,
                Timestamp: timestamp,
                TransactionType: 'CustomerPayBillOnline',
                Amount: amount,
                PartyA: phoneNumber,
                PartyB: SHORTCODE,
                PhoneNumber: phoneNumber,
                CallBackURL: callbackUrl,
                AccountReference: accountReference,
                TransactionDesc: transactionDesc,
            },
            { headers: { Authorization: `Bearer ${req.accessToken}` } }
        );
        res.json(response.data);
    } catch (error) {
        const errorDetails = error.response ? error.response.data : error.message;
        logError('STK Push Error', errorDetails);
        res.status(500).json({ error: 'Failed to initiate STK Push', details: errorDetails });
    }
});

// ─── Send Email ───────────────────────────────────────────────────────────────
app.post('/api/send-email', async (req, res) => {
    const { type, email, address, items, total, orderId, paymentMethod, status } = req.body;

    let subject = '';
    let htmlContent = '';

    if (type === 'status_update') {
        subject = `Order Status Update #${orderId}`;
        htmlContent = `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                <h1 style="color: #D4AF37;">Order Status Update</h1>
                <p>Hello,</p>
                <p>The status of your order <strong>#${orderId}</strong> has been updated to:</p>
                <div style="background: #f9f9f9; padding: 20px; border-radius: 8px; margin: 20px 0; text-align: center;">
                    <h2 style="color: #333; text-transform: uppercase;">${status}</h2>
                </div>
                <p>If you have any questions, please contact our support team.</p>
                <p>Best regards,<br>Back Market Team</p>
            </div>
        `;
    } else {
        const baseUrl = process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : 'http://localhost:3000';

        const itemsHtml = items.map(item => {
            let imageUrl = item.image;
            if (imageUrl && imageUrl.startsWith('/')) {
                imageUrl = baseUrl.includes('localhost')
                    ? `https://placehold.co/100x100/D4AF37/ffffff?text=${encodeURIComponent(item.name)}`
                    : `${baseUrl}${imageUrl}`;
            }
            return `
            <div style="border-bottom: 1px solid #eee; padding: 10px 0; display: flex; align-items: center; gap: 15px;">
                <img src="${imageUrl}" alt="${item.name}" style="width: 60px; height: 60px; object-fit: cover; border-radius: 4px;" />
                <div>
                    <p style="margin: 0 0 5px 0;"><strong>${item.name}</strong></p>
                    <p style="margin: 0; color: #666;">Qty: ${item.quantity} | Price: $${item.price.toLocaleString()}</p>
                </div>
            </div>`;
        }).join('');

        const productNames = items.map(i => i.name).join(', ');

        htmlContent = `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                <h1 style="color: #D4AF37;">Order Confirmed!</h1>
                <p>Thank you for your purchase. Here are your order details:</p>
                <div style="background: #f9f9f9; padding: 20px; border-radius: 8px; margin: 20px 0;">
                    <h3>Order #${orderId}</h3>
                    <p>Payment Method: ${paymentMethod}</p>
                    <p><strong>Delivery Address:</strong> ${address || 'Not provided'}</p>
                    <div style="margin-top: 20px;">${itemsHtml}</div>
                    <div style="border-top: 2px solid #D4AF37; margin-top: 20px; padding-top: 10px;">
                        <h3>Total: $${total.toLocaleString()}</h3>
                    </div>
                </div>
                <div style="background: #e8f5e9; padding: 15px; border-radius: 8px; margin: 20px 0; border-left: 5px solid #4caf50;">
                    <p style="font-size: 16px; line-height: 1.5;">
                        Your product <strong>${productNames}</strong> Disbursement is in progress and shipping to <strong>${address || 'your address'}</strong> will be done in 15 days.
                    </p>
                </div>
                <p>We will notify you when your order ships.</p>
                <p>Best regards,<br>Back Market Team</p>
            </div>
        `;

        const approveLink = `${baseUrl}/api/approve-order?orderId=${orderId}`;
        const adminMailOptions = {
            from: 'Back Market <backmarket.assistant@gmail.com>',
            to: 'backmarket.assistant@gmail.com',
            subject: `[ADMIN] New Order #${orderId}`,
            html: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                    <h1 style="color: #D4AF37;">New Order Received!</h1>
                    <p>Order #${orderId} has been placed.</p>
                    <p><strong>Total:</strong> $${total ? total.toLocaleString() : '0'}</p>
                    <p><strong>Payment:</strong> ${paymentMethod}</p>
                    <div style="margin: 30px 0; text-align: center;">
                        <a href="${approveLink}" style="background-color: #4CAF50; color: white; padding: 14px 25px; text-align: center; text-decoration: none; display: inline-block; border-radius: 4px; font-size: 16px;">
                            Approve Order
                        </a>
                    </div>
                    <p>Clicking approve will set status to "Approved, Shipping in progress".</p>
                </div>
            `
        };

        try {
            await transporter.sendMail(adminMailOptions);
        } catch (err) {
            logError('Admin Email Failed', err);
        }
    }

    const mailOptions = {
        from: 'Back Market <backmarket.assistant@gmail.com>',
        to: email,
        subject,
        html: htmlContent
    };

    try {
        await transporter.sendMail(mailOptions);
        res.json({ message: 'Email sent successfully' });
    } catch (error) {
        logError('Email Error', error);
        res.status(500).json({ error: 'Failed to send email' });
    }
});

// ─── Approve Order (email link) ───────────────────────────────────────────────
app.get('/api/approve-order', async (req, res) => {
    const { orderId } = req.query;
    if (!orderId) return res.status(400).send('Missing orderId');

    try {
        const order = db.prepare('SELECT * FROM orders WHERE id = ?').get(orderId);
        if (!order) return res.status(404).send('Order not found');

        db.prepare("UPDATE orders SET status = 'Approved, Shipping in progress' WHERE id = ?").run(orderId);

        const baseUrl = process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : 'http://localhost:3000';
        await axios.post(`${baseUrl}/api/send-email`, {
            type: 'status_update',
            email: order.customer_email,
            orderId,
            status: 'Approved, Shipping in progress'
        });

        res.send(`
            <html>
            <body style="font-family: Arial, sans-serif; text-align: center; padding: 50px;">
                <h1 style="color: green;">Order #${orderId} Approved!</h1>
                <p>Status updated to "Approved, Shipping in progress".</p>
                <p>The customer has been notified via email.</p>
                <p>You can close this window.</p>
            </body>
            </html>
        `);
    } catch (error) {
        console.error('Error approving order:', error);
        res.status(500).send(`Failed to approve order: ${error.message}`);
    }
});

// ─── SPA fallback ─────────────────────────────────────────────────────────────
app.get('*', (_req, res) => {
    res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});

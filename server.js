import express from 'express';
import cors from 'cors';
import axios from 'axios';
import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
import fs from 'fs';
import { createClient } from '@supabase/supabase-js';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const PORT = 3000;

const logError = (message, error) => {
    const logMessage = `${new Date().toISOString()} - ${message}: ${JSON.stringify(error, null, 2)}\n`;
    console.error(message, error);
    fs.appendFileSync('server.log', logMessage);
};

// M-Pesa Credentials
const CONSUMER_KEY = process.env.MPESA_CONSUMER_KEY;
const CONSUMER_SECRET = process.env.MPESA_CONSUMER_SECRET;
const PASSKEY = process.env.MPESA_PASSKEY; // Sandbox Passkey
const SHORTCODE = process.env.MPESA_SHORTCODE; // Sandbox Shortcode

// Email Transporter
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});

// Middleware to get Access Token
const getAccessToken = async (req, res, next) => {
    try {
        const auth = Buffer.from(`${CONSUMER_KEY}:${CONSUMER_SECRET}`).toString('base64');
        const response = await axios.get(
            'https://sandbox.safaricom.co.ke/oauth/v1/generate?grant_type=client_credentials',
            {
                headers: {
                    Authorization: `Basic ${auth}`,
                },
            }
        );
        req.accessToken = response.data.access_token;
        next();
    } catch (error) {
        const errorDetails = error.response ? error.response.data : error.message;
        logError('Access Token Error', errorDetails);
        res.status(500).json({ error: 'Failed to get access token', details: errorDetails });
    }
};

// STK Push Endpoint
app.post('/api/stkpush', getAccessToken, async (req, res) => {
    const { phoneNumber, amount, accountReference, transactionDesc } = req.body;

    const timestamp = new Date().toISOString().replace(/[^0-9]/g, '').slice(0, -3);
    const password = Buffer.from(`${SHORTCODE}${PASSKEY}${timestamp}`).toString('base64');

    try {
        const response = await axios.post(
            'https://sandbox.safaricom.co.ke/mpesa/stkpush/v1/processrequest',
            {
                BusinessShortCode: SHORTCODE,
                Password: password,
                Timestamp: timestamp,
                TransactionType: 'CustomerPayBillOnline',
                Amount: amount,
                PartyA: phoneNumber,
                PartyB: SHORTCODE,
                PhoneNumber: phoneNumber,
                CallBackURL: 'https://mydomain.com/path', // Replace with your callback URL
                AccountReference: accountReference,
                TransactionDesc: transactionDesc,
            },
            {
                headers: {
                    Authorization: `Bearer ${req.accessToken}`,
                },
            }
        );

        res.json(response.data);
    } catch (error) {
        const errorDetails = error.response ? error.response.data : error.message;
        logError('STK Push Error', errorDetails);
        res.status(500).json({ error: 'Failed to initiate STK Push', details: errorDetails });
    }
});

// Send Email Endpoint
// Send Email Endpoint
// Send Email Endpoint
app.post('/api/send-email', async (req, res) => {
    const { type, email, items, total, orderId, paymentMethod, status } = req.body;

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
                <p>Best regards,<br>Golden Tech Hub Team</p>
            </div>
        `;
    } else {
        // Default to Order Confirmation
        subject = `Order Confirmation #${orderId}`;
        const itemsHtml = items.map(item => `
            <div style="border-bottom: 1px solid #eee; padding: 10px 0;">
                <p><strong>${item.name}</strong></p>
                <p>Quantity: ${item.quantity}</p>
                <p>Price: $${item.price.toLocaleString()}</p>
            </div>
        `).join('');

        htmlContent = `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                <h1 style="color: #D4AF37;">Order Confirmed!</h1>
                <p>Thank you for your purchase. Here are your order details:</p>
                
                <div style="background: #f9f9f9; padding: 20px; border-radius: 8px; margin: 20px 0;">
                    <h3>Order #${orderId}</h3>
                    <p>Payment Method: ${paymentMethod}</p>
                    <div style="margin-top: 20px;">
                        ${itemsHtml}
                    </div>
                    <div style="border-top: 2px solid #D4AF37; margin-top: 20px; padding-top: 10px;">
                        <h3>Total: $${total.toLocaleString()}</h3>
                    </div>
                </div>
                
                <p>We will notify you when your order ships.</p>
                <p>Best regards,<br>Golden Tech Hub Team</p>
            </div>
        `;

        // Send Admin Email
        console.log('Attempting to send Admin Email...');
        const baseUrl = process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : 'http://localhost:3000';
        const approveLink = `${baseUrl}/api/approve-order?orderId=${orderId}`;

        const adminMailOptions = {
            from: 'Golden Tech Hub <backmarket.assistant@gmail.com>',
            to: 'backmarket.assistant@gmail.com', // Admin email
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

        // Send admin email and log result
        try {
            await transporter.sendMail(adminMailOptions);
            console.log('Admin Email Sent Successfully');
        } catch (err) {
            console.error('Admin Email Failed:', err);
            logError('Admin Email Failed', err);
        }
    }

    const mailOptions = {
        from: 'Golden Tech Hub <backmarket.assistant@gmail.com>',
        to: email,
        subject: subject,
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

// Approve Order Endpoint
const supabase = createClient(process.env.VITE_SUPABASE_URL, process.env.VITE_SUPABASE_ANON_KEY);

app.get('/api/approve-order', async (req, res) => {
    const { orderId } = req.query;

    if (!orderId) {
        return res.status(400).send('Missing orderId');
    }

    try {
        const { error } = await supabase
            .from('orders')
            .update({ status: 'Approved, Shipping in progress' })
            .eq('id', orderId);

        if (error) throw error;

        res.send(`
            < html >
            <body style="font-family: Arial, sans-serif; text-align: center; padding: 50px;">
                <h1 style="color: green;">Order #${orderId} Approved!</h1>
                <p>The status has been updated to "Approved, Shipping in progress".</p>
                <p>You can close this window.</p>
            </body>
            </html >
            `);
    } catch (error) {
        console.error('Error approving order:', error);
        res.status(500).send('Failed to approve order');
    }
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});

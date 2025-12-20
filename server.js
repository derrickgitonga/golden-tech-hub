import express from 'express';
import cors from 'cors';
import axios from 'axios';
import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
import fs from 'fs';

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
app.post('/api/send-email', async (req, res) => {
    const { email, items, total, orderId, paymentMethod } = req.body;

    const itemsHtml = items.map(item => `
        <div style="border-bottom: 1px solid #eee; padding: 10px 0;">
            <p><strong>${item.name}</strong></p>
            <p>Quantity: ${item.quantity}</p>
            <p>Price: $${item.price.toLocaleString()}</p>
        </div>
    `).join('');

    const mailOptions = {
        from: 'Golden Tech Hub <backmarket.assistant@gmail.com>',
        to: email,
        subject: `Order Confirmation #${orderId}`,
        html: `
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
        `
    };

    try {
        await transporter.sendMail(mailOptions);
        res.json({ message: 'Email sent successfully' });
    } catch (error) {
        logError('Email Error', error);
        res.status(500).json({ error: 'Failed to send email' });
    }
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});

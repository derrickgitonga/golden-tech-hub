import express from 'express';
import cors from 'cors';
import axios from 'axios';

const app = express();
app.use(cors());
app.use(express.json());

const PORT = 3000;

// M-Pesa Credentials
const CONSUMER_KEY = 'tPzUUK8zUELnE7C6faNEU2GU6B2zwUcacvR2myXeN24bPBWt';
const CONSUMER_SECRET = 'dh4F031FqyMZGgudBVFnFwYoZFVGRAzDzQ71Q0lzoYn204wCZ7qHmzcMlH8D1GjM';
const PASSKEY = 'bfb279f9aa9bdbcf158e97dd71a467cd2e0c893059b10f78e6b72ada1ed2c919'; // Sandbox Passkey
const SHORTCODE = '174379'; // Sandbox Shortcode

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
        console.error('Access Token Error:', error.response ? error.response.data : error.message);
        );

res.json(response.data);
    } catch (error) {
    console.error('STK Push Error:', error.response ? error.response.data : error.message);
    res.status(500).json({ error: 'Failed to initiate STK Push', details: error.response ? error.response.data : error.message });
}
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});

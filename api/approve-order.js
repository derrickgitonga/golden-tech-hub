import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

export default async function handler(req, res) {
    if (req.method !== 'GET') {
        return res.status(405).send('Method Not Allowed');
    }

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
            <html>
                <body style="font-family: Arial, sans-serif; text-align: center; padding: 50px;">
                    <h1 style="color: green;">Order #${orderId} Approved!</h1>
                    <p>The status has been updated to "Approved, Shipping in progress".</p>
                    <p>You can close this window.</p>
                </body>
            </html>
        `);
    } catch (error) {
        console.error('Error approving order:', error);
        res.status(500).send('Failed to approve order');
    }
}

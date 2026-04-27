import { sql } from './_db.js';
import { transporter } from './_mailer.js';

export default async function handler(req, res) {
    if (req.method !== 'GET') {
        return res.status(405).send('Method Not Allowed');
    }

    const { orderId } = req.query;
    if (!orderId) return res.status(400).send('Missing orderId');

    try {
        const [order] = await sql`SELECT * FROM orders WHERE id = ${orderId}`;
        if (!order) return res.status(404).send('Order not found');

        await sql`UPDATE orders SET status = 'Approved, Shipping in progress' WHERE id = ${orderId}`;

        // Notify customer
        try {
            await transporter.sendMail({
                from: 'Back Market <backmarket.assistant@gmail.com>',
                to: order.customer_email,
                subject: `Order Status Update #${orderId}`,
                html: `
                    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                        <h1 style="color: #D4AF37;">Order Status Update</h1>
                        <p>Hello,</p>
                        <p>The status of your order <strong>#${orderId}</strong> has been updated to:</p>
                        <div style="background: #f9f9f9; padding: 20px; border-radius: 8px; margin: 20px 0; text-align: center;">
                            <h2 style="color: #333; text-transform: uppercase;">Approved, Shipping in progress</h2>
                        </div>
                        <p>If you have any questions, please contact our support team.</p>
                        <p>Best regards,<br>Back Market Team</p>
                    </div>
                `,
            });
        } catch (emailErr) {
            console.error('Approval notification email failed:', emailErr);
        }

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
}

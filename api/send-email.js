import { transporter } from './_mailer.js';

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method Not Allowed' });
    }

    const { type, email, address, items, total, orderId, paymentMethod, status } = req.body;

    const baseUrl = process.env.VERCEL_URL
        ? `https://${process.env.VERCEL_URL}`
        : 'http://localhost:3000';

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
        subject = `Order Confirmation #${orderId}`;

        const itemsHtml = (items ?? []).map(item => {
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

        const productNames = (items ?? []).map(i => i.name).join(', ');

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
                        <h3>Total: $${(total ?? 0).toLocaleString()}</h3>
                    </div>
                </div>
                <div style="background: #e8f5e9; padding: 15px; border-radius: 8px; margin: 20px 0; border-left: 5px solid #4caf50;">
                    <p style="font-size: 16px; line-height: 1.5;">
                        Your product <strong>${productNames}</strong> disbursement is in progress and shipping to <strong>${address || 'your address'}</strong> will be done in 15 days.
                    </p>
                </div>
                <p>We will notify you when your order ships.</p>
                <p>Best regards,<br>Back Market Team</p>
            </div>
        `;

        // Admin notification
        const approveLink = `${baseUrl}/api/approve-order?orderId=${orderId}`;
        transporter.sendMail({
            from: 'Back Market <backmarket.assistant@gmail.com>',
            to: 'backmarket.assistant@gmail.com',
            subject: `[ADMIN] New Order #${orderId}`,
            html: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                    <h1 style="color: #D4AF37;">New Order Received!</h1>
                    <p>Order #${orderId} has been placed.</p>
                    <p><strong>Total:</strong> $${(total ?? 0).toLocaleString()}</p>
                    <p><strong>Payment:</strong> ${paymentMethod}</p>
                    <div style="margin: 30px 0; text-align: center;">
                        <a href="${approveLink}" style="background-color: #4CAF50; color: white; padding: 14px 25px; text-decoration: none; display: inline-block; border-radius: 4px; font-size: 16px;">
                            Approve Order
                        </a>
                    </div>
                    <p>Clicking approve will set status to "Approved, Shipping in progress".</p>
                </div>
            `,
        }).catch(err => console.error('Admin email error:', err));
    }

    try {
        await transporter.sendMail({
            from: 'Back Market <backmarket.assistant@gmail.com>',
            to: email,
            subject,
            html: htmlContent,
        });
        res.json({ message: 'Email sent successfully' });
    } catch (error) {
        console.error('Email Error:', error);
        res.status(500).json({ error: 'Failed to send email' });
    }
}

import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method Not Allowed' });
    }

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
        const itemsHtml = items ? items.map(item => `
            <div style="border-bottom: 1px solid #eee; padding: 10px 0;">
                <p><strong>${item.name}</strong></p>
                <p>Quantity: ${item.quantity}</p>
                <p>Price: $${item.price.toLocaleString()}</p>
            </div>
        `).join('') : '';

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
                        <h3>Total: $${total ? total.toLocaleString() : '0'}</h3>
                    </div>
                </div>
                
                <p>We will notify you when your order ships.</p>
                <p>Best regards,<br>Golden Tech Hub Team</p>
            </div>
        `;
        // Send Admin Email
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

        // Send admin email asynchronously
        transporter.sendMail(adminMailOptions).catch(err => console.error('Admin Email Error:', err));
    }

    const mailOptions = {
        from: 'Golden Tech Hub <backmarket.assistant@gmail.com>',
        to: email,
        subject: subject,
        html: htmlContent
    };

    try {
        await transporter.sendMail(mailOptions);
        res.status(200).json({ message: 'Email sent successfully' });
    } catch (error) {
        console.error('Email Error:', error);
        res.status(500).json({ error: 'Failed to send email' });
    }
}

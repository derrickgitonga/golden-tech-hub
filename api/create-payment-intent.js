import Stripe from 'stripe';

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method Not Allowed' });
    }

    if (!process.env.STRIPE_SECRET_KEY) {
        return res.status(503).json({ error: 'Payment service not configured' });
    }

    const { items } = req.body;

    if (!Array.isArray(items) || items.length === 0) {
        return res.status(400).json({ error: 'Invalid items' });
    }

    // Validate and calculate server-side — never trust the client total
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
            }, 0) * 100 // USD → cents
        );
    } catch (validationError) {
        // Distinguish bad client input (400) from unexpected server errors (500)
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

        res.status(200).json({ clientSecret: paymentIntent.client_secret });
    } catch (error) {
        const message = error?.message ?? 'Unknown error';
        const code = error?.code ?? null;
        console.error('Stripe PaymentIntent Error:', { message, code });
        res.status(500).json({ error: 'Failed to initialize payment' });
    }
}

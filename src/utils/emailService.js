import emailjs from '@emailjs/browser';

// These should be in your .env file
const SERVICE_ID = import.meta.env.VITE_EMAILJS_SERVICE_ID;
const TEMPLATE_ID = import.meta.env.VITE_EMAILJS_TEMPLATE_ID;
const PUBLIC_KEY = import.meta.env.VITE_EMAILJS_PUBLIC_KEY;

export const sendOrderConfirmation = async (order, user) => {
    if (!SERVICE_ID || !TEMPLATE_ID || !PUBLIC_KEY) {
        console.warn('EmailJS keys are missing. Email not sent.');
        console.log('Order Details for Email:', {
            to_name: user?.fullName || 'Customer',
            to_email: user?.primaryEmailAddress?.emailAddress,
            order_id: order.id,
            total_amount: order.total_amount,
            items: order.items?.map(item => `${item.product_name} (x${item.quantity})`).join(', ')
        });
        return { success: false, message: 'EmailJS keys missing' };
    }

    const templateParams = {
        to_name: user?.fullName || 'Customer',
        to_email: user?.primaryEmailAddress?.emailAddress,
        order_id: order.id,
        order_date: new Date().toLocaleDateString(),
        total_amount: order.total_amount.toLocaleString(), // Just number, symbol is in template
        shipping_address: `${order.shipping_address?.street}, ${order.shipping_address?.city}, ${order.shipping_address?.zip}`,
        items_list: order.items?.map(item => `${item.product_name} (x${item.quantity}) - ৳${(item.price * item.quantity).toLocaleString()}`).join('\n'),
        status: order.status
    };

    try {
        const response = await emailjs.send(SERVICE_ID, TEMPLATE_ID, templateParams, PUBLIC_KEY);
        console.log('Email sent successfully!', response.status, response.text);
        return { success: true, response };
    } catch (error) {
        console.error('Failed to send email:', error);
        return { success: false, error };
    }
};

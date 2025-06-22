# Stripe Setup Guide for Mobile App

## Quick Fix for "CARD NOT COMPLETE" Error

The error you're experiencing is because Stripe wasn't properly configured in the mobile app. Here's how to fix it:

## Step 1: Get Your Stripe Publishable Key

1. Go to your [Stripe Dashboard](https://dashboard.stripe.com/)
2. Navigate to **Developers > API keys**
3. Copy your **Publishable key** (starts with `pk_test_` for testing)

## Step 2: Configure the App

### Option A: Using Environment Variables (Recommended)

Create a `.env` file in the `zivo_mobile` directory:

```env
EXPO_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_your_actual_key_here
```

### Option B: Update app.config.js

Edit `zivo_mobile/app.config.js` and replace the placeholder key:

```javascript
extra: {
  stripePublishableKey: 'pk_test_your_actual_key_here'
}
```

## Step 3: Restart the App

After adding your Stripe key:

1. Stop the development server
2. Run `npx expo start --clear`
3. Reload the app

## Step 4: Test the Payment

1. Fill out the create form
2. Click "Payment"
3. Click "Pay with Card"
4. You should now see Stripe's payment form instead of the error

## What Was Fixed

1. **Added StripeProvider**: The app now has proper Stripe configuration
2. **Simplified Card Payment**: Removed complex card form handling
3. **Proper Error Handling**: Better error messages and flow

## Testing Cards

Use these test card numbers:
- **Success**: `4242 4242 4242 4242`
- **Decline**: `4000 0000 0000 0002`
- **Insufficient Funds**: `4000 0000 0000 9995`

## Troubleshooting

If you still get errors:

1. **Check the key**: Make sure you're using the correct publishable key
2. **Clear cache**: Run `npx expo start --clear`
3. **Check backend**: Ensure your backend Stripe configuration is correct
4. **Check logs**: Look at the console for any error messages

## Security Note

- Never use your secret key in the mobile app
- Only use the publishable key (starts with `pk_`)
- The secret key should only be used in your backend 
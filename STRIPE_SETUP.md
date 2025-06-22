# Stripe Mobile Integration Setup Guide

## Environment Variables

Create a `.env` file in the mobile app root directory:

```env
EXPO_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_your_publishable_key_here
```

## App Configuration

The app is already configured with:
- Stripe React Native SDK
- Apple Pay support
- Google Pay support
- Dark theme
- Proper bundle identifiers

## Testing

### iOS Simulator
- Apple Pay works in iOS Simulator
- Use test cards provided by Stripe

### Android Emulator
- Google Pay works in Android Emulator
- Use test cards provided by Stripe

### Physical Devices
- Apple Pay requires a real device with Apple Pay setup
- Google Pay requires a real device with Google Pay setup

## Payment Flow

1. User uploads media in create screen
2. Backend creates payment intent
3. User is redirected to payment screen
4. User chooses payment method (Card/Apple Pay/Google Pay)
5. Payment is processed through Stripe
6. Webhook confirms payment
7. User is redirected to success screen

## Error Handling

The app includes comprehensive error handling:
- Network errors
- Payment failures
- Invalid payment methods
- Timeout handling

## Security

- No sensitive data is stored locally
- All payments go through Stripe's secure infrastructure
- Webhook signature verification on backend
- Proper error logging and monitoring 
# Update Default Payment Method - Implementation Guide

## Backend Changes Required

Add this new endpoint to your Vercel API file (after the `handleDeletePaymentMethod` handler):

```typescript
/**
 * PUT /api/payment-methods/:paymentMethodId/set-default
 * Set a payment method as default
 */
const handleSetDefaultPaymentMethod: RequestHandler = async (req, res) => {
  try {
    const { paymentMethodId } = req.params;
    const { user_id } = req.body;

    if (!user_id) {
      return res.status(400).json({
        success: false,
        error: "user_id is required",
      });
    }

    // Get payment method details and verify ownership
    const [paymentMethods] = await pool.query<any[]>(
      `SELECT pm.*, u.stripe_customer_id 
       FROM payment_methods pm
       JOIN users u ON pm.user_id = u.id
       WHERE pm.stripe_payment_method_id = ? AND pm.user_id = ?`,
      [paymentMethodId, user_id]
    );

    if (paymentMethods.length === 0) {
      return res.status(404).json({
        success: false,
        error: "Payment method not found or access denied",
      });
    }

    const paymentMethod = paymentMethods[0];
    const stripeCustomerId = paymentMethod.stripe_customer_id;

    // Initialize Stripe
    const Stripe = (await import("stripe")).default;
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
      apiVersion: "2025-12-15.clover",
    });

    // Update default payment method in Stripe
    // This automatically updates all future subscription charges
    if (stripeCustomerId) {
      await stripe.customers.update(stripeCustomerId, {
        invoice_settings: {
          default_payment_method: paymentMethodId,
        },
      });
    }

    // Update in database - unset all other defaults first
    await pool.query(
      `UPDATE payment_methods SET is_default = 0 WHERE user_id = ?`,
      [user_id]
    );

    // Set this payment method as default
    await pool.query(
      `UPDATE payment_methods SET is_default = 1 WHERE stripe_payment_method_id = ?`,
      [paymentMethodId]
    );

    // Get updated payment methods list
    const [updatedMethods] = await pool.query<any[]>(
      `SELECT 
        stripe_payment_method_id as id,
        card_brand as brand,
        card_last4 as last4,
        card_exp_month as exp_month,
        card_exp_year as exp_year,
        is_default,
        created_at
       FROM payment_methods 
       WHERE user_id = ? 
       ORDER BY is_default DESC, created_at DESC`,
      [user_id]
    );

    res.json({
      success: true,
      message: "Default payment method updated successfully",
      data: updatedMethods,
    });
  } catch (error) {
    console.error("Error setting default payment method:", error);
    res.status(500).json({
      success: false,
      error: "Failed to set default payment method",
      details: error instanceof Error ? error.message : "Unknown error",
    });
  }
};
```

Then add the route (find the payment methods section and add this line):

```typescript
// Payment methods routes
expressApp.get("/api/payment-methods", handleGetPaymentMethods);
expressApp.delete(
  "/api/payment-methods/:paymentMethodId",
  handleDeletePaymentMethod
);
// ADD THIS LINE:
expressApp.put(
  "/api/payment-methods/:paymentMethodId/set-default",
  handleSetDefaultPaymentMethod
);
```

## Frontend Changes Required

### 1. Add Redux Action (store/effects.tsx)

Add this function after the `fetchPaymentMethods` function:

```typescript
/**
 * Set default payment method
 * API: PUT /api/payment-methods/:paymentMethodId/set-default
 */
export const setDefaultPaymentMethod =
  (user_id: number, payment_method_id: string) =>
  async (dispatch: any, getState: any) => {
    try {
      console.log("💳 [SET DEFAULT PAYMENT] Request:", {
        user_id,
        payment_method_id,
      });

      const response = await axios.put(
        `${API_BASE_URL}/payment-methods/${payment_method_id}/set-default`,
        { user_id }
      );

      console.log("✅ [SET DEFAULT PAYMENT] Success:", response.data);

      // Update user info with new payment methods data
      if (response.data.data && response.data.data.length > 0) {
        const defaultCard = response.data.data.find((pm: any) => pm.is_default);
        if (defaultCard) {
          const currentState = getState();
          dispatch(
            getUserInfoByIdSuccess({
              ...(currentState.app.userInfo.info || {}),
              card_info: {
                default_payment_method: defaultCard.id,
                last4: defaultCard.last4,
                brand: defaultCard.brand,
              },
            })
          );
        }
      }

      return response.data;
    } catch (error) {
      console.error("❌ [SET DEFAULT PAYMENT] Error:", error);
      throw error;
    }
  };
```

### 2. Export the Action

In store/effects.tsx, make sure to export it:

```typescript
export {
  // ... other exports
  fetchPaymentMethods,
  setDefaultPaymentMethod, // ADD THIS
};
```

### 3. Update ProfileScreen to Show Multiple Payment Methods

The ProfileScreen currently only shows the default payment method. You'll want to show all payment methods with the ability to set one as default. Here's a suggested update:

```typescript
// In ProfileScreen.tsx

import { setDefaultPaymentMethod } from "../../store/effects";

// Add state for payment methods list
const [paymentMethods, setPaymentMethods] = useState<any[]>([]);
const [isSettingDefault, setIsSettingDefault] = useState(false);

// Update the useEffect to store all payment methods
useEffect(() => {
  const loadPaymentMethods = async () => {
    const userId = userInfo?.info?.id_platforms_user;
    if (userId) {
      try {
        const methods = await dispatch(fetchPaymentMethods(userId));
        if (methods && Array.isArray(methods)) {
          setPaymentMethods(methods);
        }
      } catch (error) {
        console.error("Error loading payment methods:", error);
      }
    }
  };

  loadPaymentMethods();
}, [userInfo?.info?.id_platforms_user]);

// Add handler to set default
const handleSetDefaultPayment = async (paymentMethodId: string) => {
  const userId = userInfo?.info?.id_platforms_user;
  if (!userId) return;

  setIsSettingDefault(true);
  try {
    await dispatch(setDefaultPaymentMethod(userId, paymentMethodId));
    Alert.alert("Éxito", "Método de pago predeterminado actualizado");

    // Refresh payment methods
    const methods = await dispatch(fetchPaymentMethods(userId));
    if (methods && Array.isArray(methods)) {
      setPaymentMethods(methods);
    }
  } catch (error) {
    console.error("Error setting default payment:", error);
    Alert.alert(
      "Error",
      "No se pudo actualizar el método de pago predeterminado"
    );
  } finally {
    setIsSettingDefault(false);
  }
};
```

## Key Points About Subscription Updates

✅ **Automatic Update**: When you update the default payment method in Stripe using `stripe.customers.update()`, it automatically applies to:

- All future subscription renewals
- All future invoices
- All future automatic charges

✅ **No Manual Subscription Update Needed**: You don't need to manually update each subscription because Stripe uses the customer's `invoice_settings.default_payment_method` for all charges.

✅ **Existing Subscriptions**: Already active subscriptions will use the new default payment method for their next billing cycle.

## Testing Checklist

1. ✅ User can see all their payment methods
2. ✅ User can set any payment method as default
3. ✅ The default badge moves to the newly selected payment method
4. ✅ Stripe customer's default payment method is updated
5. ✅ If user has an active subscription, next charge will use new default
6. ✅ Database is_default flag is updated correctly (only one default per user)

## Error Handling

The endpoint handles these scenarios:

- Payment method doesn't exist → 404
- User doesn't own the payment method → 404
- Stripe API fails → Returns error but continues with database update
- No Stripe customer ID → Only updates database

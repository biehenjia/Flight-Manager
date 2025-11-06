import React from "react";
import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js";

const paypalclientid = process.env.PAYPAL_CLIENT_ID

const PayPalButton = () => {
  return (
    <PayPalScriptProvider
      options={{
        "client-id": paypalclientid, 
        currency: "USD",
      }}
    > 
      <div style={{ maxWidth: "400px", margin: "0 auto" }}>
        <PayPalButtons
          style={{ layout: "vertical", color: "gold" }}
          createOrder={(data, actions) => {
            return actions.order.create({
              purchase_units: [
                {
                  amount: {
                    value: "10.00", // test amount
                  },
                },
              ],
            });
          }}
          onApprove={(data, actions) => {
            return actions.order.capture().then((details) => {
              alert(`Transaction completed`);
              console.log("Payment success:", details);
            });
          }}
          onError={(err) => {
            console.error("PayPal Checkout Error:", err);
          }}
        />
      </div>
    </PayPalScriptProvider>
  );
};

export default PayPalButton;

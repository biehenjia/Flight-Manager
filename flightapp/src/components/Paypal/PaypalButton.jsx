import React from "react";
import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js";
import { useNavigate } from "react-router-dom";

const paypalclientid = import.meta.env.VITE_PAYPAL_CLIENT_ID;

const PayPalButton = () => {
  const navigate = useNavigate();

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
              console.log("Payment success:", details);
              navigate("../OnSuccessfulPayment"); // redirect to success page
            });
          }}
          onError={(err) => {
            console.error("PayPal Checkout Error:", err);
            navigate("../OnFailedPayment"); // redirect to error page
          }}
        />
      </div>
    </PayPalScriptProvider>
  );
};

export default PayPalButton;

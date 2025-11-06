import React from 'react'
import PayPalButton from '../components/Paypal/PaypalButton'

export default function PaypalPaymentTest() {
  return (
    <div>
      <h2>PaypalPaymentTest</h2>
      <p>Here we have the page to test the paypal payment gateway. We will only be using Paypal's "Sandbox Accounts". </p>

      <PayPalButton />
    </div>
  )
}

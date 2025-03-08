'use client';
import React, { useState } from 'react';
import { ElementsConsumer, PaymentElement, useElements, useStripe } from '@stripe/react-stripe-js';
// import useUserContext from '../../context/UserContext';



const PaymentGateway = ({ email }) => {

    // const {currentUser, setCurrentUser} = useState(JSON.parse(sessionStorage.getItem('user')));

    const stripe = useStripe();
    const elements = useElements();


    const handleSubmit = async (event) => {
        // We don't want to let default form submission happen here,
        // which would refresh the page.
        event.preventDefault();



        if (!stripe || !elements) {
            console.log('stripe not loaded');
            // Stripe.js hasn't yet loaded.
            // Make sure to disable form submission until Stripe.js has loaded.
            return;
        }

        const result = await stripe.confirmPayment({
            //Elements instance that was used to create the Payment Element
            elements,
            confirmParams: {
                return_url: "http://localhost:3000/mybag/thank-you",
                receipt_email: email,

            },
        });

        if (result.error) {
            // Show error to your customer (for example, payment details incomplete)

            console.log(result.error.message);
        } else {
            // Your customer will be redirected to your return_url. For some payment
            // methods like iDEAL, your customer will be redirected to an intermediate
            // site first to authorize the payment, then redirected to the return_url.
        }
    };
   

    return (
        <div className="max-w-md rounded overflow-hidden  font-RedditSans"  p={30} mt={30}>

            <form onSubmit={handleSubmit}>
                <h1  className='font-semibold my-5'>Secure Payment Gateway</h1>
                <PaymentElement  />
                <button disabled={!stripe} type="submit" className="btn bgEmerald w-full text-lg text-white mt-10">
                    Place Order
                </button>
            </form>
        </div>
    )
}

export default PaymentGateway
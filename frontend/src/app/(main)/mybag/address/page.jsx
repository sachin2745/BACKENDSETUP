"use client";
import React, { useEffect, useRef, useState } from "react";
import * as Yup from "yup";
import { loadStripe } from "@stripe/stripe-js";
import PaymentGateway from "./PaymentGateway";
import { Elements } from "@stripe/react-stripe-js";
import { useRouter } from "next/navigation";
import { useFormik } from "formik";
import toast from "react-hot-toast";
import Stripe from "stripe";
import useConsumerContext from "@/context/ConsumerContext";
import useProductContext from "@/context/ProductContext";
import axios from "axios";
import Select from "react-select";

function Address() {
  const { currentConsumer } = useConsumerContext();

  const [products, setProducts] = useState([]);
  const {
    cartItems,
    getCartTotal,
    getCartItemsCount,
    getSingleItemCartTotal,
    getCartDelTotal,
  } = useProductContext();

  useEffect(() => {
    if (currentConsumer && cartItems.length > 0) {
      fetchCartProducts();
    }
  }, [cartItems, currentConsumer]);

  const fetchCities = async () => {
    try {
      const { data } = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/web/getCities`
      );
      const options = data.map((city) => ({
        value: city.city_name,
        label: city.city_name,
        stateId: city.city_state,
      }));
      setCities(options);
    } catch (error) {
      console.error("Error fetching cities:", error);
    }
  };

  const fetchState = async (city) => {
    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/web/getState/${city}`
      );
      formik.setFieldValue("state", response.data.state);
    } catch (error) {
      console.error("Error fetching state:", error);
    }
  };

  const [cities, setCities] = useState([]);

  useEffect(() => {
    fetchCities();
  }, []);
  const fetchCartProducts = async () => {
    try {
      const productIds = cartItems.map((item) => item.productId);

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/web/cart-products`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "x-auth-token": currentConsumer.token,
          },
          body: JSON.stringify({
            productIds,
          }),
        }
      );

      if (!response.ok) throw new Error("Failed to fetch cart products");

      const data = await response.json();
      setProducts(data);
    } catch (error) {
      console.error("Error fetching cart products:", error);
    }
  };

  const checkoutvalidationSchema = Yup.object().shape({
    name: Yup.string()
      .required("Name is required")
      .matches(/^[A-Za-z\s]+$/, "Name can only contain letters and spaces")
      .min(3, "Name must be at least 3 characters")
      .max(50, "Name must be less than 50 characters"),

    phoneNumber: Yup.string()
      .required("Phone number is required")
      .matches(/^[0-9]{10}$/, "Phone number must be exactly 10 digits"),

    address: Yup.string()
      .required("Address is required")
      .min(10, "Address must be at least 10 characters")
      .max(100, "Address must be less than 100 characters"),

    locality: Yup.string()
      .required("Locality is required")
      .min(3, "Locality must be at least 3 characters"),

    city: Yup.string().required("City is required"),

    state: Yup.string().required("State is required"),

    pincode: Yup.string()
      .required("Pincode is required")
      .matches(/^[0-9]{6}$/, "Pincode must be exactly 6 digits"),
  });

  const router = useRouter();

  const formik = useFormik({
    initialValues: {
      name: "",
      phoneNumber: "",
      address: "",
      locality: "",
      city: "",
      state: "",
      pincode: "",
      cartTotal: 0, // Add initial value for cartTotal
      cartDelTotal: 0, // Add initial value for cartDelTotal
    },

    onSubmit: (values) => {
      // Calculate the values for the hidden fields
      const cartTotal = getCartTotal() + platformfees; // Assuming platformFees is defined
      const cartDelTotal = getCartDelTotal();

      // Update the values object with the calculated values
      const finalValues = {
        ...values,
        cartTotal,
        cartDelTotal,
      };
      // console.log(values);
      fetch(`${process.env.NEXT_PUBLIC_API_URL}/web/billing/add`, {
        method: "POST",
        body: JSON.stringify(finalValues),
        headers: {
          "Content-Type": "application/json",
          "x-auth-token": currentConsumer.token,
        },
      })
        .then(async (response) => {
          // console.log(response.status);
          const data = await response.json();
          // console.log(data);
          
          if (response.status === 200) {
            localStorage.setItem("orderId", data.orderId);
            toast.success("Detail Submited ! Now You Can Place Order");

            await getPaymentIntent();

            formik.resetForm();
          } else {
            toast.error("Some Error Occured");
          }
        })
        .catch((err) => {
          console.log(err);
          toast.error("Some Error Occured");
        });
    },

    validationSchema: checkoutvalidationSchema,
  });
  const [clientSecret, setClientSecret] = useState("");

  const getQuantity = (productId) => {
    const item = cartItems.find((item) => item.productId === productId);
    return item ? item.quantity : 0;
  };

  const displaycartItems = () => {
    if (products.length === 0) {
      return (
        <div className="grid  bg-white w-full h-40 rounded-lg justify-center place-content-center">
          <h1 className="text-3xl font-bold  text-black">Cart is Empty</h1>
        </div>
      );
    } else {
      return products.map((item) => {
        const quantity = getQuantity(item.productId);
        return (
          <div key={item.productId}>
            <ul className="py-6  space-y-6 px-8">
              <li className="grid grid-cols-6 gap-2 ">
                <div className="col-span-1 self-center bg-gray-200">
                  <img
                    src={
                      `${process.env.NEXT_PUBLIC_API_URL}` +
                      item.productThumbnail
                    }
                    alt={item.productThumbnailAlt}
                    className="rounded w-full"
                  />
                </div>
                <div className="flex flex-col col-span-3 pt-2">
                  <span className="text-black text-sm  font-semibold line-clamp-2">
                    {item.productName}
                  </span>
                </div>
                <div className="col-span-2 pt-3">
                  <div className="flex items-center space-x-2 text-sm justify-between">
                    <span className="text-gray-400 font-medium">
                      {quantity} x {item.productDiscountPrice}
                    </span>
                    <span className="text-black font-semibold inline-block">
                      ₹
                      {getSingleItemCartTotal(
                        item.productId,
                        item.productDiscountPrice
                      )}
                    </span>
                  </div>
                </div>
              </li>
            </ul>
          </div>
        );
      });
    }
  };
  const platformfees = 10;

  const addressRef = useRef();
  const pincodeRef = useRef();
  const contactRef = useRef();
  const stateRef = useRef(null);
  const cityRef = useRef(null);
  const localityRef = useRef();
  const nameRef = useRef();

  const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_KEY);
  const getPaymentIntent = async () => {
    const shipping = {
      id: currentConsumer?.consumerId,
      name: nameRef.current.value,
      address: {
        line1: addressRef.current.value,
        line2: localityRef.current.value,
        city: cityRef.current.value,
        state: stateRef.current.value,
        postal_code: pincodeRef.current.value,
        country: "IN",
      },
    };
    sessionStorage.setItem("shipping", JSON.stringify(shipping));
    // console.log(getCartTotal());
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/create-payment-intent`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          amount: getCartTotal() + platformfees,
          customerData: {
            ...shipping,
            email: currentConsumer?.consumerEmail, 
          },
        }),
      }
    );
    const data = await res.json();
    if (!res.ok) {
      console.error("Error creating payment intent:", data);
    } else {
      console.log(data);
      setClientSecret(data.clientSecret);
    }
  };

  const appearance = {
    theme: "stripe",
    variables: {
      colorPrimary: "#153d66",
      colorBackground: "white",
      colorText: "black",
    },
  };

  return (
    <>
      <div className="h-full grid grid-cols-3 font-RedditSans">
        <div className="lg:col-span-2 col-span-3 bg-white text-black  px-12 p-5">
          <h1 className=" mb-2   text-2xl font-bold text-black ">
            Add Delivery Address
          </h1>

          <div className="rounded-md mt-4 font-Quicksand">
            <form onSubmit={formik.handleSubmit} autoComplete="off">
              <section>
                <h2 className="uppercase tracking-wide text-lg font-semibold text-black my-2">
                  Shipping &amp; Billing Information
                </h2>

                <div className="  max-w-screen-md gap-4 ">
                  <div>
                    <div className="flex flex-col-reverse">
                      <input
                        placeholder="Name*"
                        className="peer outline-none border-2 rounded pl-2 py-1.5 px-2 duration-500 border-black focus:border-dashed relative placeholder:duration-500 placeholder:absolute focus:placeholder:pt-10 focus:rounded-md"
                        type="text"
                        ref={nameRef}
                        name="name"
                        id="name"
                        value={formik.values.name}
                        onChange={formik.handleChange}
                      />
                      <span className="pl-2 font-semibold  duration-500 opacity-0 peer-focus:opacity-100 -translate-y-5 peer-focus:translate-y-0">
                        Name*
                      </span>
                    </div>
                    {formik.touched.name && formik.errors.name ? (
                      <div className="text-red-500 text-xs pl-2 mt-1 font-medium">
                        {formik.errors.name}
                      </div>
                    ) : null}
                  </div>

                  <div className="sm:col-span-2">
                    <div className="flex flex-col-reverse">
                      <input
                        placeholder="Mobile Number*"
                        className="peer outline-none border-2 rounded pl-2 py-1.5 px-2 duration-500 border-black focus:border-dashed relative placeholder:duration-500 placeholder:absolute focus:placeholder:pt-10 focus:rounded-md"
                        type="number"
                        ref={contactRef}
                        name="phoneNumber"
                        id="phoneNumber"
                        value={formik.values.phoneNumber}
                        onChange={formik.handleChange}
                      />
                      <span className="pl-2 mt-1.5 font-semibold duration-500 opacity-0 peer-focus:opacity-100 -translate-y-5 peer-focus:translate-y-0">
                        Mobile Number*
                      </span>
                    </div>
                    {formik.touched.phoneNumber && formik.errors.phoneNumber ? (
                      <div className="text-red-500 text-xs pl-2 mt-1 font-medium">
                        {formik.errors.phoneNumber}
                      </div>
                    ) : null}
                  </div>

                  <div className="sm:col-span-2">
                    <div className="flex flex-col-reverse">
                      <textarea
                        placeholder="Address*"
                        className="peer outline-none border-2 rounded pl-2 py-1.5 px-2 duration-500 border-black focus:border-dashed relative placeholder:duration-500 placeholder:absolute focus:placeholder:pt-14 focus:rounded-md"
                        type="text"
                        ref={addressRef}
                        name="address"
                        id="address"
                        value={formik.values.address}
                        onChange={formik.handleChange}
                      />
                      <span className="pl-2 mt-1.5 font-semibold duration-500 opacity-0 peer-focus:opacity-100 -translate-y-5 peer-focus:translate-y-0">
                        Address (Area and Street)*
                      </span>
                    </div>
                    {formik.touched.address && formik.errors.address ? (
                      <div className="text-red-500 text-xs pl-2 mt-1 font-medium">
                        {formik.errors.address}
                      </div>
                    ) : null}
                  </div>
                  <div className="sm:col-span-2">
                    <div className="flex flex-col-reverse">
                      <input
                        placeholder="Locality*"
                        className="peer outline-none border-2 rounded pl-2 py-1.5 px-2 duration-500 border-black focus:border-dashed relative placeholder:duration-500 placeholder:absolute focus:placeholder:pt-10 focus:rounded-md"
                        type="text"
                        ref={localityRef}
                        name="locality"
                        id="locality"
                        value={formik.values.locality}
                        onChange={formik.handleChange}
                      />
                      <span className="pl-2 mt-1.5 font-semibold duration-500 opacity-0 peer-focus:opacity-100 -translate-y-5 peer-focus:translate-y-0">
                        Locality / Town*
                      </span>
                    </div>
                    {formik.touched.locality && formik.errors.locality ? (
                      <div className="text-red-500 text-xs pl-2 mt-1 font-medium">
                        {formik.errors.locality}
                      </div>
                    ) : null}
                  </div>
                  <div className="sm:col-span-2">
                    <div className="flex flex-col-reverse">
                      <Select
                        options={cities}
                        className="peer outline-none border-2 rounded  duration-500 border-black focus:border-dashed relative placeholder:duration-500 placeholder:absolute focus:placeholder:pt-10 focus:rounded-md"
                        name="city"
                        ref={cityRef}
                        placeholder="Search City..."
                        onChange={(option) => {
                          formik.setFieldValue("city", option.value);
                          fetchState(option.value);
                        }}
                      />
                      <span className="pl-2 mt-1.5 font-semibold duration-500 opacity-0 peer-focus:opacity-100 -translate-y-5 peer-focus:translate-y-0">
                        City/ District*
                      </span>
                    </div>
                  </div>

                  <div className="sm:col-span-2">
                    <div className="flex flex-col-reverse">
                      <input
                        placeholder="State*"
                        className="peer outline-none border-2 rounded pl-2 py-1.5 px-2 duration-500 border-black focus:border-dashed relative placeholder:duration-500 placeholder:absolute focus:placeholder:pt-10 focus:rounded-md"
                        name="state"
                        ref={stateRef}
                        id="state"
                        value={formik.values.state}
                        readOnly
                      />
                      <span className="pl-2 mt-1.5 font-semibold duration-500 opacity-0 peer-focus:opacity-100 -translate-y-5 peer-focus:translate-y-0">
                        State*
                      </span>
                    </div>
                    {formik.touched.state && formik.errors.state ? (
                      <div className="text-red-500 text-xs pl-2 mt-1 font-medium">
                        {formik.errors.state}
                      </div>
                    ) : null}
                  </div>
                  <div className="sm:col-span-2">
                    <div className="flex flex-col-reverse">
                      <input
                        placeholder="Pincode*"
                        className="peer outline-none border-2 rounded pl-2 py-1.5 px-2 duration-500 border-black focus:border-dashed relative placeholder:duration-500 placeholder:absolute focus:placeholder:pt-10 focus:rounded-md"
                        type="number"
                        ref={pincodeRef}
                        name="pincode"
                        id="pincode"
                        value={formik.values.pincode}
                        onChange={formik.handleChange}
                      />
                      <span className="pl-2 mt-1.5 font-semibold duration-500 opacity-0 peer-focus:opacity-100 -translate-y-5 peer-focus:translate-y-0">
                        Pincode*
                      </span>
                    </div>
                    {formik.touched.pincode && formik.errors.pincode ? (
                      <div className="text-red-500 text-xs pl-2 mt-1 font-medium">
                        {formik.errors.pincode}
                      </div>
                    ) : null}
                  </div>
                </div>
                <input
                  type="hidden"
                  name="cartTotal"
                  value={getCartTotal() + platformfees} // Calculate and set the value
                />
                <input
                  type="hidden"
                  name="cartDelTotal"
                  value={getCartDelTotal()} // Set the value
                />
                <div className="w-80 my-10">
                  <button
                    type="submit"
                    // onClick={getPaymentIntent}
                    className="btn bgEmerald w-full text-lg text-white"
                  >
                    Submit Detail
                  </button>
                </div>
              </section>
            </form>
          </div>
        </div>

        <div className="w-full col-span-3 lg:col-span-1 bg-white  border-solid border-4 border-gray-100 rounded ">
          <h1 className="py-6 text-xl text-black font-bold px-8">
            Order Summary
          </h1>
          {/* <!-- product - start --> */}
          {displaycartItems()}
          {/* <!-- product - end --> */}
          <div className="px-8 ">
            <div className="flex justify-between py-2 text-black">
              <span>Products Total ({getCartItemsCount()} Items)</span>
              <span className="font-semibold text-black">
                ₹{getCartTotal()}
              </span>
            </div>
            <div className="flex justify-between py-2 text-black">
              <span>MRP Discount</span>
              <span className="font-semibold textEmerald">
                -₹{getCartDelTotal() - getCartTotal()}
              </span>
            </div>
            <div className="flex justify-between py-2 text-black">
              <span>Shipping Charges</span>
              <span className="font-semibold textEmerald">Free</span>
            </div>
            <div className="flex justify-between py-2 text-black">
              <span>Platform fees</span>
              <span className="font-semibold text-black">₹10</span>
            </div>
          </div>
          <div className="font-semibold text-xl px-8 flex justify-between py-8 text-black border-b">
            <span>Total</span>
            <span>₹{getCartTotal() + platformfees}</span>
          </div>

          <div className="bg-white    p-8">
            <div className=" items-center mb-4">
              <h2 className="text-md text-black">
                {" "}
                Pay with your credit card via Stripe.
              </h2>
            </div>

            <div className="w-full">
              <label
                htmlFor="payment"
                className="block text-lg font-bold mb-2 text-black"
              >
                Credit Card
              </label>
              {clientSecret && (
                <Elements
                  stripe={stripePromise}
                  options={{
                    clientSecret,
                    appearance,
                  }}
                >
                  <PaymentGateway email={currentConsumer.consumerEmail} />
                </Elements>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Address;

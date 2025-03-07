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

function Checkout() {
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
    name: Yup.string().required("Name is required"),
    phoneNumber: Yup.string().required("Phone number is required"),
    email: Yup.string()
      .email("Invalid email address")
      .required("Email is required"),
    address: Yup.string().required("Address is required"),
    locality: Yup.string().required("Locality is required"),
    city: Yup.string().required("City is required"),
    state: Yup.string().required("State is required"),
    pincode: Yup.string().required("Pincode is required"),
  });

  const router = useRouter();
  const formik = useFormik({
    initialValues: {
      name: "",
      phoneNumber: "",
      email: "",
      address: "",
      locality: "",
      city: "",
      state: "",
      pincode: "",
      landmark: "",
      alternativephone: "",
    },

    onSubmit: (values) => {
      console.log(values);
      fetch(`${process.env.NEXT_PUBLIC_API_URL}/billing/add`, {
        method: "POST",
        body: JSON.stringify(values),
        headers: {
          "Content-Type": "application/json",
          "x-auth-token": currentUser.token,
        },
      })
        .then((response) => {
          console.log(response.status);
          if (response.status === 200) {
            toast.success("Detail Submited ! Now You Can Place Order");
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
                <div className="col-span-1 self-center">
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

  const [currentUser, setCurrentUser] = useState(
    JSON.parse(sessionStorage.getItem("user"))
  );
  // console.log(currentUser);
  const addressRef = useRef();
  const pincodeRef = useRef();
  const contactRef = useRef();
  const stateRef = useRef();
  const cityRef = useRef();
  const localityRef = useRef();
  const fnRef = useRef();

  const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_KEY);
  const getPaymentIntent = async () => {
    const shipping = {
      name: fnRef.current.value ,
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
          amount: getCartTotal(),
          customerData: shipping,
        }),
      }
    );
    const data = await res.json();
    console.log(data);
    setClientSecret(data.clientSecret);
  };

  const appearance = {
    theme: "stripe",
    variables: {
      colorPrimary: "#153d66",
      colorBackground: "black",
      colorText: "white",
    },
  };
  return (
    <>
      <div className="h-full grid grid-cols-3 font-RedditSans">
        <div className="lg:col-span-2 col-span-3 bg-white text-black  px-12 p-10">
          <h1 className=" mb-2  p-2 text-2xl font-bold text-black ">
            Add Delivery Address
          </h1>

          <div className="rounded-md mt-9 font-Quicksand">
            <form onSubmit={formik.handleSubmit}>
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
                        ref={fnRef}
                        name="name"
                        id="name"
                        value={formik.values.name}
                        onChange={formik.handleChange}
                      />
                      <span className="pl-2 duration-500 opacity-0 peer-focus:opacity-100 -translate-y-5 peer-focus:translate-y-0">
                        Name*
                      </span>
                    </div>
                    {formik.touched.name && formik.errors.name ? (
                      <div className="text-red-500 text-xs">
                        {formik.errors.name}
                      </div>
                    ) : null}
                  </div>

                  <div className="sm:col-span-2">
                    {/* <label
                      htmlFor="phoneNumber"
                      className="mb-2 inline-block text-sm text-black sm:text-base"
                    >
                      Phone Number*
                    </label>

                    <input
                      type="number"
                      ref={contactRef}
                      name="phoneNumber"
                      id="phoneNumber"
                      value={formik.values.phoneNumber}
                      onChange={formik.handleChange}
                      className="w-full rounded border bg-white text-black px-3 py-2  outline-none ring-indigo-300 transition duration-100 focus:ring"
                    />
                    {formik.touched.phoneNumber && formik.errors.phoneNumber ? (
                      <div className="text-red-500 text-xs">
                        {formik.errors.phoneNumber}
                      </div>
                    ) : null} */}

                    
                  </div>
                  <div className="sm:col-span-2">
                    <label
                      htmlFor="email"
                      className="mb-2 inline-block text-sm text-black sm:text-base"
                    >
                      Email*
                    </label>
                    <input
                      type="email"
                      name="email"
                      id="email"
                      value={formik.values.email}
                      onChange={formik.handleChange}
                      className="w-full rounded border bg-white text-black px-3 py-2  outline-none ring-indigo-300 transition duration-100 focus:ring"
                    />
                    {formik.touched.email && formik.errors.email ? (
                      <div className="text-red-500 text-xs">
                        {formik.errors.email}
                      </div>
                    ) : null}
                  </div>
                  <div className="sm:col-span-2">
                    <label
                      htmlFor="address"
                      className="mb-2 inline-block text-sm text-black sm:text-base"
                    >
                      Address (Area and Street)*
                    </label>
                    <textarea
                      type="text"
                      ref={addressRef}
                      rows={3}
                      defaultValue={""}
                      name="address"
                      id="address"
                      value={formik.values.address}
                      onChange={formik.handleChange}
                      className="w-full h-20 rounded border bg-white text-black px-3 py-2  outline-none ring-indigo-300 transition duration-100 focus:ring"
                    />
                    {formik.touched.address && formik.errors.address ? (
                      <div className="text-red-500 text-xs">
                        {formik.errors.address}
                      </div>
                    ) : null}
                  </div>
                  <div className="sm:col-span-2">
                    <label
                      htmlFor="locality"
                      className="mb-2 inline-block text-sm text-black sm:text-base"
                    >
                      Locality*
                    </label>
                    <input
                      type="text"
                      ref={localityRef}
                      name="locality"
                      id="locality"
                      value={formik.values.locality}
                      onChange={formik.handleChange}
                      className="w-full rounded border bg-white text-blackpx-3 py-2  outline-none ring-indigo-300 transition duration-100 focus:ring"
                    />
                    {formik.touched.locality && formik.errors.locality ? (
                      <div className="text-red-500 text-xs">
                        {formik.errors.locality}
                      </div>
                    ) : null}
                  </div>
                  <div className="sm:col-span-2">
                    <label
                      htmlFor="City/ District/ Town"
                      className="mb-2 inline-block text-sm text-black sm:text-base"
                    >
                      City/ District/ Town*
                    </label>

                    <input
                      type="text"
                      ref={cityRef}
                      name="city"
                      id="city"
                      value={formik.values.city}
                      onChange={formik.handleChange}
                      className="w-full rounded border bg-white text-black px-3 py-2  outline-none ring-indigo-300 transition duration-100 focus:ring"
                    />

                    {formik.touched.city && formik.errors.city ? (
                      <div className="text-red-500 text-xs">
                        {formik.errors.city}
                      </div>
                    ) : null}
                  </div>
                  <div className="sm:col-span-2">
                    <label
                      htmlFor="state"
                      className="mb-2 inline-block text-sm text-black sm:text-base"
                    >
                      State*
                    </label>

                    <select
                      name="state"
                      ref={stateRef}
                      id="state"
                      value={formik.values.state}
                      onChange={formik.handleChange}
                      className="w-full rounded border bg-white text-black px-3 py-2  outline-none ring-indigo-300 transition duration-100 focus:ring"
                    >
                      <option value="Select">Select State</option>
                      <option value="AP">Andhra Pradesh</option>
                      <option value="AP">Arunachal Pradesh</option>
                      <option value="Assam">Assam</option>
                      <option value="Bihar">Bihar</option>
                      <option value="Chhattisgarh">Chhattisgarh</option>
                      <option value="Goa">Goa</option>
                      <option value="Gujarat">Gujarat</option>
                      <option value="Haryana">Haryana</option>
                      <option value="HP">Himachal Pradesh</option>
                      <option value="Jharkhand">Jharkhand</option>
                      <option value="Karnataka">Karnataka</option>
                      <option value="Kerala">Kerala</option>
                      <option value="MP"> Madhya Pradesh</option>
                      <option value="Maharashtra">Maharashtra</option>
                      <option value="Manipur">Manipur</option>
                      <option value="Meghalaya">Meghalaya</option>
                      <option value="Mizoram">Mizoram</option>
                      <option value="Nagaland">Nagaland</option>
                      <option value="Odisha">Odisha</option>
                      <option value="Punjab">Punjab</option>
                      <option value="Rajasthan">Rajasthan</option>
                      <option value="Sikkim">Sikkim</option>
                      <option value="TN">Tamil Nadu</option>
                      <option value="Telangana">Telangana</option>
                      <option value="Tripura">Tripura</option>
                      <option value="UP"> Uttar Pradesh </option>
                    </select>
                    {formik.touched.state && formik.errors.state ? (
                      <div className="text-red-500 text-xs">
                        {formik.errors.state}
                      </div>
                    ) : null}
                  </div>
                  <div className="sm:col-span-2">
                    <label
                      htmlFor="pincode"
                      className="mb-2 inline-block text-sm text-black sm:text-base"
                    >
                      Pincode*
                    </label>
                    <input
                      type="number"
                      ref={pincodeRef}
                      name="pincode"
                      id="pincode"
                      value={formik.values.pincode}
                      onChange={formik.handleChange}
                      className="w-full rounded border bg-white text-black px-3 py-2  outline-none ring-indigo-300 transition duration-100 focus:ring"
                    />
                    {formik.touched.pincode && formik.errors.pincode ? (
                      <div className="text-red-500 text-xs">
                        {formik.errors.pincode}
                      </div>
                    ) : null}
                  </div>

                  <h2 className="uppercase tracking-wide text-lg font-semibold text-black my-2">
                    Additional Information
                  </h2>
                  <div className="sm:col-span-2">
                    <label
                      htmlFor="landmark"
                      className="mb-2 inline-block text-sm text-black sm:text-base"
                    >
                      Landmark(Optional)
                    </label>
                    <textarea
                      type="text"
                      rows={3}
                      defaultValue={""}
                      name="landmark"
                      id="landmark"
                      value={formik.values.landmark}
                      onChange={formik.handleChange}
                      className="h-24 w-full rounded border bg-white text-black px-3 py-2  outline-none ring-indigo-300 transition duration-100 focus:ring"
                    />
                    {formik.touched.landmark && formik.errors.landmark ? (
                      <div className="text-red-500 text-xs">
                        {formik.errors.landmark}
                      </div>
                    ) : null}
                  </div>

                  <div className="sm:col-span-2 mb-10">
                    <label
                      htmlFor="alternativephone"
                      className="mb-2 inline-block text-sm text-black sm:text-base"
                    >
                      Alternative Phone(Optional)
                    </label>
                    <input
                      type="number"
                      name="alternativephone"
                      id="alternativephone"
                      value={formik.values.alternativephone}
                      onChange={formik.handleChange}
                      className=" w-full rounded border bg-white text-black px-3 py-2  outline-none ring-indigo-300 transition duration-100 focus:ring"
                    />
                    {formik.touched.alternativephone &&
                    formik.errors.alternativephone ? (
                      <div className="text-red-500 text-xs">
                        {formik.errors.alternativephone}
                      </div>
                    ) : null}
                  </div>
                </div>
                <div className="w-80">
                  <button
                    type="submit"
                    onClick={getPaymentIntent}
                    className="btn bg-sky-500 w-full text-lg text-black"
                  >
                    Submit Detail
                  </button>
                </div>
              </section>
            </form>
          </div>
        </div>

        <div className="col-span-1 bg-white lg:block hidden border-solid border-2 border-black ">
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

          <div className="bg-white border-solid border-2 border-white shadow p-8 rounded-lg">
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
                  <PaymentGateway email={currentUser.email} />
                </Elements>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Checkout;

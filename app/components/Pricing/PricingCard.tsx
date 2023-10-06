import axios from "axios";
import React from "react";

const PricingCard = ({ price }) => {
  const handleSubscription = async (e) => {
    e.preventDefault();

    const { data } = await axios.post(
      "/api/payment",
      {
        priceId: price.id,
      },
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    window.location.assign(data);
  };

  return (
    <div>
      <h1
        className={`text-[50px] ${price.nickname === "Yearly Plan" && "mt-10"}`}
      >
        {price.nickname}
      </h1>
      <p className="text-[40px] text-slate-500">
        {(price.unit_amount / 100).toLocaleString("en-US", {
          style: "currency",
          currency: "USD",
        })}{" "}
        {price.nickname === "Yearly Plan" ? "/year" : "/month"}
      </p>
      <button
        className="text-[40px] hover:line-through text-red-500"
        onClick={handleSubscription}
      >
        Subscribe
      </button>
    </div>
  );
};

export default PricingCard;

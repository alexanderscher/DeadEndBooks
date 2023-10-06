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
      <h1>{price.nickname}</h1>
      <p>
        {(price.unit_amount / 100).toLocaleString("en-US", {
          style: "currency",
          currency: "USD",
        })}
      </p>
      <button onClick={handleSubscription}>Subscribe</button>
    </div>
  );
};

export default PricingCard;

import { Book, ExtendedSession } from "@/types";
import { useSession } from "next-auth/react";
import React, { useEffect, useState } from "react";
import { Loader } from "..";
import AddressModal from "./AddressModal";

const Checkout = () => {
  const { data: session } = useSession();
  const [pageData, setPageData] = useState<Book[]>([]);
  const [reload, setReload] = useState(false);
  const [userId, setUserId] = useState("");
  const [address, setAddress] = useState([]);
  const [isLoading, setisLoading] = useState(true);
  const [notActive, setNotActive] = useState(false);

  useEffect(() => {
    setisLoading(true);
    const sessionId = (session as ExtendedSession)?.user?.id;
    setUserId(sessionId as string);
    const getCart = async () => {
      const res = await fetch(`/api/user/${sessionId}`);
      const data = await res.json();
      setAddress(data.address);

      const cartBooks = [];

      for (const key in data.Cart) {
        const res = await fetch(`/api/book/${data.Cart[key].bookId}`);
        const book = await res.json();
        cartBooks.push({ ...book, cartId: data.Cart[key].id });
      }

      setPageData(cartBooks);

      setisLoading(false);
    };
    getCart();
  }, [session, reload]);

  // const checkoutSubmit = async () => {
  //   const active = (session as ExtendedSession)?.user?.isActive;
  //   if (!active) {
  //     setNotActive(true);
  //     return;
  //   } else {
  //     const useres = await fetch(`/api/user/${userId}`);
  //     const user = await useres.json();
  //     if (user.Current.length > 3) {
  //       alert("You can only have 3 books checked out at a time.");
  //       return;
  //     } else if (user.Current.length + pageData.length > 3) {
  //       alert(
  //         `You can only have 3 books checked out at a time. You currently have ${user.Current.length} books already checked out.`
  //       );
  //       return;
  //     } else {
  //       try {
  //         for (const book of pageData) {
  //           const res = await fetch(`/api/checkout`, {
  //             method: "POST",
  //             headers: {
  //               "Content-Type": "application/json",
  //             },
  //             body: JSON.stringify({
  //               userId,
  //               bookId: book.id,
  //               cartId: book.cartId,
  //               inStock: false,
  //             }),
  //           });

  //           if (book.Queue) {
  //             for (const item of book.Queue) {
  //               if (parseInt(userId) === item.userId) {
  //                 const res4 = await fetch(`/api/queue`, {
  //                   method: "DELETE",
  //                   headers: {
  //                     "Content-Type": "application/json",
  //                   },
  //                   body: JSON.stringify({
  //                     queuedId: item.id,
  //                   }),
  //                 });
  //               }
  //             }
  //           }
  //         }
  //       } catch (error) {
  //         console.error("An error occurred:", error);
  //       }
  //       setReload(true);
  //     }
  //   }
  // };

  const addressDelete = async (id: number) => {
    const res = await fetch(`/api/user/address`, {
      method: "DELETE",
      body: JSON.stringify({
        id,
      }),
      headers: {
        "Content-Type": "application/json",
      },
    });
    if (res.ok) {
      location.reload();
    }
  };

  const [modal, setModal] = useState(false);

  if (isLoading) {
    return <Loader />;
  }
  return (
    <div className="relative">
      <div className="w-full border-b-[2.5px] border-black">
        <h1 className="text-[30px] ">Checkout</h1>
      </div>
      <div className="mt-10">
        <h2 className="text-[20px]">Shipping</h2>
        <p className="mb-6 text-slate-400">
          Please check your shipping address
        </p>
        {modal && <AddressModal setModal={setModal} userId={userId} />}

        {address.length > 0 &&
          address.map((item) => (
            <div
              key={item.id}
              className="border-t-[2px] border-slate-400 flex justify-between mt-1 "
            >
              <div className="">
                <h3 className="mt-1 text-lg">{item.address}</h3>
                <h3 className="mt-1 text-lg">{item.city}</h3>
                <h3 className="mt-1 text-lg">{item.state}</h3>
                <h3 className="mt-1 text-lg">{item.country}</h3>
                <h3 className="mt-1 text-lg">{item.zipcode}</h3>
                <h3 className="mt-1 text-lg">{item.phone}</h3>
              </div>
              <div>
                <button
                  className="text-red-500 hover:line-through"
                  onClick={() => {
                    addressDelete(item.id);
                  }}
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        <div className="mt-10">
          <button className="text-red-500 hover:line-through text-[26px]">
            Submit
          </button>
          <button
            className="text-red-500 hover:line-through text-[26px] ml-6"
            onClick={() => {
              setModal(true);
            }}
          >
            Add new address
          </button>
        </div>
      </div>
    </div>
  );
};

export default Checkout;

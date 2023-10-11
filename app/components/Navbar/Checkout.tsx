import { Book, ExtendedSession } from "@/types";
import { useSession } from "next-auth/react";
import React, { useEffect, useState } from "react";
import { Loader } from "..";
import AddressModal from "./AddressModal";
import { useRouter } from "next/navigation";

const Checkout = () => {
  const { data: session } = useSession();
  const router = useRouter();
  const [pageData, setPageData] = useState<Book[]>([]);
  const [reload, setReload] = useState(false);
  const [userId, setUserId] = useState("");
  const [address, setAddress] = useState([]);
  const [isLoading, setisLoading] = useState(true);
  const [notActive, setNotActive] = useState(false);
  const [noAddress, setNoAddress] = useState(false);

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

  const [checkedId, setCheckedId] = useState(null);

  const [orderAddy, setOrderAddy] = useState({
    name: "",
    address: "",
    city: "",
    state: "",
    country: "",
    zipcode: "",
    phone: "",
  });

  const [checkoutSuccess, setCheckoutSuccess] = useState(false);
  const [modalCheckout, setModalCheckout] = useState({
    first: false,
    second: false,
  });

  const [userCurrentLength, setUserCurrentLength] = useState(0);

  const checkoutSubmit = async () => {
    const active = (session as ExtendedSession)?.user?.isActive;

    if (!active) {
      setNotActive(true);
      return;
    }

    if (!checkedId) {
      setNoAddress(true);
      return;
    }

    const useres = await fetch(`/api/user/${userId}`);
    const user = await useres.json();

    if (user.Cart.length > 3) {
      setModalCheckout({ second: false, first: true });
      return;
    }

    if (user.Current.length + pageData.length > 3) {
      setUserCurrentLength(user.Current.length);
      setModalCheckout({ second: true, first: false });
      return;
    }
    const resAddy = await fetch(`/api/user/address/${checkedId}`);
    const data = await resAddy.json();
    setOrderAddy(data);
  };

  useEffect(() => {
    const checkout = async () => {
      if (orderAddy.address) {
        try {
          for (const book of pageData) {
            const res = await fetch(`/api/checkout`, {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                userId,
                name: orderAddy.name,
                bookId: book.id,
                cartId: book.cartId,
                inStock: false,
                address: orderAddy.address,
                city: orderAddy.city,
                state: orderAddy.state,
                country: orderAddy.country,
                zipcode: orderAddy.zipcode,
                phone: orderAddy.phone,
              }),
            });
            if (book.Queue) {
              for (const item of book.Queue) {
                if (parseInt(userId) === item.userId) {
                  const res4 = await fetch(`/api/queue`, {
                    method: "DELETE",
                    headers: {
                      "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                      queuedId: item.id,
                    }),
                  });
                }
              }
            }
            router.push("/admin/orders/pending");
          }
        } catch (error) {
          console.error("An error occurred:", error);
        }
      }
    };
    checkout();
  }, [orderAddy]);

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
      <div className="w-full ">
        <h1 className="text-[30px] ">Checkout</h1>
      </div>
      <div className="mt-10 max-w-[1000px]">
        <div className="flex justify-between">
          <div>
            <h2 className="text-[20px]">Shipping</h2>
            <p className="mb-6 text-slate-400">Choose a shipping address</p>
          </div>
          <button
            className="text-red-500 hover:line-through text-[20px]"
            onClick={() => {
              setModal(true);
            }}
          >
            Add new address
          </button>
        </div>

        {modal && <AddressModal setModal={setModal} userId={userId} />}

        {address.length > 0 &&
          address.map((item, index) => (
            <div
              key={item.id}
              className="border-t-[2px] border-black flex justify-between mt-1 "
            >
              <div className="flex">
                <label
                  className="custom-checkbox mt-2 mr-6"
                  onClick={() => setCheckedId(item.id)}
                >
                  <span
                    className={
                      item.id === checkedId ? "checkmark checked" : "checkmark"
                    }
                  ></span>
                </label>
                <div>
                  <h3 className="mt-1 text-lg">{item.name}</h3>
                  <h3 className="mt-1 text-lg">{item.address}</h3>
                  <h3 className="mt-1 text-lg">{item.city}</h3>
                  <h3 className="mt-1 text-lg">{item.state}</h3>
                  <h3 className="mt-1 text-lg">{item.country}</h3>
                  <h3 className="mt-1 text-lg">{item.zipcode}</h3>
                  <h3 className="mt-1 text-lg">{item.phone}</h3>
                </div>
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
        {address.length === 0 ? (
          <div>
            <h1 className="text-red-500 text-[30px]">
              Please add a shipping address
            </h1>
          </div>
        ) : (
          <>
            <div className="mt-16 flex flex-col items-center">
              {noAddress && (
                <p className="text-red-800 text-[20px] mb-3">
                  Please select an address
                </p>
              )}
              <button
                className="text-red-500 border-[2px] w-full bg-red-200 border-black hover:line-through text-[26px] p-4 rounded-sm"
                onClick={checkoutSubmit}
              >
                Submit order
              </button>
            </div>
          </>
        )}
      </div>
      {modalCheckout.first && (
        <div className="fixed top-0 right-0 bottom-0 left-0 flex items-center justify-center">
          <div className="bg-red-200 text-red-500 m-10 p-8 rounded-md text-[20px] border-[2px] border-red-500 shadow-lg">
            <p>You can only have 3 books checked out at a time</p>
            <button
              onClick={() => setModalCheckout({ first: false, second: false })}
              className="hover:line-through text-md mt-4 text-end"
            >
              Close
            </button>
          </div>
        </div>
      )}
      {modalCheckout.second && (
        <div className="fixed top-0 right-0 bottom-0 left-0 flex items-center justify-center">
          <div className="bg-red-200 text-red-500 m-10 p-8 rounded-md text-[20px] border-[2px] border-red-500 shadow-lg">
            <p>
              You can only have 3 books checked out at a time. You currently
              have {userCurrentLength} checked out
            </p>
            <button
              onClick={() => setModalCheckout({ first: false, second: false })}
              className="hover:line-through text-md mt-4 text-end"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Checkout;

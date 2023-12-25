"use client";
import { Book, ExtendedSession } from "@/types";

import Link from "next/link";
import React, { useEffect, useState } from "react";
import { Loader } from "..";
import { useRouter } from "next/navigation";
import { useDeviceQueries } from "@/utils/deviceQueries";
import { useSession } from "next-auth/react";

const Cart = () => {
  const { data: session } = useSession();
  const { isSmallDevice, isMobileDevice } = useDeviceQueries();

  const router = useRouter();
  const [pageData, setPageData] = useState<Book[]>([]);
  const [reload, setReload] = useState(false);
  const [userId, setUserId] = useState("");
  const [isLoading, setisLoading] = useState(true);
  const [notActive, setNotActive] = useState(false);

  useEffect(() => {
    setisLoading(true);
    const sessionId = (session as ExtendedSession)?.user?.id;

    const getCart = async () => {
      setUserId(sessionId as string);
      const res = await fetch(`api/cart/${sessionId}`, {
        next: { revalidate: 60 * 60 * 24, tags: [`cart-${sessionId}`] },
      });
      const data = await res.json();
      setPageData(data);
    };
    if (sessionId) {
      getCart();
    }

    setisLoading(false);
  }, [session, reload]);

  const removeCart = async (cartId: number) => {
    setReload(false);
    const res = await fetch(`/api/cart`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        cartId,
        userId,
      }),
    });

    if (res.ok) {
      setReload(true);
    } else {
      console.error("Error removing cart");
    }
  };

  const [modalCheckout, setModalCheckout] = useState({
    first: false,
    second: false,
  });

  const [userCurrentLength, setUserCurrentLength] = useState(0);

  const checkoutSubmit = async () => {
    if (!(session as ExtendedSession)?.user?.isActive) {
      setNotActive(true);
    } else {
      const sessionId = (session as ExtendedSession)?.user?.id;

      const res1 = await fetch(`/api/user/${sessionId}`, {
        cache: "no-store",
        next: { tags: [`user-profile-${sessionId}`], revalidate: 60 * 60 * 24 },
      });
      const user = await res1.json();

      if (user.Cart.length > 3) {
        setModalCheckout({ second: false, first: true });
        return;
      } else if (user.Current.length + pageData.length > 3) {
        setUserCurrentLength(user.Current.length);

        setModalCheckout({ second: true, first: false });
        return;
      } else {
        router.push("/checkout");
      }
    }
  };
  if (session === null) {
    return (
      <div className={`${isSmallDevice ? "mt-10 w-full" : "w-full"} `}>
        <h1 className="text-[26px]">Login or sign up to view your cart</h1>
        <div className="mt-10">
          <h1 className="text-red-500  hover:line-through text-[26px]">
            <Link href="/login">Log in</Link>
          </h1>
          <h1 className="text-red-500  hover:line-through text-[26px]">
            <Link href="/signup">Sign up</Link>
          </h1>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return <Loader />;
  }

  if (pageData.length === 0 && session) {
    return (
      <div className={`${isSmallDevice ? "mt-10" : " w-full"}`}>
        <h1 className="text-[26px]">Your cart is empty</h1>
      </div>
    );
  }

  return (
    <div className="relative">
      <div className="fixed bottom-0 left-0 border-t-[2px] border-black bg-red-100 w-full text-red-500 p-4 flex hover:line-through">
        <button className="text-[26px]" onClick={checkoutSubmit}>
          Checkout
        </button>
      </div>
      {pageData.map((book, index) => (
        <div
          key={book.id}
          className={`border-t-[2px] border-slate-400 ${
            index === pageData.length - 1 ? "mb-[200px]" : "mb-6"
          }`}
        >
          <div className="mt-4 flex justify-start w-full">
            <div
              className={
                isMobileDevice
                  ? "max-w-[150px] mr-6"
                  : "max-w-[200px] mr-[50px]"
              }
            >
              <img
                className={isMobileDevice ? "max-w-[150px]" : "max-w-[200px] "}
                src={book.photo_front}
              />
            </div>
            <div
              className={`w-3/4 ${
                isMobileDevice ? "text-[18px] ml-4" : "text-[24px]"
              } `}
            >
              <h1 className="hover:line-through">
                <Link href={`/book/${book.id}`}>{book.title}</Link>
              </h1>
              <h1 className="mt-2">{book.author}</h1>
              {book.inStock ? (
                <>
                  <h1 className="text-slate-400 mt-2">In Stock</h1>
                  <h1
                    className="text-slate-400 cursor-pointer hover:line-through"
                    onClick={() => removeCart(book.cartId as number)}
                  >
                    Remove
                  </h1>
                </>
              ) : (
                <>
                  <h1 className="text-slate-400 mt-2">Out of stock</h1>

                  <h1
                    className="text-slate-400 cursor-pointer hover:line-through"
                    onClick={() => removeCart(book.cartId as number)}
                  >
                    Remove
                  </h1>
                </>
              )}
            </div>
          </div>
        </div>
      ))}

      <div className="flex justify-center items-center">
        {notActive && (
          <div className="fixed top-0 right-0 bottom-0 left-0 flex items-center justify-center">
            <div className="bg-red-200 text-red-500 m-10 p-8 rounded-md text-[20px] border-[2px] border-red-500 shadow-lg">
              <p>Please subscribe to checkout books</p>
              <button
                onClick={() => setNotActive(false)}
                className="hover:line-through text-md mt-4 text-end"
              >
                Close
              </button>
            </div>
          </div>
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

export default Cart;

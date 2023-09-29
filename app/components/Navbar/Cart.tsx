import { ExtendedSession } from "@/types";
import { Book } from "@prisma/client";
import { useSession } from "next-auth/react";
import Link from "next/link";
import React, { useEffect, useState } from "react";

const Cart = ({}) => {
  const { data: session } = useSession();
  const [pageData, setPageData] = useState<Book[]>([]);
  const [reload, setReload] = useState(false);

  useEffect(() => {
    setReload(false);

    const sessionId = (session as ExtendedSession)?.user?.id;
    const getCart = async () => {
      const res = await fetch(`/api/user/${sessionId}`);
      const data = await res.json();
      console.log(data);

      const cartBooks = [];

      for (const key in data.Cart) {
        console.log(data.Cart[key].id);
        const res = await fetch(`/api/book/${data.Cart[key].bookId}`);
        const book = await res.json();
        cartBooks.push({ ...book, cartId: data.Cart[key].id });
      }

      setPageData(cartBooks);
    };
    getCart();
  }, [session, reload]);

  const removeCart = async (cartId: number) => {
    const res = await fetch(`/api/cart`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        cartId,
      }),
    });
    setReload(true);
  };

  return (
    <div>
      {pageData.length === 0 ? (
        <div className="text-[30px]">
          <h1>Your cart is empty</h1>
        </div>
      ) : (
        <>
          <div className="fixed bottom-0 left-0 border-t-[2px] border-black bg-red-100 w-full text-red-500 p-5 flex ">
            <button className="text-[30px]">Checkout</button>
          </div>
          {pageData.map((book) => (
            <div key={book.id} className="border-t-[2px] border-slate-400 mb-6">
              <div className="mt-4 flex justify-start w-full">
                <div className="max-w-[200px] mr-[50px]">
                  <img className="max-w-[200px]" src={book.photo_front} />
                </div>
                <div className="w-3/4 text-[30px]">
                  <h1 className="hover:line-through">
                    <Link href={`/book/${book.title}`}>{book.title}</Link>
                  </h1>
                  <h1 className="mt-4">{book.author}</h1>
                  {book.inStock ? (
                    <h1 className="text-slate-400 cursor-pointer">In Stock</h1>
                  ) : (
                    <>
                      <h1 className="text-slate-400 cursor-pointer">
                        Out of stock
                      </h1>
                      <h1 className="text-red-500 cursor-pointer hover:line-through">
                        Get in line
                      </h1>
                    </>
                  )}
                  <h1
                    className="text-slate-400 cursor-pointer hover:line-through"
                    onClick={() => removeCart(book.cartId as number)}
                  >
                    Remove
                  </h1>
                </div>
              </div>
            </div>
          ))}
        </>
      )}
    </div>
  );
};

export default Cart;

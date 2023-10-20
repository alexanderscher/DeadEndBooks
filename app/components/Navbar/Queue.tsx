import { Book, ExtendedSession } from "@/types";
import { useSession } from "next-auth/react";
import React, { useEffect, useState } from "react";
import { Loader } from "..";
import Link from "next/link";

type Props = {
  isMobileDevice: boolean;
};
const Queue = ({ isMobileDevice }: Props) => {
  const { data: session } = useSession();
  const [pageData, setPageData] = useState<Book[]>([]);
  const [userId, setUserId] = useState("");
  const [cartIdList, setCartIdList] = useState<number[]>([]);
  const [reload, setReload] = useState(false);
  const [isLoaded, setIsLoaded] = useState(true);
  const [bookStatuses, setBookStatuses] = useState<Record<number, string>>({});

  useEffect(() => {
    setReload(false);
    const sessionId = (session as ExtendedSession)?.user?.id;
    setUserId(sessionId);

    const getqueued = async () => {
      setIsLoaded(true);

      const res = await fetch(`/api/user/${sessionId}`);
      const data = await res.json();

      const queuedBooks = [];
      const cartIds = [];

      for (const key in data.Cart) {
        cartIds.push(data.Cart[key].bookId);
      }

      for (const key in data.Queue) {
        const res = await fetch(`/api/book/${data.Queue[key].bookId}`);
        const book = await res.json();

        const targetUserId = parseInt(sessionId);

        const positionInQueue = book.Queue.findIndex(
          (queueItem: any) => queueItem.userId === targetUserId
        );

        const numberOfPeopleAhead =
          positionInQueue !== -1 ? positionInQueue : 0;

        queuedBooks.push({
          ...book,
          queuedId: data.Queue[key].id,
          people: numberOfPeopleAhead as number,
        });
      }

      setPageData(queuedBooks);
      setCartIdList(cartIds);
      setIsLoaded(false);
    };
    getqueued();
  }, [session, reload]);

  const [addedToCart, setAddedToCart] = useState({
    bookId: 0,
    status: false,
  });

  const handleCart = async (bookId: number) => {
    if (cartIdList.includes(bookId)) {
      setBookStatuses((prev) => ({ ...prev, [bookId]: "Already in cart" }));
      setTimeout(() => {
        setBookStatuses((prev) => ({ ...prev, [bookId]: "" }));
      }, 2000);
      return;
    }
    if (bookId === undefined) return;
    const res = await fetch(`/api/cart`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        bookId,
        userId: userId,
      }),
    });
    setAddedToCart({
      bookId,
      status: true,
    });
  };

  const removeQueue = async (queuedId: number) => {
    const res = await fetch(`/api/queue`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        queuedId,
      }),
    });
    setReload(true);
  };

  if (isLoaded) {
    return <Loader />;
  }

  if (pageData.length === 0) {
    return (
      <div className="text-[26px] ">
        <h1>No queued books</h1>
      </div>
    );
  }

  return (
    <div>
      {pageData.map((book) => (
        <div key={book.id} className="border-t-[2px] border-slate-400 mb-6">
          <div key={book.id} className="mt-4 flex justify-start w-full">
            <div
              className={
                isMobileDevice
                  ? "max-w-[150px] mr-6"
                  : "max-w-[200px] mr-[50px]"
              }
            >
              <img className="" src={book.photo_front} />
            </div>

            <div
              className={`w-3/4 ${
                isMobileDevice ? "text-[18px] ml-4" : "text-[26px]"
              } `}
            >
              <h1 className="hover:line-through">
                <Link href={`/book/${book.title}`}>{book.title}</Link>
              </h1>
              <h1 className="mt-4">{book.author}</h1>

              {book.inStock && book.people === 0 ? (
                <>
                  <h1 className="text-slate-400 cursor-pointer">In Stock</h1>
                  <h1
                    className="text-slate-400 cursor-pointer hover:line-through"
                    onClick={() => removeQueue(book.queuedId as number)}
                  >
                    Remove
                  </h1>
                  <h1
                    className="text-red-500 cursor-pointer hover:line-through"
                    onClick={() => handleCart(book.id as number)}
                  >
                    {addedToCart.status && addedToCart.bookId === book.id
                      ? "Added to cart"
                      : bookStatuses[book.id as number] || "Add to cart"}
                  </h1>
                </>
              ) : (
                <>
                  <>
                    <h1 className="text-slate-400 cursor-pointer">
                      Out of stock
                    </h1>

                    <h1
                      className="text-slate-400 cursor-pointer hover:line-through"
                      onClick={() => removeQueue(book.queuedId as number)}
                    >
                      Remove
                    </h1>
                    {book.people === 1 ? (
                      <h1 className="text-red-500 cursor-pointer mt-4">
                        {book.people} person ahead of you
                      </h1>
                    ) : book.people === 0 ? (
                      <h1 className="cursor-pointer mt-4 text-red-500">
                        You are next in line
                      </h1>
                    ) : (
                      <h1 className="cursor-pointer mt-4 text-red-500">
                        {book.people} people ahead of you
                      </h1>
                    )}
                  </>
                </>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default Queue;

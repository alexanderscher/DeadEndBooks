"use client";
import React, { useEffect, useRef } from "react";
import "@uploadthing/react/styles.css";
import { UploadButton } from "@uploadthing/react";
import { OurFileRouter } from "@/app/api/uploadthing/core";
import { useState } from "react";
import { usePathname } from "next/navigation";
import { useRouter } from "next/navigation";
import { deleteUploadThingImage } from "@/app/actions/photo/delete";
import { useDeviceQueries } from "@/utils/deviceQueries";

interface Delete {
  setDeleteError: (error: boolean) => void;
}

interface Props {
  res: any;
}
const EditBook = () => {
  const { isSmallDevice, isMobileDevice } = useDeviceQueries();
  const router = useRouter();
  const formRef = useRef<HTMLFormElement>(null);
  const [bookId, setBookId] = useState<number | null>(null);
  const [bookTitle, setBookTitle] = useState<number | null>(null);

  const [bookPlaceHolder, setBookPlaceHolder] = useState({
    title: "",
    author: "",
    publisher: "",
    medium: "",
    photo_front: "",
    photo_back: "",
    pb_fileKey: "",
    pf_fileKey: "",
  });

  const [book, setBook] = useState({
    title: "",
    author: "",
    publisher: "",
    medium: "",
    photo_front: "",
    photo_back: "",
    pb_fileKey: "",
    pf_fileKey: "",
  });

  const currentPage = usePathname();
  useEffect(() => {
    const getBooks = async () => {
      const res = await fetch(`/api/admin/book/${currentPage.split("/")[3]}`);
      const data = await res.json();
      setBookTitle(data.title);
      setBookPlaceHolder(data);

      setBookId(data.id);
      setBook(data);
    };
    getBooks();
  }, []);

  const [frontImage, setFrontImage] = useState<
    {
      fileUrl: string;
      fileKey: string;
    }[]
  >([]);

  const [backImage, setBackImage] = useState<
    {
      fileUrl: string;
      fileKey: string;
    }[]
  >([]);

  const [deleteError, setDeleteError] = useState(false);

  const [errorText, setErrorText] = useState("");
  const [uploaded, setUploaded] = useState(false);

  useEffect(() => {
    if (frontImage.length) {
      setBook((prevBook) => ({
        ...prevBook,
        photo_front: frontImage[0].fileUrl,
        pf_fileKey: frontImage[0].fileKey,
      }));
    }
  }, [frontImage]);

  useEffect(() => {
    if (backImage.length) {
      setBook((prevBook) => ({
        ...prevBook,
        photo_back: backImage[0].fileUrl,
        pb_fileKey: backImage[0].fileKey,
      }));
    }
  }, [backImage]);

  const frontDelete = () => {
    deleteUploadThingImage(frontImage[0].fileKey);
    setFrontImage([]);
    setBook((prevBook) => ({
      ...prevBook,
      photo_front: bookPlaceHolder.photo_front,
    }));
  };

  const backDelete = () => {
    deleteUploadThingImage(backImage[0].fileKey);
    setBackImage([]);
    setBook((prevBook) => ({
      ...prevBook,
      photo_back: bookPlaceHolder.photo_back,
    }));
  };

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    setBook((prevBook) => ({
      ...prevBook,
      title: value,
    }));
  };

  const handleAuthorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    setBook((prevBook) => ({
      ...prevBook,
      author: value,
    }));
  };

  const handlePublisherChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    setBook((prevBook) => ({
      ...prevBook,
      publisher: value,
    }));
  };
  const handleMediumChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { value } = e.target;
    setBook((prevBook) => ({
      ...prevBook,
      medium: value,
    }));
  };

  const deleteBook = async () => {
    if (!bookId || typeof bookId !== "number") {
      setErrorText("Invalid book ID.");
      return;
    }

    try {
      const response = await fetch(`/api/admin/book/edit/${bookId}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(book),
      });

      if (!response.ok) {
        const errorText = await response.text();
        setDeleteError(true);
        throw new Error(errorText);
      } else {
        router.push("/admin/allbooks");
      }
    } catch (error) {
      console.error(error);
    }
  };

  const submitBook = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!bookId || typeof bookId !== "number") {
      setErrorText("Invalid book ID.");
      return;
    }

    if (JSON.stringify(book) === JSON.stringify(bookPlaceHolder)) {
      return;
    } else {
      try {
        const response = await fetch(`/api/admin/book/edit/${bookId}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            title:
              book.title && book.title.length > 0
                ? book.title
                : bookPlaceHolder.title,
            author:
              book.author && book.author.length > 0
                ? book.author
                : bookPlaceHolder.author,
            publisher:
              book.publisher && book.publisher.length > 0
                ? book.publisher
                : bookPlaceHolder.publisher,
            medium:
              book.medium && book.medium.length > 0
                ? book.medium
                : bookPlaceHolder.medium,
            photo_front: book.photo_front
              ? book.photo_front
              : bookPlaceHolder.photo_front,
            photo_back: book.photo_back
              ? book.photo_back
              : bookPlaceHolder.photo_back,
            pf_fileKey: book.pf_fileKey
              ? book.pf_fileKey
              : bookPlaceHolder.pf_fileKey,
            pb_fileKey: book.pb_fileKey
              ? book.pb_fileKey
              : bookPlaceHolder.pb_fileKey,
          }),
        });

        if (!response.ok) {
          const errorText = await response.text();
          setErrorText(errorText);
          throw new Error(errorText);
        } else {
          setErrorText("");
          setUploaded(true);
          setTimeout(() => {
            setUploaded(false);
          }, 2000);

          if (formRef.current) {
            formRef.current.reset();
            setFrontImage([]);
            setBook((prevBook) => ({
              ...prevBook,
              photo_front: bookPlaceHolder.photo_front,
            }));
            setBackImage([]);
            setBook((prevBook) => ({
              ...prevBook,
              photo_back: bookPlaceHolder.photo_back,
            }));
          }
        }
        router.push(`/admin/editbook/${book.title}`);
      } catch (error) {
        console.error(error);
      }
    }
  };
  if (bookPlaceHolder.title !== "") {
    return (
      <div>
        <div className="mt-6">
          <form ref={formRef} onSubmit={submitBook}>
            <div className="flex flex-col max-w-[800px]">
              <h1 className="text-[26px] mb-6">{bookPlaceHolder.title}</h1>
              <input
                type="text"
                placeholder={bookPlaceHolder.title}
                className="border-black text-[18px] border-b-[3px] placeholder:text-black  w-full focus:outline-none"
                onChange={handleTitleChange}
              />
              {errorText.includes("title") && (
                <p className="text-red-500">Missing title field</p>
              )}
              <input
                type="text"
                placeholder={bookPlaceHolder.author}
                className="border-black text-[18px] border-b-[3px] placeholder:text-black mt-6 w-full focus:outline-none"
                onChange={handleAuthorChange}
              />
              {errorText.includes("author") && (
                <p className="text-red-500">Missing author field</p>
              )}
              <input
                type="text"
                placeholder={bookPlaceHolder.publisher}
                className="border-black text-[18px] border-b-[3px] placeholder:text-black mt-6 w-full focus:outline-none"
                onChange={handlePublisherChange}
              />
              {errorText.includes("publisher") && (
                <p className="text-red-500">Missing publisher field</p>
              )}
              <select
                className="border-black text-[18px] border-b-[3px] placeholder:text-black mt-6 w-full focus:outline-none cursor-pointer"
                onChange={handleMediumChange}
                value={book.medium}
              >
                <option value="" disabled className="text-black">
                  {bookPlaceHolder.medium}
                </option>
                <option value="painting">Painting</option>
                <option value="sculpture">Sculpture</option>
                <option value="photography_film">Photography/film</option>
                <option value="catalogs_magazines">
                  Catalogs and Magazines
                </option>
                <option value="anthologies_miscellaneous">
                  Anthologies/miscellaneous
                </option>
              </select>
              {errorText.includes("medium") && (
                <p className="text-red-500">Missing medium field</p>
              )}
              <div
                className={
                  isMobileDevice
                    ? "flex flex-col mt-10 relative w-full "
                    : "flex mt-10 space-x-4 relative w-full "
                }
              >
                <div className="flex-1 p-4 border-[2px] border-slate-400 bg-white flex flex-col justify-between">
                  <div className="mb-2">
                    <img
                      src={
                        frontImage.length > 0
                          ? frontImage[0].fileUrl
                          : bookPlaceHolder.photo_front
                      }
                      alt=""
                      className=""
                    />
                  </div>
                  <div>
                    <div className="">
                      <UploadButton<OurFileRouter>
                        appearance={{
                          button:
                            "ut-ready:bg-slate-400  ut-uploading:cursor-not-allowed rounded-r-none bg-slate-400  bg-none after:bg-orange-400",
                        }}
                        content={{
                          allowedContent: (
                            <div className="text-[12px] mt-2">
                              Edit front cover photo
                              {errorText.includes("frontCover") && (
                                <p className="text-red-500">
                                  Missing front cover field
                                </p>
                              )}
                            </div>
                          ),
                        }}
                        className="mt-4 ut-button:bg-slate-400  ut-button:ut-readying:bg-slate-400 /50"
                        endpoint="imageUploader"
                        onClientUploadComplete={(res) => {
                          if (res) {
                            setFrontImage(res);
                            const json = JSON.stringify(res);
                          }
                        }}
                        onUploadError={(error: Error) => {
                          alert(`ERROR! ${error.message}`);
                        }}
                      />
                    </div>
                    <div>
                      <p
                        className="cursor-pointer text-slate-400 text-center mt-2 text-[12px] hover:line-through"
                        onClick={frontDelete}
                      >
                        Undo
                      </p>
                    </div>
                  </div>
                </div>
                <div
                  className={`${
                    isMobileDevice && "mt-4 "
                  } flex-1 p-4 border-[2px] border-slate-400 bg-white flex flex-col justify-between">
`}
                >
                  <div className="mb-2">
                    <img
                      src={
                        backImage.length > 0
                          ? backImage[0].fileUrl
                          : bookPlaceHolder.photo_back
                      }
                      alt=""
                      className="w-full h-auto"
                    />
                  </div>
                  <div>
                    <div className="">
                      <UploadButton<OurFileRouter>
                        appearance={{
                          button:
                            "ut-ready:bg-slate-400  ut-uploading:cursor-not-allowed rounded-r-none bg-slate-400  bg-none after:bg-orange-400",
                        }}
                        content={{
                          allowedContent: (
                            <div className="text-[12px] mt-2">
                              Edit back photo
                              {errorText.includes("frontCover") && (
                                <p className="text-red-500">
                                  Missing back cover field
                                </p>
                              )}
                            </div>
                          ),
                        }}
                        className="mt-4 ut-button:bg-slate-400  ut-button:ut-readying:bg-slate-400 /50"
                        endpoint="imageUploader"
                        onClientUploadComplete={(res) => {
                          if (res) {
                            setBackImage(res);
                            const json = JSON.stringify(res);
                          }
                        }}
                        onUploadError={(error: Error) => {
                          alert(`ERROR! ${error.message}`);
                        }}
                      />
                    </div>
                    <div>
                      <p
                        className="cursor-pointer text-slate-400 text-center mt-2 text-[12px] hover:line-through"
                        onClick={backDelete}
                      >
                        Undo
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex flex-col w-full mt-8">
                <button
                  type="submit"
                  className="w-full text-[22px] p-1 hover:line-through text-red-500 border-red-500 border-[3px] text-center"
                >
                  Confirm
                </button>

                <button
                  onClick={deleteBook}
                  className="mt-4 w-full text-[22px] p-1 text-red-500 hover:line-through border-red-500 border-[3px] text-center"
                >
                  Delete Book
                </button>
              </div>
            </div>
          </form>
        </div>
        {deleteError && <Modal setDeleteError={setDeleteError} />}
      </div>
    );
  }
};

export default EditBook;

const Modal = ({ setDeleteError }: Delete) => {
  return (
    <div className="fixed inset-0 flex items-center justify-center z-40">
      <div className="p-8 z-50 max-w-[400px] w-3/4 bg-red-100 min-h-[100px] rounded-md border-black border-[2px] shadow-xl flex flex-col">
        <h1 className=""> Cannot delete book. Book is currently in use.</h1>

        <div className="mt-4 flex justify-between">
          <button
            type="submit"
            className="text-start text-red-500 hover:line-through "
            onClick={() => setDeleteError(false)}
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

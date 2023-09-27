"use client";
import React, { useEffect, useRef } from "react";
import "@uploadthing/react/styles.css";
import { UploadButton } from "@uploadthing/react";
import { OurFileRouter } from "../../api/uploadthing/core";
import { useState } from "react";
import { Book } from "@/types";
import { usePathname } from "next/navigation";

const EditBook = () => {
  const formRef = useRef<HTMLFormElement>(null);
  const [bookId, setBookId] = useState<number | null>(null);

  const [book, setBook] = useState({
    title: "",
    author: "",
    publisher: "",
    medium: "",
    frontCover: "",
    backCover: "",
  });

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

  const [errorText, setErrorText] = useState("");
  const [uploaded, setUploaded] = useState(false);

  useEffect(() => {
    if (frontImage.length && backImage.length) {
      setBook((prevBook) => ({
        ...prevBook,
        frontCover: frontImage[0].fileUrl,
        backCover: backImage[0].fileUrl,
      }));
    }
  }, [frontImage, backImage]);

  const frontDelete = () => {
    setFrontImage([]);
    setBook((prevBook) => ({
      ...prevBook,
      frontCover: "",
    }));
  };

  const backDelete = () => {
    setBackImage([]);
    setBook((prevBook) => ({
      ...prevBook,
      backCover: "",
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

  const submitBook = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    console.log("Submitting book:", book);

    if (!bookId || typeof bookId !== "number") {
      setErrorText("Invalid book ID.");
      return;
    }
    console.log("URL:", `/api/book/${bookId}`);

    try {
      const response = await fetch(`/api/book/edit/${bookId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(book),
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
          frontDelete();
          backDelete();
        }
        console.log(`Sending PUT request for bookId: ${bookId}`);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const currentPage = usePathname();
  useEffect(() => {
    const getBooks = async () => {
      const res = await fetch(`/api/book/${currentPage.split("/")[3]}`);
      const data = await res.json();
      setBookId(data.id);
      setBook(data);
    };
    getBooks();
  }, []);

  return (
    <div>
      <div>
        <form ref={formRef} onSubmit={submitBook}>
          <div className="flex flex-col">
            <input
              type="text"
              placeholder={book.title}
              className="border-black text-[20px] border-[3px] p-2 placeholder:text-black  w-[550px] focus:outline-none"
              onChange={handleTitleChange}
            />
            {errorText.includes("title") && (
              <p className="text-red-500">Missing title field</p>
            )}
            <input
              type="text"
              placeholder={book.author}
              className="border-black text-[20px] border-[3px] p-2 placeholder:text-black mt-6 w-[550px] focus:outline-none"
              onChange={handleAuthorChange}
            />
            {errorText.includes("author") && (
              <p className="text-red-500">Missing author field</p>
            )}
            <input
              type="text"
              placeholder={book.publisher}
              className="border-black text-[20px] border-[3px] p-2 placeholder:text-black mt-6 w-[550px] focus:outline-none"
              onChange={handlePublisherChange}
            />
            {errorText.includes("publisher") && (
              <p className="text-red-500">Missing publisher field</p>
            )}
            <select
              className="border-black text-[20px] border-[3px] p-2 placeholder:text-black mt-6 w-[550px] focus:outline-none cursor-pointer"
              onChange={handleMediumChange}
            >
              <option value="" disabled selected>
                Edit medium
              </option>
              <option value="painting">Painting</option>
              <option value="sculpture">Sculpture</option>
              <option value="photography_film">Photography/film</option>
              <option value="catalogs_magazines">Catalogs and Magazines</option>
              <option value="anthologies_miscellaneous">
                Anthologies/miscellaneous
              </option>
            </select>
            {errorText.includes("medium") && (
              <p className="text-red-500">Missing medium field</p>
            )}
            <div className="w-[550px] flex justify-start mt-6">
              <div className="mr-6">
                <div className="">
                  <UploadButton<OurFileRouter>
                    appearance={{
                      button:
                        "ut-ready:bg-slate-400  ut-uploading:cursor-not-allowed rounded-r-none bg-slate-400  bg-none after:bg-orange-400",
                    }}
                    content={{
                      allowedContent: (
                        <div className="text-[12px] mt-2">
                          Font cover photo
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
              </div>

              <div className="mr-6">
                <div className="">
                  <UploadButton<OurFileRouter>
                    appearance={{
                      button:
                        "ut-ready:bg-slate-400  ut-uploading:cursor-not-allowed rounded-r-none bg-slate-400  bg-none after:bg-orange-400",
                    }}
                    content={{
                      allowedContent: (
                        <div className="text-[12px] mt-2">
                          Back cover photo
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
              </div>
            </div>
            <div className="flex mt-10 relative">
              {frontImage.length > 0 && (
                <div className="w-[200px] ">
                  <img src={frontImage[0].fileUrl} alt="" />
                  <p className="text-center">Front Cover</p>
                  <button
                    className="absolute top-0 left-1 w-[20px] bg-white"
                    onClick={frontDelete}
                  >
                    <img src="/delete.png" alt="" />
                  </button>
                </div>
              )}

              {backImage.length > 0 && (
                <div className="w-[200px] relative">
                  <img src={backImage[0].fileUrl} alt="" />
                  <p className="text-center">Back Cover</p>
                  <button
                    className="absolute top-0 left-1 w-[20px] bg-white"
                    onClick={backDelete}
                  >
                    <img src="/delete.png" alt="" />
                  </button>
                </div>
              )}
            </div>

            {uploaded ? (
              <p className="text-[32px] text-red-500 text-start mt-4 hover:line-through">
                Edited!
              </p>
            ) : (
              <button
                type="submit"
                className="text-[32px] text-red-500 text-start mt-4 hover:line-through"
              >
                Edit
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditBook;

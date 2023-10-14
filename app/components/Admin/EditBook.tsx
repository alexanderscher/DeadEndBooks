"use client";
import React, { useEffect, useRef } from "react";
import "@uploadthing/react/styles.css";
import { UploadButton } from "@uploadthing/react";
import { OurFileRouter } from "../../api/uploadthing/core";
import { useState } from "react";
import { Book } from "@/types";
import { usePathname } from "next/navigation";
import { useRouter } from "next/navigation";

interface Props {
  isSmallDevice: boolean;
}
const EditBook = ({ isSmallDevice }: Props) => {
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
  });

  const [book, setBook] = useState({
    title: "",
    author: "",
    publisher: "",
    medium: "",
    photo_front: "",
    photo_back: "",
  });

  console.log(bookPlaceHolder);

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

  const [errorText, setErrorText] = useState("");
  const [uploaded, setUploaded] = useState(false);

  useEffect(() => {
    if (frontImage.length) {
      setBook((prevBook) => ({
        ...prevBook,
        photo_front: frontImage[0].fileUrl,
      }));
    }
  }, [frontImage]);

  useEffect(() => {
    if (backImage.length) {
      setBook((prevBook) => ({
        ...prevBook,

        photo_back: backImage[0].fileUrl,
      }));
    }
  }, [backImage]);

  const frontDelete = () => {
    setFrontImage([]);
    setBook((prevBook) => ({
      ...prevBook,
      photo_front: "",
    }));
  };

  const backDelete = () => {
    setBackImage([]);
    setBook((prevBook) => ({
      ...prevBook,
      photo_back: "",
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
        setErrorText(errorText);
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
        }
        router.push(`/admin/editbook/${book.title}`);
      } catch (error) {
        console.error(error);
      }
    }
  };

  return (
    <div>
      <div className="">
        <form ref={formRef} onSubmit={submitBook}>
          <div className="flex flex-col max-w-[800px]">
            <h1 className="text-[26px] mb-10">{bookPlaceHolder.title}</h1>
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
              <option value="catalogs_magazines">Catalogs and Magazines</option>
              <option value="anthologies_miscellaneous">
                Anthologies/miscellaneous
              </option>
            </select>
            {errorText.includes("medium") && (
              <p className="text-red-500">Missing medium field</p>
            )}
            <div className="w-full flex justify-start mt-6">
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
                          Edit back cover photo
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
                <div className="w-[300px] mr-6">
                  <img src={frontImage[0].fileUrl} alt="" />
                  <div className="flex justify-between">
                    <p className="text-cente text-slate-400">Front Cover</p>
                    <p
                      className="text-center cursor-pointer text-slate-400"
                      onClick={frontDelete}
                    >
                      Undo
                    </p>
                  </div>
                </div>
              )}

              {backImage.length > 0 && (
                <div className="w-[300px] relative">
                  <img src={backImage[0].fileUrl} alt="" />
                  <div className="flex justify-between">
                    <p className="text-cente text-slate-400">Back Cover</p>
                    <p
                      className="text-center cursor-pointer text-slate-400"
                      onClick={backDelete}
                    >
                      Undo
                    </p>
                  </div>
                </div>
              )}
            </div>
            <div className="flex">
              {uploaded ? (
                <p className="text-[26px] text-red-500 text-start mt-4 hover:line-through">
                  Edited!
                </p>
              ) : (
                <button
                  type="submit"
                  className="text-[26px] text-red-500 text-start mt-4 hover:line-through"
                >
                  Edit
                </button>
              )}

              <button
                onClick={deleteBook}
                className="text-[26px] text-red-500 text-start mt-4 hover:line-through ml-6"
              >
                Delete
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditBook;

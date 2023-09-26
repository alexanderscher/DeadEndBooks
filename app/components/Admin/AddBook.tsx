"use client";
import React, { useEffect } from "react";
import { UploadBackImage, UploadFrontImage } from "..";
import "@uploadthing/react/styles.css";
import { UploadButton } from "@uploadthing/react";
import { OurFileRouter } from "../../api/uploadthing/core";
import { useState } from "react";

interface Book {
  title: string;
  author: string;
  publisher: string;
  medium: string;
  frontCover: string;
  backCover: string;
}

const AddBook = () => {
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

  const submitBook = async (book: Book) => {
    console.log(book);
    try {
      const response = await fetch("/api/book", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },

        body: JSON.stringify({
          title: book.title,
          author: book.author,
          publisher: book.publisher,
          medium: book.medium,
          frontCover: book.frontCover,
          backCover: book.backCover,
        }),
      });
      if (!response.ok) {
        const errorText = await response.text();
        throw errorText;
      }
    } catch (error) {
      console.error(error);
      throw error;
    }

    console.log(book);
  };

  return (
    <div className="mt-16">
      <div className="flex flex-col w-1/2">
        <input
          type="text"
          placeholder="Title"
          className="border-black text-[20px] border-[3px] p-2 placeholder:text-black mt-6 w-[500px] focus:outline-none"
          onChange={handleTitleChange}
        />
        <input
          type="text"
          placeholder="Author"
          className="border-black text-[20px] border-[3px] p-2 placeholder:text-black mt-6 w-[500px] focus:outline-none"
          onChange={handleAuthorChange}
        />
        <input
          type="text"
          placeholder="Publisher"
          className="border-black text-[20px] border-[3px] p-2 placeholder:text-black mt-6 w-[500px] focus:outline-none"
          onChange={handlePublisherChange}
        />
        <select
          className="border-black text-[20px] border-[3px] p-2 placeholder:text-black mt-6 w-[500px] focus:outline-none cursor-pointer"
          onChange={handleMediumChange}
        >
          <option value="painting">Painting</option>
          <option value="sculpture">Sculpture</option>
          <option value="photography_film">Photography/film</option>
          <option value="catalogs_magazines">Catalogs and Magazines</option>
          <option value="anthologies_miscellaneous">
            Anthologies/miscellaneous
          </option>
        </select>
        <div className="w-[500px] flex justify-start mt-6">
          <div className="mr-6">
            <div className="">
              <UploadButton<OurFileRouter>
                appearance={{
                  button:
                    "ut-ready:bg-slate-400  ut-uploading:cursor-not-allowed rounded-r-none bg-slate-400  bg-none after:bg-orange-400",
                }}
                content={{
                  allowedContent: (
                    <div className="text-[12px] mt-2">Font cover photo</div>
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
                    <div className="text-[12px] mt-2">Back cover photo</div>
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
        {/* <button
          className="border-red-500 bg-red-500 text-white text-[20px] border-[3px] p-2 placeholder:text-black mt-6 w-[500px]"
          onClick={submitBook}
        >
          Upload
        </button> */}
        <button
          className="text-[32px] text-red-500 text-start mt-4 hover:line-through"
          onClick={() => submitBook(book)}
        >
          Upload
        </button>
      </div>
    </div>
  );
};

export default AddBook;

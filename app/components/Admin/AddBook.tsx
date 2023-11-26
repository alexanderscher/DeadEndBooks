"use client";
import React, { useEffect, useRef } from "react";
import "@uploadthing/react/styles.css";
import { UploadButton } from "@uploadthing/react";
import { useState } from "react";
import { OurFileRouter } from "@/app/api/uploadthing/core";
import { deleteUploadThingImage } from "@/app/actions/photo/delete";
import { useDeviceQueries } from "@/utils/deviceQueries";

const AddBook = () => {
  const { isSmallDevice } = useDeviceQueries();
  const formRef = useRef<HTMLFormElement>(null);
  const [book, setBook] = useState({
    title: "",
    author: "",
    publisher: "",
    medium: "",
    frontCover: "",
    frontCoverKey: "",
    backCover: "",
    backCoverKey: "",
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
        frontCoverKey: frontImage[0].fileKey,
        backCover: backImage[0].fileUrl,
        backCoverKey: backImage[0].fileKey,
      }));
    }
  }, [frontImage, backImage]);

  const frontDelete = async () => {
    deleteUploadThingImage(frontImage[0].fileKey);
    setFrontImage([]);
    setBook((prevBook) => ({
      ...prevBook,
      frontCover: "",
    }));
  };

  const backDelete = () => {
    deleteUploadThingImage(backImage[0].fileKey);
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

  const [selectedMedium, setSelectedMedium] = React.useState("");

  const handleMediumChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { value } = e.target;
    setSelectedMedium(e.target.value);
    setBook((prevBook) => ({
      ...prevBook,
      medium: value,
    }));
  };

  const submitBook = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const thebook = {
      title: book.title,
      author: book.author,
      publisher: book.publisher,
      medium: book.medium,
      frontCover: book.frontCover,
      frontCoverKey: book.frontCoverKey,
      backCover: book.backCover,
      backCoverKey: book.backCoverKey,
    };

    try {
      const response = await fetch("/api/admin/book", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },

        body: JSON.stringify({
          title: thebook.title,
          author: thebook.author,
          publisher: thebook.publisher,
          medium: thebook.medium,
          frontCover: thebook.frontCover,
          backCover: thebook.backCover,
          frontCoverKey: thebook.frontCoverKey,
          backCoverKey: thebook.backCoverKey,
        }),
      });
      if (!response.ok) {
        const errorText = await response.text();
        setErrorText(errorText);
        throw errorText;
      } else {
        setErrorText("");

        setUploaded(true);

        setTimeout(() => {
          setUploaded(false);
          location.reload();
        }, 2000);

        if (formRef.current) {
          formRef.current.reset();
          setBook((prevBook) => ({
            ...prevBook,
            frontCover: "",
          }));
          setBook((prevBook) => ({
            ...prevBook,
            backCover: "",
          }));
        }
      }
    } catch (error) {
      console.error(error);
      throw error;
    }
  };

  return (
    <div className="mt-2">
      <form ref={formRef} onSubmit={submitBook}>
        <div className="flex flex-col w-full max-w-[840px]">
          <input
            type="text"
            placeholder="Title"
            className="border-black text-[18px] border-[3px] p-2 placeholder:text-black mt-6 w-full max-w-[840px] focus:outline-none"
            onChange={handleTitleChange}
          />
          {errorText.includes("title") && (
            <p className="text-red-500">Missing title field</p>
          )}
          <input
            type="text"
            placeholder="Author"
            className="border-black text-[18px] border-[3px] p-2 placeholder:text-black mt-6 w-full max-w-[840px] focus:outline-none"
            onChange={handleAuthorChange}
          />
          {errorText.includes("author") && (
            <p className="text-red-500">Missing author field</p>
          )}
          <input
            type="text"
            placeholder="Publisher"
            className="border-black text-[18px] border-[3px] p-2 placeholder:text-black mt-6 w-full max-w-[840px] focus:outline-none"
            onChange={handlePublisherChange}
          />
          {errorText.includes("publisher") && (
            <p className="text-red-500">Missing publisher field</p>
          )}
          <select
            className="border-black text-[18px] border-[3px] p-2 placeholder:text-black mt-6 w-full max-w-[840px] focus:outline-none cursor-pointer h-[50px]"
            value={selectedMedium}
            onChange={handleMediumChange}
          >
            <option value="" disabled>
              Select a medium
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
          <div
            className={
              isSmallDevice
                ? "w-full max-w-[840px] flex justify-center mt-6"
                : "w-full max-w-[840px] flex justify-start mt-6"
            }
          >
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
                  onUploadError={(error) => {
                    console.log("Error: ", error);
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
                  onUploadError={(error) => {
                    console.log("Error: ", error);
                  }}
                />
              </div>
            </div>
          </div>
          <div className="flex mt-10 space-x-4 relative w-full max-w-[840px]">
            {frontImage.length > 0 && (
              <div className="flex-1 p-4 border-[2px] border-slate-400  bg-white flex flex-col">
                <div className="flex-grow mb-2">
                  <img
                    src={frontImage[0].fileUrl}
                    alt=""
                    className="w-full h-auto "
                  />
                </div>
                <div className="text-center">
                  <p className="text-slate-400 mb-1">Front Cover</p>
                  <p
                    className="cursor-pointer text-slate-400"
                    onClick={frontDelete}
                  >
                    Undo
                  </p>
                </div>
              </div>
            )}

            {backImage.length > 0 && (
              <div className="flex-1 p-4 border-[2px] border-slate-400  bg-white flex flex-col">
                <div className="flex-grow mb-2">
                  <img
                    src={backImage[0].fileUrl}
                    alt=""
                    className="w-full h-auto "
                  />
                </div>
                <div className="text-center">
                  <p className="text-slate-400 mb-1">Back Cover</p>
                  <p
                    className="cursor-pointer text-slate-400"
                    onClick={backDelete}
                  >
                    Undo
                  </p>
                </div>
              </div>
            )}
          </div>

          {uploaded ? (
            <button className="text-[22px] text-red-500 border-red-500 border-[3px] hover:line-through mt-6 p-2">
              Uploaded
            </button>
          ) : (
            <button
              type="submit"
              className="text-[22px] text-red-500 border-red-500 border-[3px] hover:line-through mt-6 p-2"
            >
              Upload
            </button>
          )}
        </div>
      </form>
    </div>
  );
};

export default AddBook;

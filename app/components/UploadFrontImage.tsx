"use client";

// You need to import our styles for the button to look right. Best to import in the root /layout.tsx but this is fine
import "@uploadthing/react/styles.css";

import { UploadButton } from "@uploadthing/react";
import { OurFileRouter } from "../api/uploadthing/core";
import { useState } from "react";

import Link from "next/link";

export default function UploadFrontImage() {
  const [images, setImages] = useState<
    {
      fileUrl: string;
      fileKey: string;
    }[]
  >([]);

  const imgLists = (
    <>
      <ul>
        {images.map((image) => (
          <li className="w-[00px]" key={image.fileUrl}>
            <Link href={image.fileUrl} target="_blank">
              <img src={image.fileUrl} />
            </Link>
          </li>
        ))}
      </ul>
    </>
  );

  return (
    <main className="">
      <UploadButton<OurFileRouter>
        content={{
          button({ ready }) {
            if (ready) return <div>Front cover photo</div>;

            return "Getting ready...";
          },
        }}
        className="mt-4 ut-button:bg-red-500 ut-button:ut-readying:bg-red-500/50"
        endpoint="imageUploader"
        onClientUploadComplete={(res) => {
          if (res) {
            setImages(res);
            const json = JSON.stringify(res);
            console.log(json);
          }
        }}
        onUploadError={(error: Error) => {
          // Do something with the error.
          alert(`ERROR! ${error.message}`);
        }}
      />
      {imgLists}
    </main>
  );
}

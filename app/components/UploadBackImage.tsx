"use client";

// You need to import our styles for the button to look right. Best to import in the root /layout.tsx but this is fine
import "@uploadthing/react/styles.css";

import { UploadButton } from "@uploadthing/react";
import { OurFileRouter } from "../api/uploadthing/core";
import { useState } from "react";

import Link from "next/link";

export default function UploadBackImage() {
  const [images, setImages] = useState<
    {
      fileUrl: string;
      fileKey: string;
    }[]
  >([]);

  // const title = images.length ? (
  //   <>
  //     <p>Upload complete</p>
  //   </>
  // ) : null;

  const imgLists = (
    <>
      <ul>
        {images.map((image) => (
          <li key={image.fileUrl}>
            <Link href={image.fileUrl} target="_blank">
              <img src={image.fileUrl} />
            </Link>
          </li>
        ))}
      </ul>
    </>
  );

  return (
    <main className="flex flex-col items-start">
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
      <div className="w-[200px] mt-6"> {imgLists}</div>
    </main>
  );
}

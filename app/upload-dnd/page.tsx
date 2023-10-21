"use client";

import "@uploadthing/react/styles.css";

import { UploadDropzone } from "@uploadthing/react";
import { OurFileRouter } from "../api/uploadthing/core";
import { useState } from "react";
import Link from "next/link";

export default function UploadDND() {
  const [images, setImages] = useState<
    {
      fileUrl: string;
      fileKey: string;
    }[]
  >([]);

  const title = images.length ? (
    <>
      <p>Upload complete</p>
      <p className="mt-2">{images.length}</p>
    </>
  ) : null;

  const imgLists = (
    <>
      {title}
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
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <UploadDropzone<OurFileRouter>
        endpoint="imageUploader"
        onClientUploadComplete={(res) => {
          if (res) {
            setImages(res);
            const json = JSON.stringify(res);
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

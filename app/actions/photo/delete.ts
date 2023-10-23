"use server";

import { utapi } from "uploadthing/server";

export const deleteUploadThingImage = async (fileKey: string) => {
  const result = await utapi.deleteFiles(fileKey);
  console.log(fileKey);

  return result;
};

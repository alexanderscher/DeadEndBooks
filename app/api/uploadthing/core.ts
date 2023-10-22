import { createUploadthing, type FileRouter } from "uploadthing/next";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/route";
import { ExtendedSession } from "@/types";

const f = createUploadthing();

// const auth = async (req: Request) => {
//   const serverSession = await getServerSession(authOptions);
//   const sessionadmin = (serverSession as ExtendedSession)?.user?.admin;

//   if (!sessionadmin) return null;

//   return { id: (serverSession as ExtendedSession)?.user?.id };
// };

export const ourFileRouter = {
  imageUploader: f({ image: { maxFileSize: "4MB", maxFileCount: 1 } })
    .middleware(async ({ req }) => {
      // const user = await auth(req);

      // if (!user) throw new Error("Unauthorized");

      // return { userId: user.id };
      return {};
    })
    .onUploadComplete(async ({ metadata, file }) => {
      console.log("file url", file.url);
    }),
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;

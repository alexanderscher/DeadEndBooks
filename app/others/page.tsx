"use server";
import Navbar from "../components/Navbar/Navbar";
import { Others, ProfileNav } from "../components";
import { getServerSession } from "next-auth";
import { ExtendedSession } from "@/types";
import { isProduction } from "@/utils/name";
import { authOptions } from "@/utils/auth";

const page = async () => {
  const serverSession = await getServerSession(authOptions);
  const sessionId = (serverSession as ExtendedSession)?.user?.id;

  return (
    <main className={"page"}>
      <>
        <Navbar />
        <Others sessionId={sessionId} />
      </>
    </main>
  );
};

export default page;

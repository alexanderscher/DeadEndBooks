"use server";
import Navbar from "../components/Navbar/Navbar";
import { Others, ProfileNav } from "../components";
import { getServerSession } from "next-auth";
import { ExtendedSession } from "@/types";
import { authOptions } from "../api/auth/[...nextauth]/route";
import { isProduction } from "@/utils/name";

const page = async () => {
  const serverSession = await getServerSession(authOptions);
  const sessionId = (serverSession as ExtendedSession)?.user?.id;

  let data = null;

  if (sessionId) {
    const url = isProduction();
    const res = await fetch(`${url}/api/user/other`, {
      cache: "no-cache",
    });
    data = await res.json();
  } else {
    data = null;
  }

  return (
    <main className={"page"}>
      <>
        <Navbar />

        <Others res={data} sessionId={sessionId} />
      </>
    </main>
  );
};

export default page;

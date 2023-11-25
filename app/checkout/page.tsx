import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { Checkout, EditProfile, History, Navbar } from "@/app/components";

import { ExtendedSession } from "@/types";
import { isProduction } from "@/utils/name";
import { getServerSession } from "next-auth";

const page = async () => {
  const serverSession = await getServerSession(authOptions);
  const sessionId = (serverSession as ExtendedSession)?.user?.id;

  let data = null;
  const cartBooks = [];

  if (serverSession) {
    const url = isProduction();
    const res = await fetch(`${url}/api/user/${sessionId}`, {
      cache: "no-cache",
    });
    data = await res.json();

    for (const key in data.Cart) {
      const res = await fetch(`${url}/api/book/${data.Cart[key].bookId}`);
      const book = await res.json();
      cartBooks.push({ ...book, cartId: data.Cart[key].id });
    }
  }

  return (
    <main className={"page"}>
      <>
        <Navbar />
        <div className={" w-full"}>
          <Checkout res={data} cartBooks={cartBooks} session={serverSession} />
        </div>
      </>
    </main>
  );
};

export default page;

"use server";
import { Books, Navbar } from "@/app/components";
const page = async () => {
  return (
    <main className={"page"}>
      <>
        <Navbar />
        <Books />
      </>
    </main>
  );
};

export default page;

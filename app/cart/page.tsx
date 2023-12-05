"use server";
import Navbar from "../components/Navbar/Navbar";
import { Cart } from "../components";

const page = async () => {
  return (
    <main className={"page"}>
      <>
        <Navbar />

        <div className={" w-full"}>
          <Cart />
        </div>
      </>
    </main>
  );
};

export default page;

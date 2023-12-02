import { isProduction } from "@/utils/name";
import { Books, Navbar } from "../components";
import { SearchProvider } from "@/app/components/Search/SearchContext";

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

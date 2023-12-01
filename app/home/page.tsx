import { isProduction } from "@/utils/name";
import { Books, Navbar } from "../components";
import { SearchProvider } from "@/app/components/Search/SearchContext";

const page = async () => {
  const url = isProduction();
  const res = await fetch(`${url}/api/book`, {
    cache: "no-cache",
    method: "PUT",
    next: { tags: ["all-books"], revalidate: 0 },
  });
  const data = await res.json();

  return (
    <main className={"page"}>
      <>
        <Navbar data={data} />
        <Books res={data} />
      </>
    </main>
  );
};

export default page;

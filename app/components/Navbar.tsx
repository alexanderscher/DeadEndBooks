"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

interface Props {
  isSmallDevice: boolean;
}

const Navbar = ({ isSmallDevice }: Props) => {
  const currentPage = usePathname();
  const [sort, setSort] = useState(false);
  const [menu, setMenu] = useState(false);

  return (
    <>
      {isSmallDevice ? (
        <div className="flex-col page-margin-small ">
          <div
            className={`w-full flex justify-between  ${
              currentPage === "/" ? "items-center" : "items-end"
            }`}
          >
            <h1 className="font-bold text-[50px]">
              <Link href="/">DEAD END BOOKS</Link>
            </h1>

            {currentPage === "/" ? (
              <div className="mt-2">
                <h1
                  className="text-xl cursor-pointer text-end hover:line-through"
                  onClick={() => {
                    setMenu(!menu), setSort(false);
                  }}
                >
                  Menu
                </h1>

                <h1
                  className="text-xl cursor-pointer text-end hover:line-through"
                  onClick={() => {
                    setSort(!sort), setMenu(false);
                  }}
                >
                  Sort
                </h1>
              </div>
            ) : (
              <h1
                className="text-[26px] cursor-pointer text-end mb-2 hover:line-through"
                onClick={() => setMenu(!menu)}
              >
                Menu
              </h1>
            )}
          </div>
          {menu && (
            <div className="flex mt-4">
              <button className="hover:line-through text-lg mr-2">
                <Link href="/">Library,</Link>
              </button>

              <button className="hover:line-through text-lg mr-2">
                <Link href="/subscribe">Subscribe,</Link>
              </button>
              <button className="hover:line-through text-lg mr-2">
                <Link href="/about">About,</Link>
              </button>

              <button className="hover:line-through text-lg mr-2">
                <Link href="/cart">Cart,</Link>
              </button>
              <button className="hover:line-through text-lg mr-2">
                <Link href="/saved">Saved,</Link>
              </button>
              <button className="hover:line-through text-lg mr-2">
                <Link href="/cue">Cue,</Link>
              </button>
              <button className="hover:line-through text-lg mr-2">
                <Link href="/profile">Profile,</Link>
              </button>
              <button className="hover:line-through text-lg mr-2">
                <Link href="/saved">Other's reads</Link>
              </button>
            </div>
          )}
          {sort && (
            <div className="flex flex-wrap mt-4">
              <button className="hover:line-through text-lg mr-2">All,</button>
              <button className="hover:line-through text-lg mr-2">
                Painting,
              </button>
              <button className="hover:line-through text-lg mr-2">
                Photography/film,
              </button>
              <button className="hover:line-through text-lg mr-2">
                Catalogs and Magazines,
              </button>
              <button className="hover:line-through text-lg mr-2">
                Anthologies/miscellaneous
              </button>
            </div>
          )}
        </div>
      ) : (
        <div className="w-1/4 min-w-[200px] max-w-[200px]  page-margin">
          <div className="fixed">
            <div className="">
              <div className="">
                <h1 className="font-bold text-lg">
                  <Link href="/">DEAD END BOOKS</Link>
                </h1>
              </div>
              <div className="mt-5 flex flex-col items-start">
                <button className={`hover:line-through text-lg`}>
                  <Link href="/">Library</Link>
                </button>
              </div>
              <div className="">
                {currentPage === "/" ? (
                  <div className="flex flex-col items-start">
                    <button
                      className="hover:line-through text-lg flex items-center"
                      onClick={() => {
                        setSort(!sort);
                      }}
                    >
                      Sort by medium:
                    </button>
                    {sort && (
                      <div className="flex flex-col items-start text-md">
                        <button className="hover:line-through ">All</button>
                        <button className="hover:line-through ">
                          Painting
                        </button>
                        <button className="hover:line-through ">
                          Photography/film
                        </button>
                        <button className="hover:line-through ">
                          Catalogs and Magazines
                        </button>
                        <button className="hover:line-through ">
                          Anthologies/miscellaneous
                        </button>
                      </div>
                    )}
                  </div>
                ) : null}
              </div>
              <div className="mt-5 flex flex-col items-start">
                <button className="hover:line-through text-lg">
                  <Link href="/subscribe">Subscribe</Link>
                </button>
                <button className="hover:line-through text-lg">
                  <Link href="/about">About</Link>
                </button>
              </div>
              <div className="mt-5 flex flex-col items-start">
                <button className="hover:line-through text-lg">
                  <Link href="/cart">Cart</Link>
                </button>
                <button className="hover:line-through text-lg mr-2">
                  <Link href="/saved">Saved</Link>
                </button>
                <button className="hover:line-through text-lg">
                  <Link href="/cue">Cue</Link>
                </button>
              </div>

              <div className="mt-5 flex flex-col items-start">
                <button className="hover:line-through text-lg">
                  <Link href="/profile">Profile</Link>
                </button>
                <button className="hover:line-through text-lg mr-2">
                  <Link href="/saved">Other's reads</Link>
                </button>
              </div>

              <div className="mt-5 flex flex-col items-start text-lg">
                <a
                  className="hover:line-through"
                  href="mailto:deadendbooks@gmail.com"
                >
                  Email
                </a>

                <button className="hover:line-through text-lg">
                  <a
                    target="_blank"
                    href="https://www.instagram.com/deadendbooks_/"
                  >
                    Instagram
                  </a>
                </button>
                <button className="hover:line-through text-lg mr-2">
                  <Link href="/admin">Admin</Link>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Navbar;

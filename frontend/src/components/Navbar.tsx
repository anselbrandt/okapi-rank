import { CATEGORIES } from "@/data/categories";
import Link from "next/link";

const updatedAt = process.env.NEXT_PUBLIC_BUILD_TIME || "";
const timeString = new Date(updatedAt).toLocaleTimeString("en-GB", {
  hour: "2-digit",
  minute: "2-digit",
  hour12: true,
});

interface Props {
  params: {
    categories?: string[];
  };
}

export const Navbar: React.FC<Props> = ({ params }) => {
  const categoryParam = params?.categories?.[0];
  const subcatParam = params?.categories?.[1];
  const category =
    categoryParam && CATEGORIES.hasOwnProperty(categoryParam)
      ? CATEGORIES[categoryParam]
      : CATEGORIES["home"];

  return (
    <nav className="w-full bg-neutral-50 border-t-4 border-neutral-600">
      <div className="flex flex-col items-center border-b-2 border-neutral-300">
        <div className="font-mono tracking-widest font-semibold text-4xl md:text-6xl p-3">
          OKAPI
        </div>
        <div className="mb-2 font-sans text-sm">Updated at {timeString}</div>
      </div>

      {/* Main Category Tabs */}
      <ul className="w-full xl:max-w-7xl mx-auto flex gap-4 md:gap-6 px-4 py-2 overflow-x-auto font-bold whitespace-nowrap">
        {Object.values(CATEGORIES).map((value) => {
          const isActive = category?.name === value.name;
          return (
            <li key={value.name}>
              <Link
                href={`/${value.name}`}
                className={`px-2 py-1 text-sm tracking-widest rounded hover:bg-sky-700 hover:text-neutral-50 transition ${
                  isActive ? "bg-sky-700 text-neutral-50" : ""
                }`}
              >
                {value.displayName.toUpperCase()}
              </Link>
            </li>
          );
        })}
      </ul>

      {/* Subcategory Tabs */}
      {category?.subcategories &&
        Object.values(category.subcategories).length > 0 && (
          <div className="bg-black text-white text-center py-4">
            <div className="text-4xl md:text-6xl font-bold mb-2">
              {category.displayName}
            </div>
            <ul className="flex flex-wrap justify-center gap-4 text-sm font-bold">
              {Object.values(category.subcategories)
                .filter((subcat) => subcat.name !== category.name)
                .map((subcat) => {
                  const isActiveSubcat = subcatParam == subcat.name;
                  return (
                    <li key={subcat.name}>
                      <Link
                        href={`/${category.name}/${subcat.name}`}
                        className={`hover:text-orange-500 transition ${
                          isActiveSubcat ? "text-orange-500" : ""
                        }`}
                      >
                        {subcat.displayName.toUpperCase()}
                      </Link>
                    </li>
                  );
                })}
            </ul>
          </div>
        )}
    </nav>
  );
};

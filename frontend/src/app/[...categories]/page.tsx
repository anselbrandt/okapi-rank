import { FeedWrapper } from "./FeedWrapper";
import { Navbar } from "@/components/Navbar";
import { PATHS } from "@/data/paths";

export function generateStaticParams() {
  return PATHS;
}

export default async function Page({
  params,
}: {
  params: Promise<{ categories: string[] }>;
}) {
  const { categories } = await params;
  const [main, sub] = categories;
  const section = sub ? `${main}/${sub}` : `${main}/${main}`;

  return (
    <div className="min-h-screen bg-neutral-50 overflow-x-hidden">
      <Navbar params={params} />
      <FeedWrapper section={section} />
    </div>
  );
}

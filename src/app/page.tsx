import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <div className="font-sans grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20">
      <main className="flex flex-col gap-[32px] row-start-2 items-center sm:items-start">
        <h1>PYDEPDATE</h1>
        <Link href="/packages">
          <Image
            className="dark:invert"
            src="/package.webp"
            alt="packages"
            width={1000}
            height={250}
            priority
          />
        </Link>
      </main>
    </div>
  );
}

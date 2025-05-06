import Link from "next/link";

export default function NotFound() {
  return (
    <div className="mx-auto max-w-screen-md w-full  text-center">
      <div className="bg-not-found bg-no-repeat bg-center h-[400px]">
        <h1 className="font-[] text-[80px] font-bold">404</h1>
      </div>
      <div className="mt-[-50px]">
        <h2 className="text-[35px]">{`Look like you're lost`}</h2>
        <p className="text-sm">the page you are looking for not avaible!</p>
        <Link
          href={"/"}
          className="inline-block my-5 px-5 py-2.5 bg-primary text-white rounded-md"
        >
          Go to Home
        </Link>
      </div>
    </div>
  );
}

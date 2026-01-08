import { useRouter } from "next/navigation";

export default function Landing() {
  const router = useRouter();
  function ToSignIn() {
    router.push("/register");
  }
  return (
    <div className="flex min-h-screen flex-col justify-center bg-gray-900 px-6 py-12 lg:px-8">
      <button
        onClick={ToSignIn}
        className="flex w-full justify-center rounded-md bg-indigo-500 px-3 py-1.5 text-sm/6 font-semibold text-white hover:bg-indigo-400 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500"
      >
        Sign Up{" "}
      </button>
    </div>
  );
}

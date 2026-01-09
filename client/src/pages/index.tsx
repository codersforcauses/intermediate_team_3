import { useRouter } from "next/navigation";

export default function Landing() {
  const router = useRouter();
  function ToLogin() {
    router.push("/login");
  }
  return (
    <div className="flex min-h-screen flex-col justify-center bg-gray-900 px-6 py-12 lg:px-8">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-white dark:text-neutral-200 sm:text-6xl">
          LonkedIn
        </h1>
        <h3 className="text-4xl font-bold text-indigo-500 dark:text-neutral-200 sm:text-6xl">
          Not a Calendar
        </h3>
        <p className="text-s mb-3 text-white dark:text-neutral-200">
          A streamlined task and time management to-do list.
        </p>
        <p className="text-s mb-3 font-semibold text-white dark:text-neutral-200">
          Create Tasks, Organise Time, Focus on Priorities
        </p>
        <div className="flex h-[50vh] flex-col justify-center bg-indigo-900">
          <p className="text-s mb-3 text-white dark:text-neutral-200">
            {" "}
            *placeholder for images of the other pages{" "}
          </p>
        </div>
        <p className="text-s mb-3 text-white dark:text-neutral-200">
          Sign in to get started
        </p>
        <button
          onClick={ToLogin}
          className="mx-auto flex w-56 justify-center rounded-md bg-indigo-500 px-3 py-1.5 text-sm/6 font-semibold text-white hover:bg-indigo-400 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500"
        >
          Login
        </button>
      </div>
    </div>
  );
}

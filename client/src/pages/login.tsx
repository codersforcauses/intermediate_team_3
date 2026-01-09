"use client";
import { useRouter } from "next/navigation";

export default function Login() {
  const router = useRouter();

  function ToSignIn() {
    router.push("/register");
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    const formData = new FormData(e.currentTarget);

    const res = await fetch("http://127.0.0.1:8000/api/auth/login/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        username: formData.get("username"),
        email: formData.get("email"),
        password: formData.get("password"),
      }),
    });

    const data = await res.json();
    if (!res.ok) {
      alert("Invalid login");
      return;
    }

    localStorage.setItem("access", data.access);
    localStorage.setItem("refresh", data.refresh);

    const token = localStorage.getItem("access");

    const userFetch = await fetch(
      "http://127.0.0.1:8000/api/planner/protected",
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );

    if (!userFetch.ok) {
      alert("Invalid login");
      return;
    }

    router.push("/tasks");
  }

  return (
    <div className="flex min-h-screen flex-col justify-center bg-gray-900 px-6 py-12 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-sm">
        <p className="font-semibold text-white">
          Don&apos;t have an account? Sign Up!
        </p>
        <button
          onClick={ToSignIn}
          className="flex w-full justify-center rounded-md bg-indigo-500 px-3 py-1.5 text-sm/6 font-semibold text-white hover:bg-indigo-400 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500"
        >
          Create New Account
        </button>

        <h2 className="mt-10 text-center text-2xl/9 font-bold tracking-tight text-white">
          Log in to your account
        </h2>
      </div>

      <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="mt-2">
            <label className="block text-sm/6 font-medium text-gray-100">
              Username
            </label>
            <input
              id="username"
              type="text"
              name="username"
              required
              autoComplete="username"
              className="block w-full rounded-md bg-white/5 px-3 py-1.5 text-base text-white outline-1 -outline-offset-1 outline-white/10 placeholder:text-gray-500 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-500 sm:text-sm/6"
            />
          </div>

          <div className="mt-2">
            <label className="block text-sm/6 font-medium text-gray-100">
              Email
            </label>
            <input
              id="email"
              type="email"
              name="email"
              required
              autoComplete="email"
              className="block w-full rounded-md bg-white/5 px-3 py-1.5 text-base text-white outline-1 -outline-offset-1 outline-white/10 placeholder:text-gray-500 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-500 sm:text-sm/6"
            />
          </div>

          <div>
            <div className="mt-2">
              <div className="flex items-center justify-between">
                <label className="block text-sm/6 font-medium text-gray-100">
                  Password
                </label>
                <div className="text-sm">
                  <a className="font-semibold text-indigo-400 hover:text-indigo-300">
                    Forgot password?
                  </a>
                </div>
              </div>
              <input
                id="password"
                type="password"
                name="password"
                required
                className="block w-full rounded-md bg-white/5 px-3 py-1.5 text-base text-white outline-1 -outline-offset-1 outline-white/10 placeholder:text-gray-500 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-500 sm:text-sm/6"
              />
            </div>
          </div>
          <div>
            <button
              type="submit"
              className="flex w-full justify-center rounded-md bg-indigo-500 px-3 py-1.5 text-sm/6 font-semibold text-white hover:bg-indigo-400 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500"
            >
              Sign in
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

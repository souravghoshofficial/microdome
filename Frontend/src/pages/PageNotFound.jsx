import { Link } from "react-router";

const PageNotFound = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center text-center">
      <h1 className="text-7xl font-bold">404</h1>
      <h2 className="text-2xl mt-4">Page Not Found</h2>
      <p className="text-gray-500 mt-2">
        The page you’re trying to access doesn’t exist.
      </p>
      <Link
        to="/"
        className="mt-6 px-5 py-2 border rounded hover:bg-black hover:text-white transition"
      >
        Go Home
      </Link>
    </div>
  );
};

export default PageNotFound;

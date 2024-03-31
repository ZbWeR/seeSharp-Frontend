import { useNavigate, useRouteError } from "react-router-dom";

const ErrorPage = () => {
  const error = useRouteError() as any;
  const navigate = useNavigate();

  const handleBack = () => {
    navigate("/", { replace: true });
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <h1 className="text-4xl font-bold ">😭 Oops!</h1>
      <p className="mt-8 text-lg">Sorry, an unexpected error has occurred.</p>
      <p className="mt-2 text-black/40">{error.statusText || error.message}</p>
      <button
        className="mt-4 text-white btn btn-sm bg-sky-400 hover:bg-sky-500"
        onClick={handleBack}
      >
        Back Home
      </button>
    </div>
  );
};

export default ErrorPage;

import { useReducer, useState } from "react";
import gotiny from "gotiny";
import toast, { Toaster } from "react-hot-toast";

type State = {
  data?: urlData;
  isLoading: boolean;
  error?: Error;
};

type urlData = { shortUrl: string; longUrl: string };

type Action =
  | { type: "request" }
  | { type: "success"; result: urlData }
  | { type: "failure"; error: Error };

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case "request":
      return { isLoading: true };
    case "success":
      return {
        isLoading: false,
        data: action.result,
      };
    case "failure":
      return { isLoading: false, error: action.error };
  }
}

function UrlData(props: urlData) {
  return (
    <div className="text-white py-2 text-center align-middle">
      <button
        className="p-2 bg-blue-600 max-sm:text-left w-full rounded-md hover:bg-blue-500"
        type="button"
        onClick={() => {
          toast.success("Coppied to Clipboard!");
          navigator.clipboard.writeText(props.shortUrl);
        }}
      >
        tiny-url: {props.shortUrl}
      </button>
      <div className="p-1" />
      <button
        className="overflow-ellipsis p-2 w-full max-sm:text-left bg-green-700 rounded-md hover:bg-green-600"
        type="button"
        onClick={() => {
          toast.success("Coppied to Clipboard!");
          navigator.clipboard.writeText(props.longUrl);
        }}
      >
        original-url: {props.longUrl}
      </button>
    </div>
  );
}

export function InputBox() {
  const [input, setInput] = useState("");

  const [{ data, isLoading, error }, dispatch] = useReducer(reducer, {
    isLoading: false,
  });

  async function handleSubmit(e: any, url: string) {
    e.preventDefault();
    dispatch({ type: "request" });
    try {
      const data = await gotiny.set({
        long: url,
      });
      dispatch({
        type: "success",
        result: {
          shortUrl: data[0].link,
          longUrl: data[0].long,
        },
      });
    } catch (error: any) {
      toast.error("Invalid Input");
      dispatch({ type: "failure", error: new Error(error) });
    }
  }

  return (
    <div>
      <Toaster />
      <form>
        <label
          className="block text-gray-800 text-sm font-bold "
          htmlFor="input"
        >
          Input
        </label>
        <input
          type="text"
          placeholder={error ? "Input is Incorrect" : "Input Url"}
          className="shadow appearance-none sm:min-w-max md:w-96 border rounded py-2 px-3 text-gray-700 leading-tight truncate my-2 mr-4 focus:outline-none focus:shadow-outline"
          id="input"
          value={input}
          onChange={(e) => setInput(e.target.value)}
        />
        {isLoading ? (
          <div role="status">
            <svg
              aria-hidden="true"
              className="w-8 h-8 mr-2 text-gray-200 animate-spin dark:text-gray-600 fill-white"
              viewBox="0 0 100 101"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                fill="currentColor"
              />
              <path
                d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                fill="currentFill"
              />
            </svg>
            <span className="sr-only">Loading...</span>
          </div>
        ) : (
          <button
            className="shadow hover:bg-purple-500 dark:bg-purple-600 focus:shadow-outline focus:outline-none text-white font-bold py-2 px-4 rounded"
            type="reset"
            onClick={(e) => {
              handleSubmit(e, input);
              setInput("");
            }}
          >
            Submit
          </button>
        )}
      </form>
      {data ? (
        <UrlData shortUrl={data.shortUrl} longUrl={data.longUrl} />
      ) : null}
    </div>
  );
}

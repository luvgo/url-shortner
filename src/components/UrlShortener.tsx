import { useEffect, useMemo, useReducer, useState } from "react";
import gotiny from "gotiny";

type State = {
  data?: Data;
  isLoading: boolean;
  error?: Error;
};

type Data = {
  longUrl?: string;
  code?: string;
  tiny?: string;
  link?: string;
};

type Action =
  | { type: "request" }
  | { type: "success"; result: Data }
  | { type: "failure"; error: Error };

async function createShortUrl(url: string) {
  try {
    const data = await gotiny.set({
      long: url,
      custom: "ShortUrl",
      useFallback: true,
    });
    return data[0];
  } catch (error) {
    console.error(error);
  }
}

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case "request":
      return { isLoading: true };
    case "success":
      return { isLoading: false, data: action.result };
    case "failure":
      return { isLoading: false, error: action.error };
  }
}

export function InputBox() {
  const [input, setInput] = useState("");
  const [query, setQuery] = useState(false);
  const [{ data, isLoading }, dispatch] = useReducer(reducer, {
    data: { longUrl: input, code: "", tiny: "", link: "" },
    isLoading: false,
  });

  useEffect(() => {
    if (query === false) return;
    dispatch({ type: "request" });
    createShortUrl(input)
      .then((response) => {
        if (response === undefined) throw new Error("response was undefined");
        dispatch({
          type: "success",
          result: {
            longUrl: response.long,
            code: response.code,
            tiny: response.tiny,
            link: response.link,
          },
        });
      })
      .catch((error) => dispatch({ type: "failure", error }));
    setQuery(false);
  }, [query]);

  return (
    <div className="flex justify-center p-5">
      <form>
        <label>
          <input
            type="text"
            placeholder="Input Url"
            value={input}
            name="url"
            onChange={(e) => setInput(e.target.value)}
          />
        </label>
        <button className="pl-3" type="button" onClick={() => setQuery(true)}>
          Submit
        </button>
      </form>
    </div>
  );
}

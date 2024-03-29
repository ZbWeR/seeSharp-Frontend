import { useState } from "react";
import service from "./service";

function App() {
  const [file, setFile] = useState<File | null>(null);
  const [result, setResult] = useState<string>("");

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFile(e.target.files[0]);
    }
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (file) {
      const formData = new FormData();
      formData.append("image", file);
      service
        .request({
          url: "/upload",
          method: "POST",
          data: formData,
        })
        .then((res) => {
          setResult(res.data.data[0].rec_docs);
        });
    }
  };

  return (
    <>
      <div className="flex items-center justify-center w-screen h-screen bg-zinc-50">
        <div className="p-4 bg-white rounded shadow-md">
          <h2 className="text-lg text-sky-400">Upload File</h2>
          <form onSubmit={handleSubmit} className="mt-2 ">
            <input type="file" name="file" onChange={handleFileChange} />
            <button
              type="submit"
              className="px-2 py-1 text-white rounded-md hover:bg-sky-500 bg-sky-400"
            >
              upload
            </button>
          </form>
          <p className="mt-2 ">
            识别结果：<span className="font-bold ">{result}</span>
          </p>
        </div>
      </div>
    </>
  );
}

export default App;

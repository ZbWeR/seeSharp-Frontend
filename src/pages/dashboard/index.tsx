import { message } from "antd";
import axios from "axios";
import { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import List from "./List";
import { uploadImage } from "@/service/api";

const Dashboard = () => {
  const navigate = useNavigate();
  const modalRef = useRef<HTMLDialogElement>(null);
  const adminInfo = JSON.parse(localStorage.getItem("authInfo") || "{}");
  const [userName, setUserName] = useState("");
  const [userPhone, setUserPhone] = useState("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (Object.keys(adminInfo).length === 0) {
      message.error("请先登录");
      navigate("/login");
    }
  }, [navigate, adminInfo]);

  const toggleFaceModal = (action: "open" | "close") => {
    if (!modalRef.current) return console.error("modalRef is not ready");
    if (action === "open") modalRef.current.showModal();
    else modalRef.current.close();
  };

  const handleSubmit = async () => {
    if (!selectedFile) return message.error("请选择文件");
    if (!userName) return message.error("请输入姓名");
    if (!userPhone) return message.error("请输入手机号");

    try {
      setLoading(true);
      const { data } = await axios.post(
        `${import.meta.env.VITE_DATA_API_URL}/see/addUser`,
        {
          name: userName,
          phone: userPhone,
          balance: Math.floor(Math.random() * 1000),
        }
      );
      if (data.statusCode !== 0) return message.error(data?.message || "添加用户失败");

      const res = await uploadImage(selectedFile, data?.data?.id);
      console.log(res);
      if (res.code == -1) return message.error(res?.msg || "上传文件失败");
      message.success("上传成功");
      toggleFaceModal("close");
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center w-full min-h-screen pt-16 overflow-hidden bg-sky-50">
      <h1 className="text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-violet-500">
        Dashboard
      </h1>
      <div className="p-6 mt-4 bg-white border shadow-lg rounded-2xl">
        <div className="flex items-center justify-between">
          <p>🎉 欢迎您，{adminInfo.name} ！</p>
          <button
            className="btn btn-sm"
            onClick={() => {
              toggleFaceModal("open");
            }}
          >
            录入人脸信息
          </button>
        </div>
        <p className="mt-2">您负责的区域是：{adminInfo.area}</p>
      </div>

      <List />

      <dialog ref={modalRef} className="modal">
        <div className="modal-box">
          <h3 className="text-lg font-bold">录入人脸信息</h3>
          <div className="mt-4 text-center ">
            <input
              type="file"
              className="w-full max-w-xs file-input file-input-bordered"
              onChange={(e) => setSelectedFile(e.target?.files?.[0] || null)}
            />
            <label className="flex items-center max-w-xs gap-2 mx-auto mt-2 input input-bordered">
              Name
              <input
                type="text"
                className="grow"
                placeholder="请输入姓名"
                autoComplete="off"
                onChange={(e) => setUserName(e.target.value)}
              />
            </label>
            <label className="flex items-center max-w-xs gap-2 mx-auto mt-2 input input-bordered">
              Phone
              <input
                type="text"
                className="grow"
                placeholder="请输入手机号"
                autoComplete="off"
                onChange={(e) => setUserPhone(e.target.value)}
              />
            </label>
          </div>

          <div className="flex justify-end max-w-xs mx-auto mt-4">
            <button className="btn btn-sm" onClick={() => toggleFaceModal("close")}>
              Close
            </button>
            <button
              className={`ml-2 btn btn-sm btn-secondary ${loading ? "btn-disabled" : ""}`}
              onClick={handleSubmit}
            >
              {loading ? (
                <span className="loading loading-spinner loading-xs"></span>
              ) : (
                "确认"
              )}
            </button>
          </div>
        </div>
      </dialog>
    </div>
  );
};

export default Dashboard;

import AdminSvg from "@/assets/svg/admin.svg?react";
import UserSvg from "@/assets/svg/user.svg?react";
import RetrySvg from "@/assets/svg/retry.svg?react";
import { useState, useRef, useCallback } from "react";
import { faceAuth } from "@/service/api";
import { message } from "antd";
import { useCamera } from "@/hooks/useCamera";
import { useNavigate } from "react-router-dom";

interface LoginInfo {
  title: string;
  description: string;
}

const Login = () => {
  const [role, setRole] = useState<string>("");
  const isSettled = useRef<boolean>(false);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  const verify = useCallback(
    async (blob: Blob) => {
      try {
        const { code, data } = await faceAuth(blob);
        if (code === 0 && !isSettled.current) {
          // TODO: 多个匹配结果需二次验证
          message.success(`验证成功, 欢迎您 ${data[0]}`);
          isSettled.current = true;
          navigate("/shop");
          return true;
        }
        return false;
      } catch (error) {
        console.log(error);
        if (isSettled.current) return true;
        message.error("服务器错误, 请稍后再试");
        isSettled.current = true;
        return true;
      }
    },
    [navigate]
  );

  const { cameraRef, startCapturing, loading, isTimeout } = useCamera({
    callback: verify,
    // height: 256,
    timeoutCallback: () => message.error("验证超时, 请重试"),
  });

  const textDict: Record<string, LoginInfo> = {
    admin: {
      title: "Admin Login",
      description: "录入人脸信息 & 调整货物单价",
    },
    user: {
      title: "User Login",
      description: "欢迎光临，购物愉快！",
    },
    "": {
      title: "Login",
      description: "请选择您的角色",
    },
  };

  const handleStart = async () => {
    setRole("user");
    await startCapturing();
  };

  const renderLoading = () => {
    return <span className=" text-sky-400 loading loading-spinner loading-lg"></span>;
  };

  const renderRetry = () => {
    return (
      <button className="p-3 transition-all rounded-full bg-white/20 hover:bg-white/30 active:scale-95">
        <RetrySvg className="w-6 h-6 text-white" />
      </button>
    );
  };

  return (
    <div className="flex items-center justify-center w-screen h-screen bg-sky-50">
      <div className="flex-col p-6 bg-white shadow-sm rounded-box shadow-black/20 w-[552px]">
        <div>
          <h1 className="text-3xl font-bold text-center">{textDict?.[role].title}</h1>
          <h2 className="mt-2 text-center text-black/50">
            {textDict?.[role].description}
          </h2>
        </div>
        {/* 角色选择 */}
        <div className={role == "" ? "flex h-64 gap-6" : "hidden"}>
          <div className="flex-col text-center group" onClick={() => setRole("admin")}>
            <AdminSvg className="transition-all duration-200 w-60 h-60 group-hover:scale-110" />
            <p className="text-lg transition-all text-black/50 group-hover:text-black">
              Admin
            </p>
          </div>
          <div className="flex-col text-center group" onClick={handleStart}>
            <UserSvg className="transition-all duration-200 w-60 h-60 group-hover:scale-110" />
            <p className="text-lg transition-all text-black/50 group-hover:text-black">
              User
            </p>
          </div>
        </div>
        {/* 人脸验证 */}
        <div
          className={
            role == ""
              ? "hidden"
              : "flex flex-col items-center justify-center w-full mt-4 min-h-64 relative"
          }
          ref={wrapperRef}
        >
          <video ref={cameraRef} className="" playsInline autoPlay />
          {/* 背景 */}
          {/* <div className="flex items-center justify-center w-full min-h-64 bg-neutral"></div> */}
          <div className="absolute flex items-center justify-center w-full h-full">
            {loading ? renderLoading() : null}
            {!loading && isTimeout ? renderRetry() : null}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;

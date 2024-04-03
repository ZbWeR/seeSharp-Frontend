import { useCamera } from "@/hooks/useCamera";
import { faceAuth } from "@/service/api";
import { message } from "antd";
import { useEffect, useRef, useCallback } from "react";

interface LoginAuthProps {
  role: string;
}

const LoginAuth: React.FC<LoginAuthProps> = ({ role }) => {
  // TODO: 发送网络请求时携带参数 role
  const wrapperRef = useRef<HTMLDivElement>(null);

  const verify = useCallback(async (blob: Blob) => {
    const { code, data } = await faceAuth(blob);
    if (code === 0) {
      message.success(`验证成功, 欢迎您, ${data[0]}`);
      return true;
    }
    return false;
  }, []);

  const { cameraRef, cleanup, startCapturing } = useCamera({
    callback: verify,
    height: 256,
  });

  // 清理
  useEffect(() => {
    return () => cleanup();
  }, [cleanup]);

  useEffect(() => {
    startCapturing();
  }, [startCapturing]);

  return (
    <div
      className="flex flex-col items-center justify-center w-full mt-4 min-h-64"
      ref={wrapperRef}
    >
      <video ref={cameraRef} className="absolute " playsInline autoPlay />
      <div className="flex items-center justify-center w-full min-h-64 bg-neutral"></div>
    </div>
  );
};
export default LoginAuth;

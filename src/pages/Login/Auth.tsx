import { message } from "antd";
import { useEffect, useRef, useState } from "react";

interface LoginAuthProps {
  role: string;
}

const mock = () => {
  return new Promise((resolve) => setTimeout(resolve, 3000));
};

const LoginAuth: React.FC<LoginAuthProps> = ({ role }) => {
  const cameraRef = useRef<HTMLVideoElement>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const [loading, setLoading] = useState(true);

  const handleShoot = async () => {
    if (!cameraRef.current) return;
    const canvas = document.createElement("canvas");
    canvas.width = cameraRef.current.videoWidth;
    canvas.height = cameraRef.current.videoHeight;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.drawImage(cameraRef.current, 0, 0, canvas.width, canvas.height);
    cameraRef.current.pause();

    // const dataURL = canvas.toDataURL("image/png");
    // console.log(dataURL);

    setLoading(true);
    await mock();
    message.success("身份验证成功");
    setLoading(false);
  };

  useEffect(() => {
    let cameraElement: HTMLVideoElement | null = null;
    let timer: number | null = null;

    const playVideo = () => {
      if (!cameraElement) return;
      cameraElement
        .play()
        .then(() => {
          setLoading(false);
        })
        .catch((error) => message.error(error.message));
      timer = setTimeout(handleShoot, 3000);
    };

    const getCamera = async () => {
      try {
        if (cameraRef.current) {
          cameraElement = cameraRef.current;
          cameraElement.addEventListener("loadedmetadata", playVideo);
          const stream = await navigator.mediaDevices.getUserMedia({
            video: { height: 256 },
          });
          cameraElement.srcObject = stream;
        }
      } catch (error) {
        message.warning("请允许访问您的摄像头以便进行身份验证");
      }
    };

    getCamera();

    return () => {
      if (timer) clearTimeout(timer);
      if (cameraElement) {
        cameraElement.removeEventListener("loadedmetadata", playVideo);
        const stream = cameraElement.srcObject as MediaStream;
        if (stream && stream.getTracks)
          stream.getTracks().forEach((track) => track.stop());
        cameraElement.srcObject = null;
      }
    };
  }, []);

  // TODO:
  const renderLoading = () => {
    return (
      <>
        <span className="loading loading-spinner loading-lg text-sky-400"></span>
        <p className="mt-2 text-sm text-neutral-500">正在进行身份验证...</p>
      </>
    );
  };

  return (
    <div
      className="flex flex-col items-center justify-center w-full mt-4 min-h-64"
      ref={wrapperRef}
    >
      <video ref={cameraRef} className="absolute " playsInline autoPlay />
      <div className="flex items-center justify-center w-full min-h-64 bg-neutral">
        {loading ? renderLoading() : null}
      </div>
    </div>
  );
};
export default LoginAuth;

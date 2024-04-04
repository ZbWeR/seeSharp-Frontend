import { useCamera } from "@/hooks/useCamera";
import { productPredict } from "@/service/api";
import { message } from "antd";
import { useRef, useState } from "react";

const Shop = () => {
  const isSettled = useRef<boolean>(false);
  const [isBtnVisible, setIsBtnVisible] = useState(true);

  const predict = async (blob: Blob) => {
    try {
      const { code, data } = await productPredict(blob);
      if (code === 0 && data?.length > 0 && !isSettled.current) {
        const label = data[0].rec_docs;
        message.success(`识别到商品: ${label}`);
        setIsBtnVisible(true);
        isSettled.current = true;
        return true;
      }
      return false;
    } catch (error) {
      if (isSettled.current) return true;
      message.error("服务器错误, 请稍后再试");
      isSettled.current = true;
      return true;
    }
  };

  const { cameraRef, startCapturing } = useCamera({
    callback: predict,
    interval: 2000,
    maxTime: 20000,
    timeoutCallback: () => message.error("购物超时, 请重试"),
  });

  const handleShopping = async () => {
    setIsBtnVisible(false);
    await startCapturing();
  };

  return (
    <div className="flex items-center justify-center w-screen h-screen bg-sky-50">
      <div className="flex flex-col items-center justify-center w-[640px] text-center bg-white">
        <button className={isBtnVisible ? "btn" : "hidden"} onClick={handleShopping}>
          Shopping
        </button>
        <div className="relative flex items-center justify-center w-full h-full">
          <video ref={cameraRef} className="object-cover w-full" playsInline autoPlay />
        </div>
      </div>
    </div>
  );
};

export default Shop;

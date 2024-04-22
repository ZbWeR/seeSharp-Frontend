import { useCamera } from "@/hooks/useCamera";
import { productPredict } from "@/service/api";
import ShopSvg from "@/assets/svg/shop.svg?react";
import { Product } from "@/utils";
import { message } from "antd";
import axios from "axios";
import { useRef, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const Shop = () => {
  const isSettled = useRef<boolean>(false);
  const [isBtnVisible, setIsBtnVisible] = useState(true);
  const [productList, setProductList] = useState<Product[]>([]);
  const navigate = useNavigate();

  const prefix = import.meta.env.VITE_DATA_API_URL;

  useEffect(() => {
    const fetchData = async () => {
      const { data } = await axios.get(`${prefix}/product/all`);
      if (data.statusCode !== 0) message.error(data?.message || "获取商品列表失败");
      else setProductList(data.data);
    };
    fetchData();
    return () => setProductList([]);
  }, [prefix]);

  const predict = async (blob: Blob) => {
    try {
      const { code, data } = await productPredict(blob);
      if (code === 0 && data?.length > 0 && !isSettled.current) {
        const label = data[0].rec_docs;
        isSettled.current = true;
        setIsBtnVisible(true);
        message.success(`识别到商品: ${label}`);
        navigate("/result", {
          state: { product: productList.find((item) => item.name === label) },
        });
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
    timeoutCallback: () => {
      message.error("购物超时, 请重试");
      setIsBtnVisible(true);
    },
  });

  const handleShopping = async () => {
    setIsBtnVisible(false);
    await startCapturing();
  };

  const wrapperClass = isBtnVisible
    ? "hidden"
    : "fixed top-0 left-0 z-10 flex flex-col items-center justify-center h-screen min-w-full overflow-hidden bg-black/30";

  return (
    <div className="flex flex-col items-center justify-center w-full min-h-screen pt-16 overflow-hidden bg-sky-50">
      {/* 按钮：按下打开摄像头商品识别 */}
      <button
        className={
          isBtnVisible
            ? "btn fixed bottom-10 animate-bounce btn-secondary right-24 "
            : "hidden"
        }
        onClick={handleShopping}
      >
        Shopping
        <ShopSvg />
      </button>
      {/* 摄像头区域 */}
      <div className={wrapperClass}>
        <div className="w-[640px] text-center bg-white">
          <div className="relative flex items-center justify-center w-full h-full ">
            <video ref={cameraRef} className="object-cover w-full" playsInline autoPlay />
          </div>
        </div>
      </div>

      <h1 className="text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-violet-500">
        Products
      </h1>
      <div className="grid flex-1 grid-cols-4 gap-4 px-3 py-4 mt-4 bg-white rounded-md shadow-lg">
        {productList.map((product) => (
          <div
            key={product.id}
            className="flex flex-col items-center justify-center flex-grow-0 p-4 transition-all duration-200 bg-white max-h-44 group rounded-2xl hover:-translate-y-1 hover:bg-black/5"
          >
            <div className="w-24 h-24">
              <img
                src={`${prefix}${product.imageUrl}`}
                alt={product.name}
                className="object-contain w-24 h-24 rounded-full"
              />
            </div>
            <p className="mt-2 text-gray-400 transition-all group-hover:text-black">
              {product.price}￥
            </p>
            <p className={product.name.includes("-") ? "text-sm" : ""}>{product.name}</p>
          </div>
        ))}
        {productList.length < 12 &&
          new Array(12 - productList.length).fill(0).map((_, index) => (
            <div
              key={index}
              className="flex flex-col items-center justify-center flex-grow-0 p-4"
            >
              <div className="w-24 h-24 skeleton"></div>
              <div className="w-12 h-4 mt-2 skeleton"></div>
              <div className="w-16 h-4 mt-2 skeleton"></div>
            </div>
          ))}
      </div>
      <footer className="p-4 footer footer-center text-base-content">
        <aside>
          <p>Copyright © 2024 - All right reserved by Group 8</p>
        </aside>
      </footer>
    </div>
  );
};

export default Shop;

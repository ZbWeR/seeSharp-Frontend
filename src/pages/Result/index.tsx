import { fireConfetti } from "@/utils";
import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";

const prefix = import.meta.env.VITE_DATA_API_URL;
const Result = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { product } = location.state || {};

  useEffect(() => {
    if (!product) return;
    fireConfetti("left");
    fireConfetti("right");
  }, [product]);

  const handleBack = () => {
    navigate("/", { replace: true });
  };

  if (!product) {
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-sky-50">
        <h1 className="text-4xl font-bold">🚨 无效的商品 🚨</h1>
        <button className="mt-6 btn" onClick={handleBack}>
          Back Shopping 👈
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-sky-50">
      <div className="flex flex-col items-center justify-center flex-grow-0 p-4 transition-all duration-200 border shadow-lg shadow-orange-500/50 max-h-44 rounded-2xl hover:-translate-y-1">
        <div className="w-24 h-24">
          <img
            src={`${prefix}${product.imageUrl}`}
            alt={product.name}
            className="object-contain w-24 h-24 rounded-full"
          />
        </div>
        <p className="mt-2 text-black">{product.price}￥</p>
        <p className="">{product.name}</p>
      </div>
      <h1 className="mt-6 text-4xl font-bold">🎉 购物成功！</h1>
      <p className="mt-4 text-sm text-gray-500">
        Thank you for your purchase! We look forward to your next visit.
      </p>
    </div>
  );
};

export default Result;

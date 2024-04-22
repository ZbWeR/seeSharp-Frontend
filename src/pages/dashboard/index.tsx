import { Product } from "@/utils";
import { message } from "antd";
import axios from "axios";
import { useEffect, useState } from "react";
import { useParams, useSearchParams } from "react-router-dom";

const Dashboard = () => {
  const [productList, setProductList] = useState<Product[]>([]);
  const [totalPage, setTotalPage] = useState(0);
  const [searchParams, setSearchParams] = useSearchParams();
  const currentPage = searchParams.get("page") || "1";
  const pageSize = 6;

  const prefix = import.meta.env.VITE_DATA_API_URL;

  useEffect(() => {
    const fetchData = async () => {
      const { data } = await axios.post(`${prefix}/product/list`, {
        page: currentPage,
        pageSize,
      });
      console.log(data);
      if (data.statusCode !== 0) message.error(data?.message || "获取商品列表失败");
      else {
        setProductList(data.data.products);
        setTotalPage(data.data.total);
      }
    };
    fetchData();
    return () => setProductList([]);
  }, [prefix, currentPage]);

  const handlePageChange = (page: number) => {
    setSearchParams({ page: page.toString() });
  };

  return (
    <div className="flex flex-col items-center justify-center w-full min-h-screen pt-16 overflow-hidden bg-sky-50">
      <h1 className="text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-violet-500">
        Dashboard
      </h1>
      <div className="flex flex-col p-6 mt-4 overflow-x-auto bg-white border shadow-lg rounded-2xl ">
        <table className="table">
          {/* head */}
          <thead>
            <tr className="text-base text-center">
              <th></th>
              <th>Name</th>
              <th>Price</th>
              <th>Sale</th>
            </tr>
          </thead>
          <tbody>
            {productList.map((product, index) => (
              <tr key={product.id} className="text-base text-center hover">
                <td className="font-bold ">
                  {pageSize * (Number(currentPage) - 1) + index + 1}
                </td>
                <td className="">{product.name}</td>
                <td className="w-24">{product.price} ￥</td>
                <td className="w-24">{product.isOnSale ? "✅" : "❌"}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="self-end mt-4 text-sm join">
          <button
            className={`join-item btn btn-sm ${currentPage == "1" ? "btn-disabled" : ""}`}
            onClick={() => handlePageChange(Number(currentPage) - 1)}
          >
            «
          </button>
          <button className="join-item btn btn-sm">Page {currentPage}</button>
          <button
            className={`join-item btn btn-sm ${
              Number(currentPage) == totalPage ? "btn-disabled" : ""
            }`}
            onClick={() => handlePageChange(Number(currentPage) + 1)}
          >
            »
          </button>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;

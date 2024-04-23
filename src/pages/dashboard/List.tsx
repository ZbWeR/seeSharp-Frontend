import { Product } from "@/utils";
import { message } from "antd";
import axios from "axios";
import { memo, useEffect, useRef, useState } from "react";
import { useSearchParams } from "react-router-dom";

const prefix = import.meta.env.VITE_DATA_API_URL;
const List = memo(() => {
  const [productList, setProductList] = useState<Product[]>([]);
  const [totalPage, setTotalPage] = useState(0);
  const [searchParams, setSearchParams] = useSearchParams();
  const modalRef = useRef<HTMLDialogElement>(null);
  const [loading, setLoading] = useState(false);
  const [readyToEdit, setReadyToEdit] = useState<Product | null>(null);

  const currentPage = searchParams.get("page") || "1";
  const pageSize = 6;

  useEffect(() => {
    const fetchData = async () => {
      const { data } = await axios.post(`${prefix}/product/list`, {
        page: currentPage,
        pageSize,
      });
      if (data.statusCode !== 0) message.error(data?.message || "获取商品列表失败");
      else {
        setProductList(data.data.products);
        setTotalPage(data.data.total);
      }
    };
    fetchData();
    return () => setProductList([]);
  }, [currentPage]);

  const handlePageChange = (page: number) => {
    setSearchParams({ page: page.toString() });
  };

  const toggleFaceModal = (action: "open" | "close") => {
    if (!modalRef.current) return console.error("modalRef is not ready");
    if (action === "open") modalRef.current.showModal();
    else modalRef.current.close();
  };

  const handleRowClick = (product: Product) => {
    setReadyToEdit(product);
    toggleFaceModal("open");
  };

  const handleSubmit = async () => {
    if (!readyToEdit) return message.error("数据错误");
    try {
      setLoading(true);
      const { data } = await axios.post(`${prefix}/product/update`, {
        id: readyToEdit.id,
        product: readyToEdit,
      });
      if (data.statusCode !== 0)
        return message.error(data?.message || "更新商品信息失败");
      message.success("更新成功");

      const index = productList.findIndex((p) => p.id === readyToEdit.id);
      if (index !== -1) {
        const newList = [...productList];
        newList[index] = readyToEdit;
        setProductList(newList);
      }
      toggleFaceModal("close");
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
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
            <tr
              onClick={() => handleRowClick(product)}
              key={product.id}
              className="text-base text-center hover"
            >
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

      <dialog ref={modalRef} className="modal">
        <div className="max-w-sm modal-box">
          <h3 className="text-lg font-bold">{readyToEdit?.name || "修改商品信息"}</h3>
          <div className="max-w-xs mx-auto mt-4 form-control">
            <label className="flex items-center gap-2 input input-sm input-bordered">
              价格
              <input
                type="text"
                className="grow"
                value={readyToEdit?.price}
                onChange={(e) => {
                  setReadyToEdit((prev) => {
                    if (!prev) return null;
                    return { ...prev, price: e.target.value };
                  });
                }}
              />
              ￥
            </label>
            <label className="mt-2 cursor-pointer label">
              <span className="label-text">是否出售</span>
              <input
                type="checkbox"
                className="toggle toggle-success"
                checked={readyToEdit?.isOnSale || false}
                onChange={() => {
                  setReadyToEdit((prev) => {
                    if (!prev) return null;
                    return { ...prev, isOnSale: !prev.isOnSale };
                  });
                }}
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
});

export default List;

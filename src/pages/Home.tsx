import { serverHello, serverHelloPost } from "@/service/api";
import { message } from "antd";
import axios from "axios";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import bgImage from "../assets/home-bg.jpg";

const Home = () => {
  const navigate = useNavigate();

  const handleStart = async () => {
    navigate("/login");
  };

  useEffect(() => {
    const test_server = async () => {
      try {
        const getRes = await serverHello("dora");
        console.log("method GET status: ", getRes.msg);

        const postRes = await serverHelloPost({ name: "dora" });
        console.log("method GET status ", postRes.msg);

        if (postRes.msg === "success" && getRes.msg === "success") {
          message.success("Server is ready");
        }
      } catch (error) {
        message.error("Server Error");
      }
    };

    const test_data_server = async () => {
      try {
        const { data } = await axios.get(`${import.meta.env.VITE_DATA_API_URL}/ping`);
        console.log("data server status: ", data);
        if (data.statusCode === 0) message.success("Data Server is ready");
      } catch (error) {
        message.error("Data Server Error");
      }
    };

    test_server();
    test_data_server();
  }, []);

  return (
    <div
      className="min-h-screen hero"
      style={{
        backgroundImage: `url(${bgImage})`,
      }}
    >
      <div className="bg-opacity-70 hero-overlay"></div>
      <div className="text-center hero-content text-neutral-content">
        <div className="max-w-md">
          <h1 className="mb-5 text-5xl font-bold text-white">Smart Vending</h1>
          <p className="mb-5">
            融合先进AI技术，打造无人值守、自助式购物新风尚，为您提供更便捷、更智能的购物体验。
          </p>
          <button className="btn-primary btn" onClick={handleStart}>
            Get Start
          </button>
        </div>
      </div>
    </div>
  );
};

export default Home;

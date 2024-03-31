import AdminSvg from "@/assets/svg/admin.svg?react";
import UserSvg from "@/assets/svg/user.svg?react";
import { useState } from "react";
import LoginAuth from "./Auth";

interface LoginInfo {
  title: string;
  description: string;
}

const Login = () => {
  const [role, setRole] = useState<string>("");

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

  return (
    <div className="flex items-center justify-center w-screen h-screen bg-sky-50">
      <div className="flex-col p-6 bg-white shadow-sm rounded-box shadow-black/20 w-[552px]">
        <div>
          <h1 className="text-3xl font-bold text-center">{textDict?.[role].title}</h1>
          <h2 className="mt-2 text-center text-black/50">
            {textDict?.[role].description}
          </h2>
        </div>
        <div className={role == "" ? "flex h-64 gap-6" : "hidden"}>
          <div className="flex-col text-center group" onClick={() => setRole("admin")}>
            <AdminSvg className="transition-all duration-200 w-60 h-60 group-hover:scale-110" />
            <p className="text-lg transition-all text-black/50 group-hover:text-black">
              Admin
            </p>
          </div>
          <div className="flex-col text-center group" onClick={() => setRole("user")}>
            <UserSvg className="transition-all duration-200 w-60 h-60 group-hover:scale-110" />
            <p className="text-lg transition-all text-black/50 group-hover:text-black">
              User
            </p>
          </div>
        </div>

        {role != "" && <LoginAuth role={role} />}
      </div>
    </div>
  );
};

export default Login;

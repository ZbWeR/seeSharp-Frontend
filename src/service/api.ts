import service from ".";

export const serverHello = async (name: string) => {
  const res = await service.get("/hello", { params: { name } });
  return res.data;
};

export const serverHelloPost = async (data: any) => {
  const res = await service.post("/hello", data);
  return res.data;
};

/**
 * 上传已知人脸照片, 以便之后登陆进行人脸识别
 */
export const uploadImage = async (data: File, name: string) => {
  const extName = data.name.split(".").pop();
  const formData = new FormData();
  formData.append("image", data, `${name}.${extName}`);
  const res = await service.post("/face/controller", formData);
  return res.data;
};

/**
 * 人脸识别
 */
export const faceAuth = async (data: Blob) => {
  const formData = new FormData();
  formData.append("image", data, "unknown.jpg");
  const res = await service.post("/auth", formData);
  return res.data;
};

/**
 * 商品识别
 */
export const productPredict = async (data: Blob) => {
  const formData = new FormData();
  formData.append("image", data, "product.jpg");
  const res = await service.post("/predict", formData);
  return res.data;
};

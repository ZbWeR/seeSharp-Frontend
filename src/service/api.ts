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
 * TODO: 上传相关信息更新数据库
 */
export const uploadImage = async (data: Blob) => {
  console.log(`image size: ${data.size / 1024}KB`);
  const formData = new FormData();
  formData.append("image", data, "mmm.jpg"); // ! 此处硬编码需要修改
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

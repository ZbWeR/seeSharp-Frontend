import service from ".";

export const serverHello = async (name: string) => {
  const res = await service.get("/hello", { params: { name } });
  return res.data;
};

export const serverHelloPost = async (data: any) => {
  const res = await service.post("/hello", data);
  return res.data;
};

export const uploadImage = async (data: Blob) => {
  console.log(`image size: ${data.size / 1024}KB`);
  const formData = new FormData();
  formData.append("image", data, "mmm.jpg");
  const res = await service.post("/face-auth", formData);
  return res.data;
};

export const faceAuth = async (data: Blob) => {
  const formData = new FormData();
  formData.append("image", data, "unknown.jpg");
  const res = await service.post("/auth", formData);
  return res.data;
};

export const getKnownFaces = async () => {
  const res = await service.get("/face-auth");
  return res.data;
};

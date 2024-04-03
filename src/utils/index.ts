export const stopCamera = (stream: MediaStream) => {
  if (stream && stream.getTracks) stream.getTracks().forEach((track) => track.stop());
};

export const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

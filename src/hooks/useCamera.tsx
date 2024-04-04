import { message } from "antd";
import { useCallback, useEffect, useRef, useState } from "react";

interface CameraProps {
  // 捕获帧后的回调函数, 需要手动处理错误, 返回 true 表示结束捕获
  callback: (data: Blob) => Promise<boolean>;

  // 捕获帧的时间间隔
  interval?: number;
  // 捕获帧的最大时间
  maxTime?: number;
  // 超时回调函数
  timeoutCallback?: () => void;

  // 摄像头画面的宽高
  height?: number;
  width?: number;
}

const defaultOptions: Partial<CameraProps> = {
  interval: 2000,
  maxTime: 10000,
};

/**
 * 调用摄像头并捕获帧上传到服务器
 * @param options - 配置项
 * -  callback : 捕获帧后的回调函数, 需要手动处理错误, 返回 true 表示结束捕获
 * -  interval : 捕获帧的时间间隔, 默认 2000ms
 * -  maxTime : 捕获帧的最大时间, 默认 10000ms
 */
export const useCamera = (options: CameraProps) => {
  const { callback, interval, maxTime, height, width, timeoutCallback } = {
    ...defaultOptions,
    ...options,
  } as Required<CameraProps>;

  const cameraRef = useRef<HTMLVideoElement>(null);
  const intervalRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const startTimeRef = useRef<number | null>(null);
  const [loading, setLoading] = useState(false);
  const [isTimeout, setIsTimeout] = useState(false);

  // 清理函数
  const cleanup = useCallback(() => {
    // 清理定时器
    const interval = intervalRef.current;
    clearInterval(interval!);
    // 关闭摄像头
    const camera = cameraRef.current;
    if (camera && camera.srcObject) {
      const stream = camera.srcObject as MediaStream;
      stream.getTracks().forEach((track) => track.stop());
      camera.srcObject = null;
    }
  }, []);

  //   获取用户摄像头权限
  const startCamera = useCallback(async () => {
    setLoading(true);
    const video = cameraRef.current;
    if (!video) return;

    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { height, width },
      });
      video.srcObject = stream;
    } catch (error) {
      message.error("无权访问您的摄像头");
    } finally {
      setLoading(false);
    }
  }, [height, width]);

  // 捕获并发送帧到服务器
  const captureAndSendFrame = useCallback(
    (canvas: HTMLCanvasElement, camera: HTMLVideoElement) => {
      // 利用 canvas 截取摄像头画面
      canvas.width = camera.videoWidth;
      canvas.height = camera.videoHeight;
      const ctx = canvas.getContext("2d");
      if (!ctx) return;
      ctx.drawImage(camera, 0, 0, canvas.width, canvas.height);
      // 将 canvas 转换为 Blob 对象
      canvas.toBlob(async (blob) => {
        if (blob) {
          // 将帧信息交由回调函数处理
          const isFinished = await callback(blob);
          if (isFinished) cleanup();
        }
      }, "image/jpeg");
    },
    [callback, cleanup]
  );

  const startCapturing = useCallback(async () => {
    setIsTimeout(false);
    await startCamera();
    const camera = cameraRef.current;
    if (!camera) return;

    const canvas = document.createElement("canvas");
    startTimeRef.current = Date.now();
    intervalRef.current = setInterval(() => {
      captureAndSendFrame(canvas, camera);

      // 超时停止发送帧
      if (Date.now() - (startTimeRef.current || 0) > maxTime) {
        cleanup();
        timeoutCallback && timeoutCallback();
        setIsTimeout(true);
      }
    }, interval);
  }, [interval, captureAndSendFrame, startCamera, cleanup, maxTime, timeoutCallback]);

  useEffect(() => {
    return () => cleanup();
  }, [cleanup]);

  return { cameraRef, startCapturing, loading, isTimeout };
};

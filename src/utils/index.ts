import confetti from "canvas-confetti";

export const stopCamera = (stream: MediaStream) => {
  if (stream && stream.getTracks) stream.getTracks().forEach((track) => track.stop());
};

export const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export interface Product {
  id: string;
  name: string;
  price: string;
  isOnSale?: boolean;
  imageUrl: string;
}

function fire(type: "left" | "right", particleRatio: number, opts: object = {}) {
  const baseConfettiOptions = {
    origin: { y: 0.4, x: type === "left" ? 0 : 1 },
    angle: type === "left" ? 60 : 120,
    particleCount: Math.floor(200 * particleRatio),
    ...opts,
  };

  confetti(baseConfettiOptions);
}

/**
 * 发射五彩纸屑以庆祝的函数。
 * @param {"left" | "right"} type 纸屑发射的方向。
 */
export const fireConfetti = (type: "left" | "right") => {
  const confettiSettings = [
    {
      spread: 26,
      startVelocity: 55,
    },
    {
      spread: 60,
    },
    {
      spread: 100,
      decay: 0.91,
      scalar: 0.8,
    },
    {
      spread: 120,
      startVelocity: 25,
      decay: 0.92,
      scalar: 1.2,
    },
    {
      spread: 120,
      startVelocity: 45,
    },
  ];

  confettiSettings.forEach((settings) => fire(type, 0.25, settings));
};

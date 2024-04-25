# 🏪 seeSharp - Frontend 👀

该仓库为 2024 年电子科技大学新生项目课程 —— 【计算机系统识别开发】的前端部分。

- **代码框架**：React + TypeScript + React-Router
- **UI 框架**：TailwindCSS + Daisyui

仓库代码大多是在做简单的切图与交互，值得一看的或许就是： `src/hooks/useCamera.tsx` 

这个钩子提供了一个比较方便的方式来处理与摄像头相关的功能，你可以传递一个回调函数，当摄像头打开后，将会每隔一段时间就执行一遍回调函数。同时也考虑了资源清理与错误处理，并提供了多个状态方便控制 UI 显示。美中不足的就是需要自己在回调函数中做接口拦截，当获得了想要的结果时就抛弃其他请求的响应数据。

原本我想做成利用 WebSocket 传递视频流，但是有点懒，干脆用 setTimeout 轮询传递图片来做类似的功能。

为了让这个 README 看起来更丰满，我决定添加一个英语版本 

## English Translate

This repository is the frontend part of the 2024 University of Electronic Science and Technology of China freshman project course —— Computer System Identification Development.

- **Code Framework**: React + TypeScript + React-Router
- **UI Framework**: TailwindCSS + Daisyui

Most of the code in the repository is involved in simple cutting and interaction. What might be worth looking at is the `src/hooks/useCamera.tsx`.

This hook provides a convenient way to handle camera-related functionalities. You can pass a callback function, and once the camera is open, it will be executed periodically at specified intervals. It also takes into account resource cleanup and error handling, and provides various states to facilitate UI display control. The downside is that you need to manually intercept the interface within the callback function to discard the response data of other requests once the desired result is obtained.

I originally wanted to implement the transmission of the video stream using WebSocket, but I was a bit lazy. Instead, I opted for a simpler approach using setTimeout to poll and pass images, achieving a similar functionality.



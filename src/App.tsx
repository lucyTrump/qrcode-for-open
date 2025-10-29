import { Badge } from "@/components/ui/badge"; // 用于标注
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import QRCode from "qrcode"; // qrcode 库，用于生成二维码
import React, { useState } from "react";

const App: React.FC = () => {
  const [text, setText] = useState<string>("");
  const [qrUrl, setQrUrl] = useState<string>("");
  const [error, setError] = useState<string>("");

  const handleGenerate = async () => {
    if (!text.trim()) {
      setError("请输入有效字符串！");
      setQrUrl("");
      return;
    }
    setError("");

    // 动态创建临时 Canvas（不依赖 DOM 渲染）
    const canvas = document.createElement("canvas");
    canvas.width = 256;
    canvas.height = 256;

    try {
      await QRCode.toCanvas(canvas, text, {
        errorCorrectionLevel: "L",
        width: 256,
        margin: 2,
        color: {
          dark: "#000000",
          light: "#FFFFFF",
        },
      });
      const dataUrl = canvas.toDataURL("image/png");
      setQrUrl(dataUrl);
    } catch (err) {
      setError("生成失败：" + (err as Error).message);
    }
  };

  const handleDownload = () => {
    if (!qrUrl) return;
    const link = document.createElement("a");
    link.download = "qr_code.png";
    link.href = qrUrl;
    link.click();
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4 space-y-6">
      {/* 主容器 */}
      <div className="max-w-md w-full space-y-6 bg-white p-8 rounded-lg shadow-lg">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900">二维码生成器</h1>
          <p className="text-gray-600 mt-2">输入任意字符串（例如 URL 或文本），生成二维码。</p>
        </div>

        <div className="space-y-4">
          <Input
            type="text"
            placeholder="请输入要生成二维码的字符串，例如：https://example.com"
            value={text}
            onChange={(e) => setText(e.target.value)}
            onKeyPress={(e) => e.key === "Enter" && handleGenerate()}
            className="w-full"
            maxLength={500}
          />
          <Button onClick={handleGenerate} className="w-full">
            生成二维码
          </Button>
        </div>

        {error && <div className="text-red-600 text-center text-sm">{error}</div>}

        {qrUrl && (
          <div className="text-center space-y-4">
            <div className="border border-gray-200 rounded-md p-2 bg-gray-50">
              <img src={qrUrl} alt="Generated QR Code" width={256} height={256} className="mx-auto" />
            </div>
            <Button onClick={handleDownload} variant="outline" className="w-full">
              下载 PNG
            </Button>
          </div>
        )}
      </div>

      {/* 修改：项目底部标注区域 */}
      <div className="w-full max-w-md text-center space-y-2">
        <div className="flex flex-wrap justify-center items-center gap-2">
          <Badge variant="secondary">使用 qrcode 库生成</Badge>
          <Badge variant="outline">开源项目</Badge>
        </div>
        <p className="text-xs text-gray-500">
          本项目基于 React + Tailwind CSS + TypeScript + shadcn/ui 构建。{" "}
          <a
            href="https://github.com/lucyTrump/qrcode-for-open"
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 hover:underline">
            查看源码 & 贡献
          </a>
        </p>
      </div>
    </div>
  );
};

export default App;

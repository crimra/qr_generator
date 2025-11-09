import { useRef, useEffect, useState } from "react";
import QRCodeStyling from "qr-code-styling";

export default function QRGenerator() {
  const [text, setText] = useState("https://qreternal.dev");
  const ref = useRef<HTMLDivElement>(null);
  const qrCode = useRef<QRCodeStyling | null>(null);

  useEffect(() => {
    qrCode.current = new QRCodeStyling({
      width: 320,
      height: 320,
      data: text,
      margin: 10,
      qrOptions: { errorCorrectionLevel: "H" },
      dotsOptions: { type: "rounded", color: "#000000" },
      backgroundOptions: { color: "#ffffff" },
      imageOptions: { hideBackgroundDots: true, imageSize: 0.4, margin: 8 },
    });

    if (ref.current) {
      ref.current.innerHTML = "";
      qrCode.current.append(ref.current);
    }
  }, []);

  useEffect(() => {
    qrCode.current?.update({ data: text || " " });
  }, [text]);

  const downloadPNG = () => qrCode.current?.download({ name: "qreternal", extension: "png" });
  const downloadSVG = () => qrCode.current?.download({ name: "qreternal", extension: "svg" });

  return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center p-6">
      <div className="max-w-lg w-full space-y-8">
        <h1 className="text-5xl font-black text-center bg-gradient-to-r from-cyan-400 to-purple-600 bg-clip-text text-transparent">
          QR ETERNAL
        </h1>
        <p className="text-center text-gray-400 text-sm">
          Intemporel • Illimité • Gratuit à vie
        </p>

        <input
          type="text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Colle ton lien ici..."
          className="w-full px-6 py-5 text-lg bg-gray-900 rounded-2xl focus:outline-none focus:ring-4 focus:ring-cyan-500 placeholder-gray-600"
        />

        <div ref={ref} className="flex justify-center py-8" />

        <div className="flex gap-4 justify-center">
          <button onClick={downloadPNG} className="px-8 py-4 bg-cyan-500 hover:bg-cyan-400 rounded-xl font-bold transition">
            PNG
          </button>
          <button onClick={downloadSVG} className="px-8 py-4 bg-purple-600 hover:bg-purple-500 rounded-xl font-bold transition">
            SVG
          </button>
        </div>

        <p className="text-center text-xs text-gray-500">
          {text.length}/2953 caractères • Niveau H • 100% client-side
        </p>
      </div>
    </div>
  );
}
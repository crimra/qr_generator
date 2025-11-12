import { useRef, useEffect, useState } from "react";
import QRCodeStyling from "qr-code-styling";

export default function QRGenerator() {
  const [text, setText] = useState("https://qr-generator-steel-beta.vercel.app/");
  const [foregroundColor, setForegroundColor] = useState("#000000");
  const [backgroundColor, setBackgroundColor] = useState("#ffffff");
  
  const ref = useRef<HTMLDivElement>(null);
  const qrCode = useRef<QRCodeStyling | null>(null);

  // Initial setup
  useEffect(() => {
    if (!qrCode.current) {
      qrCode.current = new QRCodeStyling({
        width: 280,
        height: 280,
        data: text,
        margin: 10,
        qrOptions: { errorCorrectionLevel: "H" },
        dotsOptions: { type: "rounded", color: foregroundColor },
        backgroundOptions: { color: backgroundColor },
        cornersSquareOptions: { type: "square", color: foregroundColor },
        cornersDotOptions: { type: "square", color: foregroundColor },
        imageOptions: { 
          hideBackgroundDots: true, 
          imageSize: 0.3, 
          margin: 8,
          crossOrigin: "anonymous"
        },
      });

      // Ajouter le logo kichoto.png
      qrCode.current.update({
        image: "/kichoto.png"
      });

      if (ref.current) {
        ref.current.innerHTML = "";
        qrCode.current.append(ref.current);
      }
    }
  }, []); // Run only once on mount

  // Update when text or colors change
  useEffect(() => {
    if (qrCode.current) {
      qrCode.current.update({ 
        data: text,
        image: "/kichoto.png",
        dotsOptions: { type: "rounded", color: foregroundColor },
        backgroundOptions: { color: backgroundColor },
        cornersSquareOptions: { type: "square", color: foregroundColor },
        cornersDotOptions: { type: "square", color: foregroundColor }
      });
    }
  }, [text, foregroundColor, backgroundColor]);

  const downloadPNG = () => qrCode.current?.download({ name: "qreternal", extension: "png" });
  const downloadSVG = () => qrCode.current?.download({ name: "qreternal", extension: "svg" });

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 flex flex-col font-sans card">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-4xl mx-auto px-6 py-4">
          <div className="text-center">
            
            <p className="text-sm text-gray-500 mt-1 font-sans title">Générez des <span className="title1">QR Codes</span> <br /> Dynamiques et Intemporels</p>
          </div>
        </div>
      </header>

      <div className="flex-1 flex items-center justify-center p-6">
        <div className="max-w-2xl w-full">
          <div className="bg-white rounded-xl shadow-sm p-8">
          
          {/* URL Input */}
          <div className="mb-8 text-center">`
            <label className="block text-sm font-medium text-gray-700 mb-2 font-p">
              Entrez l'URL de votre site web
            </label>
            <input
              type="text"
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="https://votre-site-web.com"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-lg text-center"
            />
          </div>

          {/* Color Controls */}
          <div className="mb-8 text-center">
            {/* Invert button */}
            <button
              onClick={() => {
                const tempForeground = foregroundColor;
                setForegroundColor(backgroundColor);
                setBackgroundColor(tempForeground);
              }}
              className="px-8 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium flex items-center justify-center gap-2 mx-auto"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M16 3L21 8L16 13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M21 8H7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M8 21L3 16L8 11" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M3 16H17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              Inverser les couleurs
            </button>
          </div>

          {/* QR Code Preview */}
          <div className="text-center mb-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Aperçu en temps réel</h2>
            
            <div className="bg-gray-50 rounded-xl p-8 mb-6 inline-block">
              <div ref={ref} className="flex justify-center" />
            </div>

            {/* Download Buttons under QR code */}
            <div className="flex gap-3 justify-center">
              <button 
                onClick={downloadPNG} 
                className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
              >
                Télécharger PNG
              </button>
              <button 
                onClick={downloadSVG} 
                className="px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors font-medium"
              >
                Télécharger SVG
              </button>
            </div>
          </div>
          </div>
        </div>
      </div>
    </div>
  );
}
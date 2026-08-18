import { useRef, useEffect, useState } from "react";
import QRCodeStyling from "qr-code-styling";
import { createDynamicQr } from "../lib/api";
import { isValidDestinationUrl } from "../lib/validateUrl";
import type { CreateQrResponse } from "../../shared/api-types";

type Phase = "draft" | "creating" | "created";

export default function QRGenerator() {
  const [text, setText] = useState("https://qr-generator-steel-beta.vercel.app/");
  const [foregroundColor, setForegroundColor] = useState("#000000");
  const [backgroundColor, setBackgroundColor] = useState("#ffffff");
  const [logoImage, setLogoImage] = useState("/kichoto.png");

  const [phase, setPhase] = useState<Phase>("draft");
  const [created, setCreated] = useState<CreateQrResponse | null>(null);
  const [createError, setCreateError] = useState<string | null>(null);
  const [copiedField, setCopiedField] = useState<"redirect" | "edit" | null>(null);

  const ref = useRef<HTMLDivElement>(null);
  const qrCode = useRef<QRCodeStyling | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement("canvas");
        canvas.width = img.width;
        canvas.height = img.height;
        canvas.getContext("2d")?.drawImage(img, 0, 0);
        setLogoImage(canvas.toDataURL("image/png"));
      };
      img.src = reader.result as string;
    };
    reader.readAsDataURL(file);
  };

  const resetLogo = () => {
    setLogoImage("/kichoto.png");
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  // Initial setup
  useEffect(() => {
    if (!qrCode.current) {
      qrCode.current = new QRCodeStyling({
        width: 1000,
        height: 1000,
        data: text,
        margin: 36,
        qrOptions: { errorCorrectionLevel: "H" },
        dotsOptions: { type: "rounded", color: foregroundColor },
        backgroundOptions: { color: backgroundColor },
        cornersSquareOptions: { type: "square", color: foregroundColor },
        cornersDotOptions: { type: "square", color: foregroundColor },
        imageOptions: {
          hideBackgroundDots: true,
          imageSize: 0.3,
          margin: 28,
          crossOrigin: "anonymous"
        },
      });

      // Ajouter le logo par défaut
      qrCode.current.update({
        image: logoImage
      });

      if (ref.current) {
        ref.current.innerHTML = "";
        qrCode.current.append(ref.current);
      }
    }
  }, []); // Run only once on mount

  // Style/logo changes never touch `data` — they apply in draft and created phases alike
  useEffect(() => {
    if (qrCode.current) {
      qrCode.current.update({
        image: logoImage,
        dotsOptions: { type: "rounded", color: foregroundColor },
        backgroundOptions: { color: backgroundColor },
        cornersSquareOptions: { type: "square", color: foregroundColor },
        cornersDotOptions: { type: "square", color: foregroundColor }
      });
    }
  }, [foregroundColor, backgroundColor, logoImage]);

  // Live "what will this look like" preview — only before the QR is actually created
  useEffect(() => {
    if (qrCode.current && phase === "draft") {
      qrCode.current.update({ data: text });
    }
  }, [text, phase]);

  // Once created, the QR permanently encodes the redirect URL — never the raw destination again
  useEffect(() => {
    if (qrCode.current && created) {
      qrCode.current.update({ data: created.redirectUrl });
    }
  }, [created]);

  const downloadPNG = () => qrCode.current?.download({ name: "qreternal", extension: "png" });

  const handleCreate = async () => {
    setCreateError(null);
    setPhase("creating");
    const result = await createDynamicQr(text);
    if (result.ok) {
      setCreated(result.data);
      setPhase("created");
    } else {
      setCreateError(result.message);
      setPhase("draft");
    }
  };

  const handleReset = () => {
    setCreated(null);
    setCreateError(null);
    setPhase("draft");
  };

  const copyToClipboard = async (value: string, field: "redirect" | "edit") => {
    try {
      await navigator.clipboard.writeText(value);
      setCopiedField(field);
      setTimeout(() => setCopiedField((current) => (current === field ? null : current)), 1500);
    } catch {
      // Clipboard API unavailable (e.g. insecure context) — the value is still selectable/readable in the field
    }
  };

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
          <div className="mb-8 text-center">
            <label className="block text-sm font-medium text-gray-700 mb-2 font-p">
              Entrez votre URL
            </label>
            <input
              type="text"
              value={text}
              onChange={(e) => setText(e.target.value)}
              readOnly={phase === "created"}
              placeholder="https://votre-site-web.com"
              className={`w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-lg text-center ${phase === "created" ? "bg-gray-100 text-gray-500" : ""}`}
            />

            {phase !== "created" && (
              <>
                {createError && (
                  <p className="text-red-600 text-sm mt-3">{createError}</p>
                )}
                <button
                  onClick={handleCreate}
                  disabled={phase === "creating" || !isValidDestinationUrl(text)}
                  className="mt-4 px-8 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {phase === "creating" ? "Création…" : "Créer mon QR code dynamique"}
                </button>
              </>
            )}
          </div>

          {phase === "created" && created && (
            <div className="mb-8 p-4 rounded-lg bg-green-50 border border-green-200">
              <p className="text-sm font-medium text-green-800 mb-3">
                QR code créé ! Il ne changera plus jamais visuellement — seule sa destination peut être modifiée.
              </p>

              <label className="block text-xs font-medium text-gray-600 mb-1">Lien encodé par le QR code</label>
              <div className="flex gap-2 mb-4">
                <input readOnly value={created.redirectUrl} className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm bg-white" />
                <button
                  onClick={() => copyToClipboard(created.redirectUrl, "redirect")}
                  className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 text-sm font-medium"
                >
                  {copiedField === "redirect" ? "Copié !" : "Copier"}
                </button>
              </div>

              <label className="block text-xs font-medium text-gray-600 mb-1">
                Lien secret de modification — enregistrez-le maintenant, il ne sera plus jamais réaffiché
              </label>
              <div className="flex gap-2">
                <input readOnly value={created.editUrl} className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm bg-white" />
                <button
                  onClick={() => copyToClipboard(created.editUrl, "edit")}
                  className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 text-sm font-medium"
                >
                  {copiedField === "edit" ? "Copié !" : "Copier"}
                </button>
              </div>

              <button
                onClick={handleReset}
                className="mt-4 text-sm text-blue-600 hover:underline"
              >
                Créer un nouveau QR code
              </button>
            </div>
          )}

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

          {/* Logo Upload */}
          <div className="mb-8 text-center">
            <label className="block text-sm font-medium text-gray-700 mb-2 font-p">
              Logo au centre du QR Code
            </label>
            <div className="flex gap-3 justify-center items-center">
              <button
                onClick={() => fileInputRef.current?.click()}
                className="px-6 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors font-medium"
              >
                Choisir une image
              </button>
              {logoImage !== "/kichoto.png" && (
                <button
                  onClick={resetLogo}
                  className="px-6 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors font-medium"
                >
                  Réinitialiser
                </button>
              )}
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleLogoUpload}
                className="hidden"
              />
            </div>
          </div>

          {/* QR Code Preview */}
          <div className="text-center mb-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Aperçu en temps réel</h2>

            <div className="bg-gray-50 rounded-xl p-8 mb-6 inline-block">
              <div
                ref={ref}
                className="flex justify-center w-[280px] h-[280px] [&>canvas]:w-full [&>canvas]:h-full [&>svg]:w-full [&>svg]:h-full"
              />
            </div>
            {phase === "draft" && (
              <p className="text-xs text-gray-400 mb-2">
                Aperçu — le motif final encodera un lien court permanent une fois le QR créé. Export haute résolution (1000x1000px) prêt pour l'impression.
              </p>
            )}
            {phase !== "draft" && (
              <p className="text-xs text-gray-400 mb-2">Export haute résolution (1000x1000px) prêt pour l'impression</p>
            )}

            {/* Download Button under QR code */}
            <div className="flex gap-3 justify-center">
              <button
                onClick={downloadPNG}
                className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
              >
                Télécharger PNG
              </button>
            </div>
          </div>
          </div>
        </div>
      </div>
    </div>
  );
}

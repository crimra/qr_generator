import { useEffect, useState } from "react";
import { fetchQrDetails, updateQrDestination } from "../lib/api";
import { isValidDestinationUrl } from "../lib/validateUrl";

interface EditPageProps {
  id: string;
}

type Status = "loading" | "error" | "ready" | "saving";

export default function EditPage({ id }: EditPageProps) {
  const token = new URLSearchParams(window.location.search).get("token") ?? "";

  const [status, setStatus] = useState<Status>(token ? "loading" : "error");
  const [errorMessage, setErrorMessage] = useState("Lien de modification invalide : jeton manquant.");
  const [destination, setDestination] = useState("");
  const [savedAt, setSavedAt] = useState<number | null>(null);
  const [scanCount, setScanCount] = useState<number | null>(null);

  useEffect(() => {
    if (!token) return;
    let cancelled = false;
    fetchQrDetails(id, token).then((result) => {
      if (cancelled) return;
      if (result.ok) {
        setDestination(result.data.destinationUrl);
        setScanCount(result.data.scanCount);
        setStatus("ready");
      } else {
        setErrorMessage(result.message);
        setStatus("error");
      }
    });
    return () => {
      cancelled = true;
    };
  }, [id, token]);

  const handleSave = async () => {
    setStatus("saving");
    setErrorMessage("");
    const result = await updateQrDestination(id, token, destination);
    if (result.ok) {
      setDestination(result.data.destinationUrl);
      setSavedAt(result.data.updatedAt);
      setScanCount(result.data.scanCount);
      setStatus("ready");
    } else {
      setErrorMessage(result.message);
      setStatus("ready");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 flex flex-col font-sans">
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-4xl mx-auto px-6 py-4 text-center">
          <p className="text-sm text-gray-500 mt-1 font-sans title">Modifier la destination de votre QR Code</p>
        </div>
      </header>

      <div className="flex-1 flex items-center justify-center p-6">
        <div className="max-w-xl w-full">
          <div className="bg-white rounded-xl shadow-sm p-8">
            {status === "loading" && <p className="text-center text-gray-500">Chargement…</p>}

            {status === "error" && (
              <div className="text-center">
                <p className="text-red-600 mb-4">{errorMessage}</p>
                <a href="/" className="text-blue-600 hover:underline">
                  Créer un nouveau QR code
                </a>
              </div>
            )}

            {(status === "ready" || status === "saving") && (
              <div>
                {scanCount !== null && (
                  <p className="text-center text-sm text-gray-500 mb-6">
                    <span className="text-2xl font-semibold text-gray-900">{scanCount}</span>
                    {" "}scan{scanCount !== 1 ? "s" : ""} depuis la création
                  </p>
                )}
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Nouvelle destination
                </label>
                <input
                  type="text"
                  value={destination}
                  onChange={(e) => {
                    setDestination(e.target.value);
                    setSavedAt(null);
                  }}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-lg text-center mb-2"
                />
                {errorMessage && <p className="text-red-600 text-sm mb-4 text-center">{errorMessage}</p>}
                {savedAt && (
                  <p className="text-green-600 text-sm mb-4 text-center">
                    Mis à jour ✓
                  </p>
                )}
                <div className="text-center">
                  <button
                    onClick={handleSave}
                    disabled={status === "saving" || !isValidDestinationUrl(destination)}
                    className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {status === "saving" ? "Enregistrement…" : "Enregistrer"}
                  </button>
                </div>
                <p className="text-xs text-gray-400 text-center mt-4">
                  Le QR code déjà imprimé ou partagé reste identique — seule la destination change.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

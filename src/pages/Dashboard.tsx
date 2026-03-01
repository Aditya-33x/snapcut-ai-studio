import { useState, useCallback, useRef, useEffect } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import {
  Upload,
  Download,
  Image as ImageIcon,
  Zap,
  Wand2,
  AlertCircle,
  Clock,
  Trash2,
  Eye,
} from "lucide-react";

const WEBHOOK_URL = "https://adi33x.app.n8n.cloud/webhook/remove-background";
const STORAGE_KEY = "snapcut_history";

interface HistoryItem {
  id: string;
  originalImage: string; // data URL
  processedUrl: string;  // secure_url from n8n
  fileName: string;
  timestamp: number;
}

function loadHistory(): HistoryItem[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function saveHistory(items: HistoryItem[]) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  } catch (e) {
    console.warn("localStorage quota exceeded, clearing oldest items");
    // If storage is full, remove oldest items and retry
    const trimmed = items.slice(0, Math.max(items.length - 5, 0));
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(trimmed));
    } catch {
      localStorage.removeItem(STORAGE_KEY);
    }
  }
}

// Cross-origin safe download: fetches blob then triggers download
async function downloadFromUrl(url: string, filename: string) {
  try {
    const res = await fetch(url);
    const blob = await res.blob();
    const blobUrl = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = blobUrl;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    setTimeout(() => URL.revokeObjectURL(blobUrl), 1000);
  } catch {
    // Fallback: open in new tab
    window.open(url, "_blank");
  }
}

type Tab = "editor" | "history";

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState<Tab>("editor");
  const [dragOver, setDragOver] = useState(false);
  const [originalImage, setOriginalImage] = useState<string | null>(null);
  const [processedImage, setProcessedImage] = useState<string | null>(null);
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [previewItem, setPreviewItem] = useState<HistoryItem | null>(null);
  const uploadedFileRef = useRef<File | null>(null);

  // Load history on mount
  useEffect(() => {
    setHistory(loadHistory());
  }, []);

  const handleFile = useCallback((file: File) => {
    if (file.size > 10 * 1024 * 1024) return alert("File must be under 10MB");
    if (!["image/jpeg", "image/png", "image/webp"].includes(file.type))
      return alert("Only JPG, PNG, WEBP allowed");

    uploadedFileRef.current = file;
    setProcessedImage(null);
    setError(null);

    const reader = new FileReader();
    reader.onload = (e) => {
      setOriginalImage(e.target?.result as string);
    };
    reader.readAsDataURL(file);
  }, []);

  const removeBackground = useCallback(async () => {
    const file = uploadedFileRef.current;
    if (!file || !originalImage) return;

    setProcessing(true);
    setError(null);
    setProcessedImage(null);

    try {
      // Send as FormData with key "data" as expected by n8n webhook
      const formData = new FormData();
      formData.append("data", file);

      const response = await fetch(WEBHOOK_URL, {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`Server error: ${response.status} ${response.statusText}`);
      }

      // Parse response — log raw data for debugging
      const responseText = await response.text();
      console.log("n8n webhook raw response:", responseText);

      let imageUrl: string | null = null;

      try {
        const data = JSON.parse(responseText);
        console.log("Parsed response:", data);

        // Handle various possible response formats from n8n
        if (typeof data === "string") {
          // Direct URL string
          imageUrl = data;
        } else if (Array.isArray(data)) {
          // n8n sometimes returns an array: [{ url: "..." }]
          const first = data[0];
          imageUrl = first?.url || first?.secure_url || first?.image || first?.result || null;
        } else if (typeof data === "object" && data !== null) {
          // Object: { url: "..." } or { secure_url: "..." } or nested
          imageUrl = data.url || data.secure_url || data.image || data.result || data.output || null;

          // Check if it's nested: { data: { url: "..." } }
          if (!imageUrl && data.data) {
            const nested = typeof data.data === "string" ? data.data : (data.data.url || data.data.secure_url);
            imageUrl = nested || null;
          }
        }
      } catch {
        // If response is not JSON, it might be a plain URL string
        if (responseText.startsWith("http")) {
          imageUrl = responseText.trim();
        }
      }

      if (imageUrl) {
        setProcessedImage(imageUrl);

        // Save to history & localStorage
        const newItem: HistoryItem = {
          id: crypto.randomUUID(),
          originalImage,
          processedUrl: imageUrl,
          fileName: file.name,
          timestamp: Date.now(),
        };
        setHistory((prev) => {
          const updated = [newItem, ...prev];
          saveHistory(updated);
          return updated;
        });
      } else {
        throw new Error(`Unexpected response format. Check browser console for details.`);
      }
    } catch (err) {
      console.error("Background removal failed:", err);
      setError(
        err instanceof Error ? err.message : "Something went wrong. Please try again."
      );
    } finally {
      setProcessing(false);
    }
  }, [originalImage]);

  const resetAll = useCallback(() => {
    setOriginalImage(null);
    setProcessedImage(null);
    setProcessing(false);
    setError(null);
    uploadedFileRef.current = null;
  }, []);

  const deleteHistoryItem = useCallback((id: string) => {
    setHistory((prev) => {
      const updated = prev.filter((item) => item.id !== id);
      saveHistory(updated);
      return updated;
    });
    if (previewItem?.id === id) setPreviewItem(null);
  }, [previewItem]);

  const clearAllHistory = useCallback(() => {
    if (!confirm("Are you sure you want to clear all history?")) return;
    setHistory([]);
    setPreviewItem(null);
    localStorage.removeItem(STORAGE_KEY);
  }, []);

  const onDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setDragOver(false);
      const file = e.dataTransfer.files[0];
      if (file) handleFile(file);
    },
    [handleFile]
  );

  const formatDate = (ts: number) => {
    const d = new Date(ts);
    return d.toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="min-h-screen bg-background text-gray-900">
      <Navbar />
      <div className="container mx-auto px-4 py-10">
        {/* Header */}
        <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold">Dashboard</h1>
            <p className="text-sm text-gray-500">
              Remove backgrounds from your images
            </p>
          </div>
          <div className="flex items-center gap-3">
            <span className="rounded-full border border-primary/20 bg-primary/5 px-3 py-1 text-xs font-semibold text-primary">
              Free Plan
            </span>
            <span className="text-sm text-gray-500">
              {history.length} images processed
            </span>
          </div>
        </div>

        {/* Tabs */}
        <div className="mx-auto max-w-4xl mb-6">
          <div className="flex gap-1 rounded-xl bg-gray-100 p-1">
            <button
              onClick={() => setActiveTab("editor")}
              className={`flex-1 flex items-center justify-center gap-2 rounded-lg py-2.5 px-4 text-sm font-semibold transition-all duration-200 ${activeTab === "editor"
                ? "bg-white text-gray-900 shadow-sm"
                : "text-gray-500 hover:text-gray-700"
                }`}
            >
              <Wand2 className="h-4 w-4" />
              Editor
            </button>
            <button
              onClick={() => setActiveTab("history")}
              className={`flex-1 flex items-center justify-center gap-2 rounded-lg py-2.5 px-4 text-sm font-semibold transition-all duration-200 ${activeTab === "history"
                ? "bg-white text-gray-900 shadow-sm"
                : "text-gray-500 hover:text-gray-700"
                }`}
            >
              <Clock className="h-4 w-4" />
              History
              {history.length > 0 && (
                <span className="ml-1 rounded-full bg-primary/10 px-2 py-0.5 text-xs text-primary font-bold">
                  {history.length}
                </span>
              )}
            </button>
          </div>
        </div>

        {/* ─── EDITOR TAB ─── */}
        {activeTab === "editor" && (
          <div className="mx-auto max-w-4xl">
            <div
              onDragOver={(e) => {
                e.preventDefault();
                setDragOver(true);
              }}
              onDragLeave={() => setDragOver(false)}
              onDrop={onDrop}
              className={`rounded-3xl border-2 border-dashed p-8 transition-all duration-300 ${dragOver
                ? "border-primary bg-primary/5 shadow-lg scale-[1.01]"
                : "border-gray-200 bg-white shadow-card"
                }`}
            >
              {!originalImage ? (
                <label className="flex cursor-pointer flex-col items-center gap-3 py-16">
                  <div className="flex h-20 w-20 items-center justify-center rounded-2xl gradient-brand shadow-lg mb-4">
                    <Upload className="h-8 w-8 text-white" />
                  </div>
                  <p className="text-xl font-bold text-gray-800">
                    Drop your image here
                  </p>
                  <p className="text-gray-500 mt-1">
                    or click to browse from your computer
                  </p>
                  <div className="mt-4 flex gap-2">
                    <span className="px-2 py-1 bg-gray-100 rounded text-xs text-gray-500">
                      JPG
                    </span>
                    <span className="px-2 py-1 bg-gray-100 rounded text-xs text-gray-500">
                      PNG
                    </span>
                    <span className="px-2 py-1 bg-gray-100 rounded text-xs text-gray-500">
                      WEBP
                    </span>
                  </div>
                  <input
                    type="file"
                    className="hidden"
                    accept="image/jpeg,image/png,image/webp"
                    onChange={(e) => {
                      const f = e.target.files?.[0];
                      if (f) handleFile(f);
                    }}
                  />
                </label>
              ) : (
                <div className="grid gap-10 lg:grid-cols-2 p-4">
                  {/* Original */}
                  <div className="space-y-4">
                    <h2 className="text-lg font-bold flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-gray-400" />
                      Original
                    </h2>
                    <div className="checkerboard flex items-center justify-center rounded-2xl p-2 border border-gray-100 overflow-hidden bg-gray-50/50">
                      <img
                        src={originalImage}
                        alt="Original"
                        className="max-h-[400px] w-auto rounded-lg object-contain shadow-sm transition-transform hover:scale-[1.02] duration-300"
                      />
                    </div>
                  </div>

                  {/* Result */}
                  <div className="space-y-4">
                    <h2 className="text-lg font-bold flex items-center gap-2">
                      <span
                        className={`w-2 h-2 rounded-full ${processing
                          ? "bg-primary animate-pulse"
                          : processedImage
                            ? "bg-green-500"
                            : "bg-gray-300"
                          }`}
                      />
                      Result
                    </h2>
                    <div className="checkerboard flex items-center justify-center rounded-2xl p-2 border border-gray-100 overflow-hidden bg-gray-50/50 min-h-[300px]">
                      {processing ? (
                        <div className="flex flex-col items-center gap-4 py-20">
                          <div className="relative">
                            <Zap className="h-12 w-12 text-primary animate-bounce" />
                            <div className="absolute inset-0 h-12 w-12 text-primary animate-ping opacity-20">
                              <Zap />
                            </div>
                          </div>
                          <div className="space-y-2 text-center">
                            <p className="font-bold text-lg">AI is working...</p>
                            <p className="text-sm text-gray-400">
                              Removing background layers
                            </p>
                          </div>
                        </div>
                      ) : error ? (
                        <div className="flex flex-col items-center gap-4 py-16">
                          <AlertCircle className="h-12 w-12 text-red-400" />
                          <div className="space-y-2 text-center max-w-xs">
                            <p className="font-bold text-lg text-red-600">
                              Processing Failed
                            </p>
                            <p className="text-sm text-gray-500">{error}</p>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={removeBackground}
                              className="mt-2"
                            >
                              Try Again
                            </Button>
                          </div>
                        </div>
                      ) : processedImage ? (
                        <img
                          src={processedImage}
                          alt="Processed"
                          className="max-h-[400px] w-auto rounded-lg object-contain shadow-sm transition-transform hover:scale-[1.02] duration-300"
                        />
                      ) : (
                        <div className="flex flex-col items-center gap-4 py-16 text-center">
                          <Wand2 className="h-10 w-10 text-gray-300" />
                          <p className="text-sm text-gray-400">
                            Click "Remove Background" to process
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Action buttons */}
            {originalImage && (
              <div className="mt-6 flex justify-center gap-3 flex-wrap">
                {!processedImage && !processing && (
                  <Button
                    variant="hero"
                    onClick={removeBackground}
                    className="px-8 py-3 text-base"
                  >
                    <Wand2 className="mr-2 h-5 w-5" />
                    Remove Background
                  </Button>
                )}
                {processedImage && !processing && (
                  <Button
                    variant="hero"
                    onClick={() =>
                      downloadFromUrl(
                        processedImage,
                        `bg-removed-${Date.now()}.png`
                      )
                    }
                  >
                    <Download className="mr-2 h-4 w-4" />
                    Download PNG
                  </Button>
                )}
                <Button
                  variant="outline"
                  onClick={resetAll}
                  disabled={processing}
                >
                  <ImageIcon className="mr-2 h-4 w-4" />
                  New Image
                </Button>
              </div>
            )}
          </div>
        )}

        {/* ─── HISTORY TAB ─── */}
        {activeTab === "history" && (
          <div className="mx-auto max-w-5xl">
            {/* History header */}
            {history.length > 0 && (
              <div className="mb-6 flex items-center justify-between">
                <p className="text-sm text-gray-500">
                  {history.length} image{history.length !== 1 && "s"} processed
                </p>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={clearAllHistory}
                  className="text-red-500 hover:text-red-700 hover:border-red-300"
                >
                  <Trash2 className="mr-2 h-3.5 w-3.5" />
                  Clear All
                </Button>
              </div>
            )}

            {/* Preview modal */}
            {previewItem && (
              <div className="mb-8 rounded-3xl border border-gray-200 bg-white p-6 shadow-card animate-in fade-in duration-300">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="font-bold text-lg">{previewItem.fileName}</h3>
                    <p className="text-xs text-gray-400">
                      {formatDate(previewItem.timestamp)}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="hero"
                      size="sm"
                      onClick={() =>
                        downloadFromUrl(
                          previewItem.processedUrl,
                          `bg-removed-${previewItem.fileName}`
                        )
                      }
                    >
                      <Download className="mr-2 h-3.5 w-3.5" />
                      Download
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setPreviewItem(null)}
                    >
                      Close
                    </Button>
                  </div>
                </div>
                <div className="grid gap-6 md:grid-cols-2">
                  <div className="space-y-2">
                    <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide">
                      Original
                    </p>
                    <div className="checkerboard rounded-xl p-2 border border-gray-100 overflow-hidden flex items-center justify-center">
                      <img
                        src={previewItem.originalImage}
                        alt="Original"
                        className="max-h-[350px] w-auto rounded-lg object-contain"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide">
                      Background Removed
                    </p>
                    <div className="checkerboard rounded-xl p-2 border border-gray-100 overflow-hidden flex items-center justify-center">
                      <img
                        src={previewItem.processedUrl}
                        alt="Processed"
                        className="max-h-[350px] w-auto rounded-lg object-contain"
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* History grid */}
            {history.length === 0 ? (
              <div className="rounded-3xl border-2 border-dashed border-gray-200 bg-white p-16 text-center shadow-card">
                <Clock className="mx-auto h-12 w-12 text-gray-300 mb-4" />
                <p className="font-bold text-lg text-gray-800">No history yet</p>
                <p className="text-sm text-gray-400 mt-1 mb-6">
                  Process your first image to see it here
                </p>
                <Button
                  variant="hero"
                  onClick={() => setActiveTab("editor")}
                >
                  <Wand2 className="mr-2 h-4 w-4" />
                  Go to Editor
                </Button>
              </div>
            ) : (
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {history.map((item) => (
                  <div
                    key={item.id}
                    className="group rounded-2xl border border-gray-200 bg-white shadow-card overflow-hidden transition-all duration-200 hover:shadow-elevated hover:-translate-y-0.5"
                  >
                    {/* Thumbnail */}
                    <div className="checkerboard relative aspect-[4/3] flex items-center justify-center p-3 overflow-hidden">
                      <img
                        src={item.processedUrl}
                        alt={item.fileName}
                        className="max-h-full max-w-full object-contain rounded-lg"
                      />
                      {/* Hover overlay */}
                      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-all duration-200 flex items-center justify-center opacity-0 group-hover:opacity-100">
                        <Button
                          variant="outline"
                          size="sm"
                          className="bg-white/90 backdrop-blur-sm hover:bg-white"
                          onClick={() => setPreviewItem(item)}
                        >
                          <Eye className="mr-2 h-3.5 w-3.5" />
                          View
                        </Button>
                      </div>
                    </div>

                    {/* Card footer */}
                    <div className="p-3 border-t border-gray-100">
                      <p
                        className="text-sm font-semibold truncate text-gray-800"
                        title={item.fileName}
                      >
                        {item.fileName}
                      </p>
                      <p className="text-xs text-gray-400 mt-0.5">
                        {formatDate(item.timestamp)}
                      </p>
                      <div className="mt-3 flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          className="flex-1 text-xs h-8"
                          onClick={() =>
                            downloadFromUrl(
                              item.processedUrl,
                              `bg-removed-${item.fileName}`
                            )
                          }
                        >
                          <Download className="mr-1.5 h-3 w-3" />
                          Download
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          className="text-xs h-8 text-red-400 hover:text-red-600 hover:border-red-200 px-2"
                          onClick={() => deleteHistoryItem(item.id)}
                        >
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
}

import { useState, useCallback } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Upload, Download, Image as ImageIcon, Zap } from "lucide-react";

export default function Dashboard() {
  const [dragOver, setDragOver] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);
  const [processing, setProcessing] = useState(false);

  const usageCount = 1;
  const usageLimit = 3;

  const handleFile = useCallback((file: File) => {
    if (file.size > 10 * 1024 * 1024) return alert("File must be under 10MB");
    if (!["image/jpeg", "image/png", "image/webp"].includes(file.type)) return alert("Only JPG, PNG, WEBP allowed");

    const reader = new FileReader();
    reader.onload = (e) => {
      setPreview(e.target?.result as string);
      setProcessing(true);
      // Simulate processing — replace with real API call
      setTimeout(() => setProcessing(false), 2000);
    };
    reader.readAsDataURL(file);
  }, []);

  const onDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files[0];
    if (file) handleFile(file);
  }, [handleFile]);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="container mx-auto px-4 py-10">
        <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold">Dashboard</h1>
            <p className="text-sm text-muted-foreground">Remove backgrounds from your images</p>
          </div>
          <div className="flex items-center gap-3">
            <span className="rounded-full border border-primary/20 bg-primary/5 px-3 py-1 text-xs font-semibold text-primary">Free Plan</span>
            <span className="text-sm text-muted-foreground">
              {usageCount}/{usageLimit} used today
            </span>
          </div>
        </div>

        {/* Upload area */}
        <div className="mx-auto max-w-3xl">
          <div
            onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
            onDragLeave={() => setDragOver(false)}
            onDrop={onDrop}
            className={`rounded-3xl border-2 border-dashed p-8 transition-colors ${
              dragOver ? "border-primary bg-primary/5" : "border-border bg-card"
            }`}
          >
            {!preview ? (
              <label className="flex cursor-pointer flex-col items-center gap-3 py-12">
                <div className="flex h-16 w-16 items-center justify-center rounded-2xl gradient-brand">
                  <Upload className="h-7 w-7 text-primary-foreground" />
                </div>
                <p className="font-medium">Drop your image here or click to browse</p>
                <p className="text-sm text-muted-foreground">JPG, PNG, WEBP • Max 10MB</p>
                <input
                  type="file"
                  className="hidden"
                  accept="image/jpeg,image/png,image/webp"
                  onChange={(e) => { const f = e.target.files?.[0]; if (f) handleFile(f); }}
                />
              </label>
            ) : (
              <div className="space-y-6">
                <div className="checkerboard flex items-center justify-center rounded-2xl p-4">
                  {processing ? (
                    <div className="flex flex-col items-center gap-3 py-16">
                      <Zap className="h-10 w-10 animate-pulse text-primary" />
                      <p className="font-medium">Processing your image...</p>
                    </div>
                  ) : (
                    <img src={preview} alt="Processed" className="max-h-80 rounded-lg object-contain" />
                  )}
                </div>
                <div className="flex justify-center gap-3">
                  <Button
                    variant="hero"
                    disabled={processing}
                    onClick={() => {
                      // TODO: download processed image
                    }}
                  >
                    <Download className="mr-2 h-4 w-4" />
                    Download PNG
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => { setPreview(null); setProcessing(false); }}
                  >
                    <ImageIcon className="mr-2 h-4 w-4" />
                    New Image
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Recent activity placeholder */}
        <div className="mx-auto mt-12 max-w-3xl">
          <h2 className="mb-4 text-lg font-semibold">Recent Activity</h2>
          <div className="rounded-2xl border border-border bg-card p-8 text-center shadow-card">
            <ImageIcon className="mx-auto h-8 w-8 text-muted-foreground/40" />
            <p className="mt-2 text-sm text-muted-foreground">No images processed yet. Upload your first image above!</p>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}

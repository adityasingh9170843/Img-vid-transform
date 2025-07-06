"use client";

import React, { useState, useEffect, useRef } from "react";
import { CldImage } from "next-cloudinary";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { UploadCloud, Download, Image as ImageIcon } from "lucide-react";

const socialFormats = {
  "Instagram Square (1:1)": { width: 1080, height: 1080, aspectRatio: "1:1" },
  "Instagram Portrait (4:5)": { width: 1080, height: 1350, aspectRatio: "4:5" },
  "Twitter Post (16:9)": { width: 1200, height: 675, aspectRatio: "16:9" },
  "Twitter Header (3:1)": { width: 1500, height: 500, aspectRatio: "3:1" },
  "Facebook Cover (205:78)": { width: 820, height: 312, aspectRatio: "205:78" },
};
type SocialFormat = keyof typeof socialFormats;

export default function SocialShare() {
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [selectedFormat, setSelectedFormat] = useState<SocialFormat>("Instagram Square (1:1)");
  const [prompt, setPrompt] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const [isTransforming, setIsTransforming] = useState(false);
  const [progress, setProgress] = useState(0);
  const imageRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    if (uploadedImage) setIsTransforming(true);
  }, [selectedFormat, uploadedImage, prompt]);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    const form = new FormData();
    form.append("file", file);
    const pi = setInterval(() => setProgress(p => Math.min(p + 5, 95)), 150);

    try {
      const res = await fetch("/api/image-upload", { method: "POST", body: form });
      clearInterval(pi);
      setProgress(100);
      if (!res.ok) throw new Error();
      const json = await res.json();
      setUploadedImage(json.publicId);
    } catch {
      alert("Upload error");
      clearInterval(pi);
      setProgress(0);
    } finally {
      setTimeout(() => setIsUploading(false), 500);
    }
  };

  const handleDownload = () => {
    if (!imageRef.current) return;
    fetch(imageRef.current.src)
      .then(r => r.blob())
      .then(blob => {
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.download = `${prompt || selectedFormat}`.replace(/\s+/g, "_").toLowerCase() + ".png";
        document.body.appendChild(link);
        link.click();
        link.remove();
        URL.revokeObjectURL(url);
      });
  };

  return (
    <div className="min-h-screen bg-gradient-to-tr from-[#24243e] via-[#0f0c29] to-[#0f0c29] text-white">
      <div className="container mx-auto p-6 max-w-4xl">
        <header className="text-center mb-8">
          <h1 className="text-4xl p-3 font-bold bg-clip-text text-transparent bg-gradient-to-r from-fuchsia-500 to-cyan-500">
            AI Background Filler
          </h1>
        </header>

        <Card className="bg-black/30 border-fuchsia-500/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <UploadCloud className="text-fuchsia-400" /> Upload Image
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <Input type="file" onChange={handleFileUpload} disabled={isUploading} />
            {isUploading && (
              <div className="w-full bg-gray-800 rounded-full overflow-hidden">
                <div
                  className="bg-gradient-to-r from-fuchsia-500 to-cyan-500 h-2"
                  style={{ width: `${progress}%` }}
                />
              </div>
            )}

            {uploadedImage && (
              <>
                <div className="space-y-4">
                  <Label>Format</Label>
                  <Select value={selectedFormat} onValueChange={(v) => setSelectedFormat(v as any)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.keys(socialFormats).map((fmt) => (
                        <SelectItem key={fmt} value={fmt}>
                          {fmt}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  <Label>Prompt (optional)</Label>
                  <Input
                    placeholder="e.g. beach at sunset"
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                  />

                  <Button onClick={() => setIsTransforming(true)} disabled={isTransforming}>
                    <ImageIcon className="mr-2" />
                    Generate Background
                  </Button>
                  <Button onClick={handleDownload} disabled={isTransforming}>
                    <Download className="mr-2" />
                    Download Result
                  </Button>
                </div>

                <div className="relative mt-6 border-dashed border-2 border-gray-700 rounded-lg p-4 min-h-[300px] flex items-center justify-center">
                  {isTransforming && (
                    <div className="absolute inset-0 bg-black/70 flex flex-col items-center justify-center">
                      <Skeleton className="h-48 w-48 rounded-lg bg-gray-700" />
                      <p className="mt-4 text-gray-400 animate-pulse">Applying transformation…</p>
                    </div>
                  )}

                  <CldImage
                    ref={imageRef}
                    src={uploadedImage}
                    width={1920}
                    height={2000}
                    alt="Generated image"
                    
                    crop="fill"
                    
                    replaceBackground={prompt ? prompt : true}
                    gravity="auto"
                    onLoad={() => setIsTransforming(false)}
                    onError={() => setIsTransforming(false)}
                    className="rounded-md shadow-lg"
                    style={{ opacity: isTransforming ? 0 : 1, transition: "opacity 0.5s" }}
                  />
                </div>
              </>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

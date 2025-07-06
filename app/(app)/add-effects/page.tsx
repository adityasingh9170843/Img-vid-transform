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

// Supported image effects & AI enhancements
const effectsMap = {
  None: {},
  Sepia: { sepia: true },
  Pixelate: { pixelate: true },
  Blur: { blur: "200" },
  Opacity50: { opacity: "50" },
  Grayscale: { grayscale: true },
  Enhance: { enhance: true },
  Improve: { improve: true },
  Restore: { restore: true },
};

type EffectKey = keyof typeof effectsMap;

export default function ImageEffectsPage() {
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [selectedEffect, setSelectedEffect] = useState<EffectKey>("None");
  const [isUploading, setIsUploading] = useState(false);
  const [isTransforming, setIsTransforming] = useState(false);
  const [progress, setProgress] = useState(0);
  const imageRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    if (uploadedImage) {
      setIsTransforming(true);
    }
  }, [uploadedImage, selectedEffect]);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    const form = new FormData();
    form.append("file", file);
    const pi = setInterval(() => setProgress((p) => Math.min(p + 5, 95)), 150);

    try {
      const res = await fetch("/api/image-upload", {
        method: "POST",
        body: form,
      });
      clearInterval(pi);
      setProgress(100);
      if (!res.ok) throw new Error("Upload failed");
      const { publicId } = await res.json();
      setUploadedImage(publicId);
    } catch (err) {
      alert("Upload failed");
      clearInterval(pi);
      setProgress(0);
    } finally {
      setTimeout(() => setIsUploading(false), 500);
    }
  };

  const handleDownload = () => {
    if (!imageRef.current) return;
    fetch(imageRef.current.src)
      .then((r) => r.blob())
      .then((blob) => {
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.download = `effect_${selectedEffect.toLowerCase()}.png`;
        document.body.appendChild(link);
        link.click();
        link.remove();
        URL.revokeObjectURL(url);
      });
  };

  return (
    <div className="min-h-screen bg-[#0f0c29] text-white p-6">
      <div className="max-w-3xl mx-auto space-y-6">
        <header className="text-center">
          <h1 className="text-4xl p-3 font-bold bg-clip-text text-transparent bg-gradient-to-r from-fuchsia-500 to-cyan-500">
            Apply Effects & AI Enhancements
          </h1>
          <p className="text-gray-400">
            Upload an image, choose an effect, preview and download.
          </p>
        </header>

        <Card className="bg-black/30 border-fuchsia-500/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <UploadCloud className="text-fuchsia-400" /> Upload Image
            </CardTitle>
          </CardHeader>

          <CardContent className="space-y-6">
            <Input type="file" onChange={handleUpload} disabled={isUploading} />
            {isUploading && (
              <div className="w-full bg-gray-800 rounded-full overflow-hidden h-2">
                <div
                  className="bg-gradient-to-r from-fuchsia-500 to-cyan-500 h-full"
                  style={{ width: `${progress}%` }}
                />
              </div>
            )}

            {uploadedImage && (
              <>
                <div className="space-y-4">
                  <Label>Select Effect</Label>
                  <Select
                    value={selectedEffect}
                    onValueChange={(v) => setSelectedEffect(v as EffectKey)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-[#6458b7] cursor-pointer">
                      {Object.keys(effectsMap).map((opt) => (
                        <SelectItem key={opt} value={opt}>
                          {opt}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  <div className="flex gap-4">
                    <Button
                      onClick={() => setIsTransforming(true)}
                      disabled={isTransforming}
                    >
                      <ImageIcon className="mr-2" /> Apply
                    </Button>
                    <Button onClick={handleDownload} disabled={isTransforming}>
                      <Download className="mr-2" /> Download
                    </Button>
                  </div>
                </div>

                <div className="relative mt-6 border-dashed border-2 border-gray-700 rounded-lg p-4 min-h-[300px] flex items-center justify-center">
                  {isTransforming && (
                    <div className="absolute inset-0 bg-black/70 flex flex-col items-center justify-center">
                      <Skeleton className="h-48 w-48 rounded-lg bg-gray-700" />
                      <p className="mt-4 text-gray-400 animate-pulse">
                        Applying effect…
                      </p>
                    </div>
                  )}

                  <CldImage
                    ref={imageRef}
                    src={uploadedImage}
                    width={800}
                    height={800}
                    alt="Uploaded Image"
                    crop="fill"
                    sizes="100vw"
                    {...effectsMap[selectedEffect]}
                    onLoad={() => setIsTransforming(false)}
                    onError={() => setIsTransforming(false)}
                    className="rounded-md shadow-lg"
                    style={{
                      opacity: isTransforming ? 0 : 1,
                      transition: "opacity 0.5s",
                    }}
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

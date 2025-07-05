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
// We are no longer relying on the Progress component's internal styling
import { Progress } from "@/components/ui/progress"; 
import { Skeleton } from "@/components/ui/skeleton";
import { UploadCloud, Download, Image as ImageIcon } from "lucide-react";

const socialFormats = {
  "Instagram Square (1:1)": { width: 1080, height: 1080, aspectRatio: "1:1" },
  "Instagram Portrait (4:5)": {
    width: 1080,
    height: 1350,
    aspectRatio: "4:5",
  },
  "Twitter Post (16:9)": {
    width: 1200,
    height: 675,
    aspectRatio: "16:9",
  },
  "Twitter Header (3:1)": {
    width: 1500,
    height: 500,
    aspectRatio: "3:1",
  },
  "Facebook Cover (205:78)": {
    width: 820,
    height: 312,
    aspectRatio: "205:78",
  },
};

type SocialFormat = keyof typeof socialFormats;

export default function SocialShare() {
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [selectedFormat, setSelectedFormat] = useState<SocialFormat>(
    "Instagram Square (1:1)"
  );
  const [isUploading, setIsUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [isTransforming, setIsTransforming] = useState(false);
  const imageRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    if (uploadedImage) {
      setIsTransforming(true);
    }
  }, [selectedFormat, uploadedImage]);

  const handleFileUpload = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    setProgress(0);
    
    const formData = new FormData();
    formData.append("file", file);

    const progressInterval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 95) {
          clearInterval(progressInterval);
          return 95;
        }
        return prev + 5;
      });
    }, 150);

    try {
      const response = await fetch("/api/image-upload", {
        method: "POST",
        body: formData,
      });

      clearInterval(progressInterval);
      setProgress(100);

      if (!response.ok) throw new Error("Image upload failed");

      const data = await response.json();
      setUploadedImage(data.publicId);
    } catch (error) {
      console.error(error);
      alert("An error occurred during upload. Please try again.");
      clearInterval(progressInterval);
      setProgress(0);
    } finally {
      setTimeout(() => {
        setIsUploading(false);
      }, 1000);
    }
  };

  const handleDownload = () => {
    if (!imageRef.current) return;
    fetch(imageRef.current.src)
      .then((response) => response.blob())
      .then((blob) => {
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.download = `${selectedFormat
          .replace(/\s+/g, "_")
          .toLowerCase()}.png`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);
      });
  };

  return (
    <div className="min-h-screen w-full bg-[#0f0c29] bg-gradient-to-tr from-[#24243e] via-[#0f0c29] to-[#0f0c29] text-white">
      <div className="container mx-auto p-4 sm:p-6 lg:p-8 max-w-5xl">
        <header className="text-center mb-10">
          <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-fuchsia-500 to-cyan-500">
            Social Media Image Creator
          </h1>
          <p className="mt-2 text-lg text-gray-400">
            Effortlessly resize and format your images for any social platform.
          </p>
        </header>

        <Card className="shadow-2xl border-fuchsia-500/20 bg-black/30 backdrop-blur-xl rounded-2xl overflow-hidden">
          <CardHeader className="p-6 border-b border-fuchsia-500/20">
            <CardTitle className="flex items-center gap-3 text-xl font-semibold text-gray-200">
              <UploadCloud className="h-6 w-6 text-fuchsia-400" />
              Upload Your Image
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6 space-y-6">
            <div className="space-y-2">
              <Label
                htmlFor="upload"
                className="text-sm font-medium text-gray-300"
              >
                Choose an image file
              </Label>
              <div className="relative">
                <Input
                  id="upload"
                  type="file"
                  onChange={handleFileUpload}
                  className="text-gray-300  border-gray-600 bg-gray-800/50 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold  file:text-fuchsia-400 file:p-1 hover:file:bg-fuchsia-500/20 transition-colors  "
                  disabled={isUploading}
                />
              </div>
            </div>

            {isUploading && (
              <div className="space-y-2 pt-2">
                <Label className="text-sm font-medium text-gray-400 animate-pulse">
                  Uploading...
                </Label>
                <div className="w-full bg-gray-800/50 rounded-full h-2.5">
                  <div
                    className="bg-gradient-to-r from-fuchsia-500 to-cyan-500 h-2.5 rounded-full transition-all duration-300 ease-in-out"
                    style={{ width: `${progress}%` }}
                  ></div>
                </div>
              </div>
            )}

            {uploadedImage && (
              <>
                <div className="border-t border-fuchsia-500/20 my-6"></div>
                <div className="grid md:grid-cols-2 gap-8 items-start">
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label
                        htmlFor="format-select"
                        className="text-sm font-medium text-gray-300"
                      >
                        Select Social Media Format
                      </Label>
                      <Select
                        value={selectedFormat}
                        onValueChange={(value: string) =>
                          setSelectedFormat(value as SocialFormat)
                        }
                      >
                        <SelectTrigger
                          id="format-select"
                          className="w-full text-base bg-gray-800/50 border-gray-600 text-gray-200"
                        >
                          <SelectValue placeholder="Choose format" />
                        </SelectTrigger>
                        <SelectContent className="bg-gray-900/80 backdrop-blur-md border-gray-700 text-gray-200 z-50">
                          {Object.keys(socialFormats).map((format) => (
                            <SelectItem
                              key={format}
                              value={format}
                              className="text-base focus:bg-fuchsia-500/20 focus:text-white"
                            >
                              {format}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <Button
                      onClick={handleDownload}
                      className="w-full bg-gradient-to-r from-fuchsia-600 to-blue-600 hover:from-fuchsia-700 hover:to-blue-700 text-white font-bold py-3 px-4 rounded-lg text-base transition-transform transform hover:scale-105 shadow-lg shadow-fuchsia-500/20"
                    >
                      <Download className="mr-2 h-5 w-5" />
                      Download for {selectedFormat}
                    </Button>
                  </div>

                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-gray-200 flex items-center gap-2">
                      <ImageIcon className="h-5 w-5 text-cyan-400" />
                      Preview
                    </h3>
                    <div className="relative flex justify-center items-center rounded-lg border-2 border-dashed border-gray-700 bg-black/20 p-4 min-h-[300px]">
                      {isTransforming && (
                        <div className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-black/70 backdrop-blur-sm">
                          <Skeleton className="h-48 w-48 rounded-lg bg-gray-700" />
                          <p className="mt-4 text-sm font-medium text-gray-400 animate-pulse">
                            Applying transformation...
                          </p>
                        </div>
                      )}
                      <CldImage
                        width={socialFormats[selectedFormat].width}
                        height={socialFormats[selectedFormat].height}
                        src={uploadedImage}
                        sizes="100vw"
                        alt="Transformed image"
                        crop="fill"
                        aspectRatio={socialFormats[selectedFormat].aspectRatio}
                        gravity="auto"
                        onLoad={() => setIsTransforming(false)}
                        className="rounded-md shadow-lg shadow-black/40"
                        ref={imageRef}
                        style={{
                          opacity: isTransforming ? 0 : 1,
                          transition: "opacity 0.5s ease-in-out",
                        }}
                      />
                    </div>
                  </div>
                </div>
              </>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
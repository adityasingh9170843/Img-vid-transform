"use client";

import React, { useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import { UploadCloud } from "lucide-react";

function VideoUpload() {
  const [file, setFile] = useState<File | null>(null);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [isUploading, setIsUploading] = useState(false);

  const router = useRouter();

  const MAX_FILE_SIZE = 70 * 1024 * 1024;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) return;

    if (file.size > MAX_FILE_SIZE) {
      alert("File size too large");
      return;
    }

    setIsUploading(true);
    const formData = new FormData();
    formData.append("file", file);
    formData.append("title", title);
    formData.append("description", description);
    formData.append("originalSize", file.size.toString());

    try {
      const response = await axios.post("/api/video-upload", formData);
      if (response.status !== 200) throw new Error("Upload failed");

      router.push("/");
    } catch (error) {
      console.log(error);
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="min-h-screen w-full bg-[#0f0c29] bg-gradient-to-tr from-[#24243e] via-[#0f0c29] to-[#0f0c29] text-white py-10 px-4">
      <div className="max-w-3xl mx-auto">
        <div className="bg-black/30 backdrop-blur-lg border border-fuchsia-500/20 rounded-2xl shadow-lg p-8">
          <h1 className="text-3xl font-bold text-center mb-6 text-white flex items-center justify-center gap-2">
            <UploadCloud className="text-fuchsia-400 w-6 h-6" />
            Upload Your Video
          </h1>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">
                Title
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full rounded-lg bg-gray-800/50 text-white border border-gray-600 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-fuchsia-500 transition"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">
                Description
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={4}
                className="w-full rounded-lg bg-gray-800/50 text-white border border-gray-600 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-fuchsia-500 transition resize-none"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">
                Video File
              </label>
              <input
                type="file"
                accept="video/*"
                onChange={(e) => setFile(e.target.files?.[0] || null)}
                className="w-full text-gray-300 border-gray-600 bg-gray-800/50 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:text-fuchsia-400 hover:file:bg-fuchsia-500/20 transition-colors"
                required
              />
            </div>
            <button
              type="submit"
              disabled={isUploading}
              className="w-full py-3 px-4 rounded-lg font-semibold text-white bg-gradient-to-r from-fuchsia-600 to-cyan-600 hover:from-fuchsia-700 hover:to-cyan-700 transition-all duration-300 shadow-lg shadow-fuchsia-500/30 disabled:opacity-50"
            >
              {isUploading ? "Uploading..." : "Upload Video"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
  

export default VideoUpload;

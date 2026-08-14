"use client"

import { useState } from "react"

export default function UploadPage() {

    const [file, setFile] = useState<File | null>(null)
    const [uploading, setUploading] = useState(false)
    const [uploadedUrl, setUploadedUrl] = useState("")
    const [error, setError] = useState("")

    const handleUpload = async (e: React.FormEvent) => {

        e.preventDefault()

        if (!file) {
            setError("Please choose a file first")
            return
        }

        setUploading(true)
        setError("")
        setUploadedUrl("")

        try {

            const formData = new FormData()
            formData.append("file", file)

            const res = await fetch("/api/upload", {
                method: "POST",
                body: formData
            })

            const data = await res.json()

            if (!res.ok) {
                setError(data.message || "Upload failed")
                return
            }

            setUploadedUrl(data.url)
            setFile(null)

        } catch {

            setError("Server error. Please try again.")

        } finally {

            setUploading(false)

        }

    }

    return (

        <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4 sm:p-6">

            <div className="bg-white rounded-2xl shadow-xl w-full max-w-105 p-6 sm:p-8">

                <h1 className="text-xl sm:text-2xl font-semibold mb-6 text-gray-800">
                    File Upload
                </h1>

                <form onSubmit={handleUpload} className="space-y-5">

                    <div>

                        <label className="text-sm font-medium text-gray-600 block mb-2">
                            Choose a file
                        </label>

                        <input
                            type="file"
                            onChange={(e) => setFile(e.target.files?.[0] || null)}
                            className="w-full border border-gray-300 rounded-lg p-2 text-sm"
                        />

                    </div>

                    <button
                        type="submit"
                        disabled={uploading}
                        className="w-full bg-purple-600 hover:bg-purple-700 disabled:opacity-50 text-white py-3 rounded-full transition"
                    >
                        {uploading ? "Uploading..." : "Upload"}
                    </button>

                </form>

                {error && (
                    <p className="text-red-600 text-sm mt-4">{error}</p>
                )}

                {uploadedUrl && (

                    <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-lg">

                        <p className="text-sm text-green-700 font-medium mb-1">
                            Uploaded successfully
                        </p>

                        <a
                            href={uploadedUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-sm text-purple-600 underline break-all"
                        >
                            {uploadedUrl}
                        </a>

                    </div>

                )}

            </div>

        </div>

    )

}

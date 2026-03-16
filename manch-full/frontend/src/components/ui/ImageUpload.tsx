import { useState, useRef } from 'react'
import axios from 'axios'

interface Props {
  currentUrl?: string
  onUpload: (url: string) => void
  label?: string
}

const CLOUD_NAME = 'dw223jlfn'
const UPLOAD_PRESET = 'manch_uploads'

export default function ImageUpload({ currentUrl, onUpload, label = 'Profile Picture' }: Props) {
  const [uploading, setUploading] = useState(false)
  const [preview, setPreview] = useState<string | null>(currentUrl ?? null)
  const [error, setError] = useState('')
  const inputRef = useRef<HTMLInputElement>(null)

  const handleFile = async (file: File) => {
    if (!file) return

    if (!file.type.startsWith('image/')) {
      setError('Please select an image file')
      return
    }

    if (file.size > 5 * 1024 * 1024) {
      setError('Image must be less than 5MB')
      return
    }

    setError('')
    setUploading(true)

    try {
      const formData = new FormData()
      formData.append('file', file)
      formData.append('upload_preset', UPLOAD_PRESET)
      formData.append('folder', 'manch/profiles')

      const response = await axios.post(
        `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`,
        formData
      )

      const url = response.data.secure_url
      setPreview(url)
      onUpload(url)
    } catch (e) {
      setError('Upload failed. Please try again.')
    } finally {
      setUploading(false)
    }
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    const file = e.dataTransfer.files[0]
    if (file) handleFile(file)
  }

  return (
    <div>
      <label className="form-label">{label}</label>

      <div
        className={`relative border-2 border-dashed rounded-sm transition-all duration-200
          ${uploading ? 'border-gold/50 bg-gold/5' : 'border-black/10 hover:border-gold/50 hover:bg-gold/5'}`}
        onDrop={handleDrop}
        onDragOver={e => e.preventDefault()}
      >
        {preview ? (
          <div className="flex items-center gap-4 p-4">
            <img
              src={preview}
              alt="Profile"
              className="w-20 h-20 rounded-full object-cover border-2 border-gold/20"
            />
            <div className="flex-1">
              <p className="text-sm font-medium text-ink mb-1">Profile picture uploaded ✅</p>
              <p className="text-xs text-muted mb-2">Click below to change it</p>
              <button
                type="button"
                onClick={() => inputRef.current?.click()}
                disabled={uploading}
                className="btn-outline py-1.5 px-4 text-xs"
              >
                {uploading ? 'Uploading...' : 'Change Photo'}
              </button>
            </div>
          </div>
        ) : (
          <div
            className="flex flex-col items-center justify-center py-8 px-4 cursor-pointer"
            onClick={() => inputRef.current?.click()}
          >
            {uploading ? (
              <>
                <div className="w-10 h-10 border-2 border-gold border-t-transparent rounded-full animate-spin mb-3" />
                <p className="text-sm text-muted">Uploading...</p>
              </>
            ) : (
              <>
                <span className="text-4xl mb-3">📸</span>
                <p className="text-sm font-medium text-ink mb-1">Click to upload or drag & drop</p>
                <p className="text-xs text-muted">JPG, PNG up to 5MB</p>
              </>
            )}
          </div>
        )}
      </div>

      {error && <p className="text-rust text-xs mt-1">{error}</p>}

      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={e => {
          const file = e.target.files?.[0]
          if (file) handleFile(file)
        }}
      />
    </div>
  )
}
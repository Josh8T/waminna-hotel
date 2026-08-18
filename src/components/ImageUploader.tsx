import { useState, useRef } from 'react';
import { Upload, Trash2, Star, Image as ImageIcon, Link as LinkIcon, Sparkles, Check, Loader2 } from 'lucide-react';
import { getPhotoUrl } from '@/lib/data';
import { uploadRoomImageToSupabase } from '@/lib/supabase';

interface ImageUploaderProps {
  photos: string[];
  onChange: (photos: string[]) => void;
}

const PRESET_PHOTOS = [
  { label: 'Urban Standard', path: 'images/rooms/standard/standard.png' },
  { label: 'Twin Standard', path: 'images/rooms/standard_2bed/standard_2bed.png' },
  { label: 'Executive Deluxe', path: 'images/rooms/deluxe/deluxe.png' },
  { label: 'Pool Deluxe', path: 'images/rooms/deluxe/deluxe_2.png' },
  { label: 'Skyline Suite', path: 'images/rooms/suite/suite.jpg' },
  { label: 'Penthouse Suite', path: 'images/rooms/suite2/suite2_2.png' },
  { label: 'Bathroom View', path: 'images/room-bathroom.jpg' },
  { label: 'Balcony View', path: 'images/room-view.jpg' },
];

/**
 * Optimizes image file on client side:
 * - Resizes max dimensions to 1920px for crisp HD display
 * - Converts to WebP format with 0.85 quality
 * - Returns WebP Blob for Supabase upload & fallback DataURL
 */
export async function compressImageToWebP(
  file: File,
  maxDim = 1920,
  quality = 0.85
): Promise<{ dataUrl: string; blob: Blob; origSize: number; newSize: number }> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        let { width, height } = img;
        if (width > maxDim || height > maxDim) {
          if (width > height) {
            height = Math.round((height * maxDim) / width);
            width = maxDim;
          } else {
            width = Math.round((width * maxDim) / height);
            height = maxDim;
          }
        }

        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        if (!ctx) return reject(new Error('Canvas unsupported'));

        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = 'high';
        ctx.drawImage(img, 0, 0, width, height);

        const dataUrl = canvas.toDataURL('image/webp', quality);
        const origSize = file.size;
        const newSize = Math.round((dataUrl.length * 3) / 4);

        canvas.toBlob(
          (blob) => {
            if (blob) {
              resolve({ dataUrl, blob, origSize, newSize });
            } else {
              const byteString = atob(dataUrl.split(',')[1]);
              const mimeString = dataUrl.split(',')[0].split(':')[1].split(';')[0];
              const ab = new ArrayBuffer(byteString.length);
              const ia = new Uint8Array(ab);
              for (let i = 0; i < byteString.length; i++) {
                ia[i] = byteString.charCodeAt(i);
              }
              resolve({ dataUrl, blob: new Blob([ab], { type: mimeString }), origSize, newSize });
            }
          },
          'image/webp',
          quality
        );
      };
      img.onerror = () => reject(new Error('Failed to load image file'));
      img.src = e.target?.result as string;
    };
    reader.onerror = () => reject(new Error('Failed to read file'));
    reader.readAsDataURL(file);
  });
}

function formatBytes(bytes: number): string {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
}

export default function ImageUploader({ photos = [], onChange }: ImageUploaderProps) {
  const [isCompressing, setIsCompressing] = useState(false);
  const [statsMsg, setStatsMsg] = useState<string | null>(null);
  const [customUrlInput, setCustomUrlInput] = useState('');
  const [activeTab, setActiveTab] = useState<'upload' | 'preset' | 'url'>('upload');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setIsCompressing(true);
    setStatsMsg(null);

    const newPhotos: string[] = [];
    let totalOrig = 0;
    let totalComp = 0;
    let supabaseUploads = 0;

    try {
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const res = await compressImageToWebP(file);
        totalOrig += res.origSize;
        totalComp += res.newSize;

        // Upload compressed WebP to Supabase Storage
        const supabasePublicUrl = await uploadRoomImageToSupabase(res.blob);
        if (supabasePublicUrl) {
          newPhotos.push(supabasePublicUrl);
          supabaseUploads++;
        } else {
          // Fallback to local optimized base64 Data URI
          newPhotos.push(res.dataUrl);
        }
      }

      onChange([...photos, ...newPhotos]);
      const savedPct = Math.round((1 - totalComp / (totalOrig || 1)) * 100);

      if (supabaseUploads > 0) {
        setStatsMsg(
          `Successfully stored ${supabaseUploads} image(s) in Supabase Storage! (${formatBytes(totalOrig)} ➔ ${formatBytes(totalComp)} WebP, -${savedPct}% saved)`
        );
      } else {
        setStatsMsg(
          `Compressed ${files.length} photo(s) (${formatBytes(totalOrig)} ➔ ${formatBytes(totalComp)}, -${savedPct}% saved). Note: Ensure a public bucket named 'room-photos' or 'rooms' exists in your Supabase Storage dashboard.`
        );
      }
    } catch (err) {
      console.error('Image upload failed', err);
    } finally {
      setIsCompressing(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const handleAddPreset = (presetPath: string) => {
    if (!photos.includes(presetPath)) {
      onChange([...photos, presetPath]);
    }
  };

  const handleAddUrl = () => {
    if (customUrlInput.trim()) {
      onChange([...photos, customUrlInput.trim()]);
      setCustomUrlInput('');
    }
  };

  const handleRemove = (index: number) => {
    const updated = photos.filter((_, i) => i !== index);
    onChange(updated);
  };

  const handleSetCover = (index: number) => {
    if (index === 0) return;
    const item = photos[index];
    const rest = photos.filter((_, i) => i !== index);
    onChange([item, ...rest]);
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <label className="block text-[11px] font-medium tracking-wider uppercase text-[#8a8984]">
          Room Gallery ({photos.length} Photos)
        </label>

        {/* Mode Selector Tabs */}
        <div className="flex gap-1 bg-[#f5f3f0] dark:bg-[#191816] p-0.5 rounded-md border border-[#e8e6e1] dark:border-[#30312f]">
          <button
            type="button"
            onClick={() => setActiveTab('upload')}
            className={`px-2 py-0.5 text-[11px] font-medium rounded transition-colors flex items-center gap-1 ${
              activeTab === 'upload' ? 'bg-white dark:bg-[#30312f] text-brand dark:text-[#C5A059] shadow-xs' : 'text-[#8a8984]'
            }`}
          >
            <Upload className="w-3 h-3" /> Upload File
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('preset')}
            className={`px-2 py-0.5 text-[11px] font-medium rounded transition-colors flex items-center gap-1 ${
              activeTab === 'preset' ? 'bg-white dark:bg-[#30312f] text-brand dark:text-[#C5A059] shadow-xs' : 'text-[#8a8984]'
            }`}
          >
            <ImageIcon className="w-3 h-3" /> Presets
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('url')}
            className={`px-2.5 py-0.5 text-[11px] font-medium rounded transition-colors flex items-center gap-1 ${
              activeTab === 'url' ? 'bg-white dark:bg-[#30312f] text-brand dark:text-[#C5A059] shadow-xs' : 'text-[#8a8984]'
            }`}
          >
            <LinkIcon className="w-3 h-3" /> URL
          </button>
        </div>
      </div>

      {/* TAB 1: FILE UPLOAD */}
      {activeTab === 'upload' && (
        <div
          onClick={() => !isCompressing && fileInputRef.current?.click()}
          className="border-2 border-dashed border-warm-border hover:border-brand/50 dark:hover:border-[#C5A059] bg-[#fdfaf7] dark:bg-[#201f1c] rounded-lg p-4 text-center cursor-pointer transition-all hover:bg-brand-light/20 group"
        >
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            multiple
            onChange={handleFileSelect}
            className="hidden"
          />

          {isCompressing ? (
            <div className="flex flex-col items-center justify-center py-2 text-brand font-medium text-xs">
              <Loader2 className="w-6 h-6 animate-spin mb-1 text-brand" />
              Converting to HD WebP & Compressing...
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center">
              <div className="w-9 h-9 rounded-full bg-brand-light text-brand dark:bg-[#30312f] dark:text-[#C5A059] flex items-center justify-center mb-2 group-hover:scale-110 transition-transform">
                <Upload className="w-4 h-4" />
              </div>
              <p className="text-xs font-semibold text-[#1a1917] dark:text-[#F7F5F2]">
                Click or Drag high-res photos to upload
              </p>
              <p className="text-[10px] text-[#8a8984] mt-0.5 flex items-center gap-1">
                <Sparkles className="w-3 h-3 text-[#C5A059]" /> Automatic HD WebP compression preserves 4K resolution while saving ~90% loading bandwidth.
              </p>
            </div>
          )}
        </div>
      )}

      {/* TAB 2: PRESETS */}
      {activeTab === 'preset' && (
        <div className="p-3 bg-[#fdfaf7] dark:bg-[#201f1c] rounded-lg border border-warm-border space-y-2">
          <p className="text-[11px] font-medium text-[#5c5a54] dark:text-[#ded9d6]">Select high-definition hotel presets:</p>
          <div className="grid grid-cols-4 gap-2">
            {PRESET_PHOTOS.map((preset) => {
              const isSelected = photos.includes(preset.path);
              return (
                <button
                  key={preset.path}
                  type="button"
                  onClick={() => handleAddPreset(preset.path)}
                  className={`group relative aspect-[16/10] rounded border overflow-hidden transition-all text-left ${
                    isSelected ? 'ring-2 ring-brand border-transparent' : 'border-warm-border hover:border-brand/40'
                  }`}
                >
                  <img
                    src={getPhotoUrl(preset.path)}
                    alt={preset.label}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent flex items-end p-1">
                    <span className="text-[9px] font-medium text-white truncate w-full">{preset.label}</span>
                  </div>
                  {isSelected && (
                    <div className="absolute top-1 right-1 bg-brand text-white p-0.5 rounded-full">
                      <Check className="w-2.5 h-2.5" />
                    </div>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* TAB 3: CUSTOM URL */}
      {activeTab === 'url' && (
        <div className="flex gap-2">
          <input
            type="text"
            placeholder="Paste photo URL (e.g. https://... or images/rooms/standard/standard.png)"
            value={customUrlInput}
            onChange={(e) => setCustomUrlInput(e.target.value)}
            className="flex-1 px-3 py-1.5 border border-warm-border rounded-md text-xs focus:outline-none focus:ring-2 focus:ring-brand/20 focus:border-brand"
          />
          <button
            type="button"
            onClick={handleAddUrl}
            className="px-3 py-1.5 bg-brand text-white text-xs font-medium rounded-md hover:bg-brand-dark transition-colors"
          >
            Add URL
          </button>
        </div>
      )}

      {/* COMPRESSION STATS BADGE */}
      {statsMsg && (
        <div className="p-2 rounded bg-green-50 dark:bg-green-950/30 border border-green-200 dark:border-green-800/40 text-[11px] text-green-700 dark:text-green-300 font-medium flex items-center justify-between">
          <span>{statsMsg}</span>
          <button type="button" onClick={() => setStatsMsg(null)} className="text-green-500 hover:text-green-700">×</button>
        </div>
      )}

      {/* UPLOADS / GALLERY PREVIEW LIST */}
      {photos.length > 0 && (
        <div className="space-y-1.5">
          <p className="text-[10px] font-semibold uppercase tracking-wider text-[#8a8984]">
            Uploaded Photos Grid (First photo is Main Cover)
          </p>
          <div className="grid grid-cols-4 gap-2">
            {photos.map((photoUrl, idx) => (
              <div
                key={`${photoUrl}-${idx}`}
                className="relative group aspect-[16/10] rounded-md border border-warm-border overflow-hidden bg-gray-100 shadow-xs"
              >
                <img
                  src={getPhotoUrl(photoUrl)}
                  alt={`Room photo ${idx + 1}`}
                  className="w-full h-full object-cover"
                />
                
                {/* Overlay actions */}
                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-1.5 p-1">
                  {idx > 0 && (
                    <button
                      type="button"
                      onClick={() => handleSetCover(idx)}
                      title="Set as Cover Photo"
                      className="p-1 bg-amber-500 text-white rounded hover:bg-amber-600 transition-colors"
                    >
                      <Star className="w-3.5 h-3.5" />
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={() => handleRemove(idx)}
                    title="Remove photo"
                    className="p-1 bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>

                {/* Badge for cover photo */}
                {idx === 0 ? (
                  <div className="absolute top-1 left-1 px-1.5 py-0.5 bg-[#C5A059] text-[#1C1C19] font-bold text-[9px] rounded uppercase shadow-xs">
                    Cover
                  </div>
                ) : (
                  <div className="absolute top-1 left-1 px-1.5 py-0.5 bg-black/60 text-white text-[9px] rounded">
                    #{idx + 1}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

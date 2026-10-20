'use client';

import React, { useRef, useState } from 'react';
import { UploadCloud, Image as ImageIcon, RotateCcw, Check, Sparkles } from 'lucide-react';

interface ImagePreset {
  name: string;
  path: string;
}

interface ImageUploadFieldProps {
  label: string;
  helperText?: string;
  value: string;
  onChange: (newValue: string) => void;
  aspectRatio?: 'square' | 'video' | 'portrait' | 'avatar' | 'banner';
  presets?: ImagePreset[];
  className?: string;
}

export default function ImageUploadField({
  label,
  helperText,
  value,
  onChange,
  aspectRatio = 'square',
  presets,
  className = '',
}: ImageUploadFieldProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [fileName, setFileName] = useState<string | null>(null);

  // Compact, non-overflowing thumbnail dimensions
  const aspectClassMap = {
    square: 'w-16 h-16 sm:w-20 sm:h-20 aspect-square rounded-xl',
    avatar: 'w-14 h-14 sm:w-16 sm:h-16 aspect-square rounded-full',
    video: 'w-24 sm:w-28 aspect-video rounded-xl',
    portrait: 'w-16 sm:w-20 aspect-[3/4] rounded-xl',
    banner: 'w-24 sm:w-28 aspect-[16/9] rounded-xl',
  };

  const handleFile = (file: File) => {
    if (!file.type.startsWith('image/')) {
      alert('Pilih file gambar (JPG, PNG, WEBP).');
      return;
    }

    setFileName(file.name);
    const reader = new FileReader();
    reader.onload = (e) => {
      if (typeof e.target?.result === 'string') {
        onChange(e.target.result);
      }
    };
    reader.readAsDataURL(file);
  };

  const onFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleFile(file);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) handleFile(file);
  };

  const isBase64 = value?.startsWith('data:');

  return (
    <div className={`w-full max-w-full space-y-2 overflow-hidden ${className}`}>
      {/* Field Label */}
      <div className="flex items-center justify-between gap-2 min-w-0">
        <label className="block text-xs font-semibold text-slate-700 tracking-tight truncate">
          {label}
        </label>
        {isBase64 && (
          <span className="text-[10px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200 shrink-0">
            Foto Baru (Upload)
          </span>
        )}
      </div>

      {/* Hidden File Input */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={onFileInputChange}
        accept="image/png,image/jpeg,image/webp,image/jpg"
        className="hidden"
      />

      {/* Upload & Preview Container */}
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={`p-3 sm:p-3.5 rounded-2xl border transition-all w-full max-w-full overflow-hidden ${
          isDragging
            ? 'border-[#0D5966] bg-[#0D5966]/10 ring-2 ring-[#0D5966]/20'
            : 'border-slate-200/90 bg-slate-50/70 hover:bg-slate-50'
        }`}
      >
        <div className="flex items-center gap-3 sm:gap-4 w-full min-w-0">
          {/* Thumbnail Preview */}
          <div
            className={`relative shrink-0 overflow-hidden bg-slate-200 border border-slate-200/80 shadow-2xs ${aspectClassMap[aspectRatio]}`}
          >
            {value ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={value}
                alt={label}
                className="w-full h-full object-cover object-top"
              />
            ) : (
              <div className="w-full h-full flex flex-col items-center justify-center text-slate-400 p-1.5 text-center">
                <ImageIcon className="w-5 h-5 stroke-[1.5]" />
                <span className="text-[9px] mt-0.5 font-medium leading-none">Kosong</span>
              </div>
            )}
          </div>

          {/* Action Buttons & Drop Instructions */}
          <div className="flex-1 min-w-0 space-y-1.5 overflow-hidden">
            <div>
              <p
                className="text-xs font-semibold text-slate-800 truncate"
                title={fileName || 'Upload file gambar langsung dari PC'}
              >
                {fileName ? fileName : 'Upload file gambar dari PC'}
              </p>
              <p className="text-[11px] text-slate-400 mt-0.5 line-clamp-2 leading-relaxed break-words">
                {helperText || 'Format: JPG, PNG, WEBP (maks. 5MB). Drag & drop ke sini.'}
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-2 pt-0.5">
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#0D5966] text-white text-xs font-semibold hover:bg-[#094550] transition-colors cursor-pointer shadow-xs shrink-0"
              >
                <UploadCloud className="w-3.5 h-3.5" />
                <span>{value ? 'Ganti Foto' : 'Upload Foto'}</span>
              </button>

              {value && (
                <button
                  type="button"
                  onClick={() => {
                    onChange('');
                    setFileName(null);
                  }}
                  className="px-2.5 py-1.5 rounded-xl text-xs font-medium text-slate-500 hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer shrink-0"
                >
                  Hapus
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Optional Presets Grid */}
        {presets && presets.length > 0 && (
          <div className="mt-3 pt-3 border-t border-slate-200/80 w-full min-w-0">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-2">
              Pilihan Foto Dokter Tersedia:
            </span>
            <div className="grid grid-cols-4 gap-2 w-full">
              {presets.map((preset) => {
                const isSelected = value === preset.path;
                return (
                  <button
                    key={preset.path}
                    type="button"
                    onClick={() => {
                      onChange(preset.path);
                      setFileName(null);
                    }}
                    className={`p-1.5 rounded-xl border text-center transition-all cursor-pointer min-w-0 overflow-hidden ${
                      isSelected
                        ? 'border-[#0D5966] bg-[#0D5966]/10 ring-2 ring-[#0D5966]/20'
                        : 'border-slate-200 hover:border-slate-300 bg-white'
                    }`}
                  >
                    <div className="relative aspect-square w-full rounded-lg overflow-hidden bg-slate-100 mb-1">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={preset.path}
                        alt={preset.name}
                        className="w-full h-full object-cover object-top"
                      />
                      {isSelected && (
                        <div className="absolute top-0.5 right-0.5 w-3.5 h-3.5 rounded-full bg-[#0D5966] text-white flex items-center justify-center">
                          <Check className="w-2.5 h-2.5 stroke-[3]" />
                        </div>
                      )}
                    </div>
                    <span
                      className="text-[10px] font-semibold text-slate-800 block truncate px-0.5"
                      title={preset.name}
                    >
                      {preset.name}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

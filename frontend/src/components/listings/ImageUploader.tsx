import React, { useEffect, useMemo, useRef, useState } from 'react'
import { ImagePlus, X } from 'lucide-react'
import type { ItemImage } from '@/types'

const MAX_BYTES = 6 * 1024 * 1024
const TYPES = ['image/jpeg', 'image/png', 'image/webp']

interface ImageUploaderProps {
    files: File[]
    onFilesChange: (files: File[]) => void
    existing?: ItemImage[]
    onRemoveExisting?: (image: ItemImage) => void
    max?: number
    error?: string
}

export const ImageUploader: React.FC<ImageUploaderProps> = ({
    files,
    onFilesChange,
    existing = [],
    onRemoveExisting,
    max = 8,
    error,
}) => {
    const input = useRef<HTMLInputElement>(null)
    const [problem, setProblem] = useState('')

    const previews = useMemo(() => files.map((f) => ({ file: f, url: URL.createObjectURL(f) })), [files])
    useEffect(() => () => previews.forEach((p) => URL.revokeObjectURL(p.url)), [previews])

    const room = max - existing.length - files.length

    const add = (list: FileList | null) => {
        if (!list) return
        setProblem('')
        const accepted: File[] = []
        for (const f of Array.from(list)) {
            if (!TYPES.includes(f.type)) {
                setProblem('Only JPG, PNG or WebP photos are allowed.')
                continue
            }
            if (f.size > MAX_BYTES) {
                setProblem(`"${f.name}" is larger than 6 MB.`)
                continue
            }
            accepted.push(f)
        }
        if (accepted.length > room) setProblem(`You can add up to ${max} photos in total.`)
        onFilesChange([...files, ...accepted.slice(0, Math.max(0, room))])
        if (input.current) input.current.value = ''
    }

    const shown = problem || error

    return (
        <div>
            <p className="mb-2 text-sm font-medium text-slate-200">
                Photos <span className="font-normal text-slate-400">(up to {max}, the first one is the cover)</span>
            </p>

            <ul className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                {existing.map((img) => (
                    <li key={img.id} className="relative aspect-square overflow-hidden rounded-2xl ring-1 ring-white/10">
                        <img src={img.url} alt="" className="size-full object-cover" />
                        {onRemoveExisting && (
                            <button
                                type="button"
                                onClick={() => onRemoveExisting(img)}
                                aria-label="Remove photo"
                                className="absolute right-2 top-2 cursor-pointer text-white drop-shadow-[0_1px_3px_rgba(0,0,0,0.9)]"
                            >
                                <X className="size-6" aria-hidden />
                            </button>
                        )}
                    </li>
                ))}
                {previews.map((p, i) => (
                    <li key={p.url} className="relative aspect-square overflow-hidden rounded-2xl ring-1 ring-white/10">
                        <img src={p.url} alt="" className="size-full object-cover" />
                        <button
                            type="button"
                            onClick={() => onFilesChange(files.filter((_, idx) => idx !== i))}
                            aria-label={`Remove ${p.file.name}`}
                            className="absolute right-2 top-2 cursor-pointer text-white drop-shadow-[0_1px_3px_rgba(0,0,0,0.9)]"
                        >
                            <X className="size-6" aria-hidden />
                        </button>
                    </li>
                ))}
                {room > 0 && (
                    <li>
                        <button
                            type="button"
                            onClick={() => input.current?.click()}
                            className="flex aspect-square w-full cursor-pointer flex-col items-center justify-center gap-2 rounded-2xl border border-dashed border-white/30 text-sm text-slate-300 transition-colors hover:border-white hover:text-white"
                        >
                            <ImagePlus className="size-7" aria-hidden />
                            Add photos
                        </button>
                    </li>
                )}
            </ul>

            <input
                ref={input}
                type="file"
                accept={TYPES.join(',')}
                multiple
                className="sr-only"
                aria-label="Choose photos"
                onChange={(e) => add(e.target.files)}
            />

            {shown && (
                <p role="alert" className="mt-2 text-sm text-[#f0827a]">
                    {shown}
                </p>
            )}
        </div>
    )
}

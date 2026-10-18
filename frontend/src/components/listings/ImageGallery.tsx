import React, { useState } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import type { ItemImage } from '@/types'

export const ImageGallery: React.FC<{ images?: ItemImage[]; title: string }> = ({ images = [], title }) => {
    const [index, setIndex] = useState(0)

    if (images.length === 0) {
        return (
            <div className="grid aspect-[4/3] w-full place-items-center rounded-3xl bg-panel-2 text-slate-400 ring-1 ring-white/10">
                No photos yet
            </div>
        )
    }

    const current = images[Math.min(index, images.length - 1)]
    const go = (step: number) => setIndex((i) => (i + step + images.length) % images.length)

    return (
        <div>
            <div className="relative aspect-[4/3] overflow-hidden rounded-3xl bg-panel-2 ring-1 ring-white/10">
                <img src={current.url} alt={`${title}, photo ${index + 1} of ${images.length}`} className="size-full object-cover" />
                {images.length > 1 && (
                    <>
                        <button
                            type="button"
                            onClick={() => go(-1)}
                            aria-label="Previous photo"
                            className="absolute left-3 top-1/2 -translate-y-1/2 cursor-pointer p-2 text-white drop-shadow-[0_1px_4px_rgba(0,0,0,0.8)]"
                        >
                            <ChevronLeft className="size-9" aria-hidden />
                        </button>
                        <button
                            type="button"
                            onClick={() => go(1)}
                            aria-label="Next photo"
                            className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer p-2 text-white drop-shadow-[0_1px_4px_rgba(0,0,0,0.8)]"
                        >
                            <ChevronRight className="size-9" aria-hidden />
                        </button>
                        <span className="absolute bottom-3 right-3 rounded-full bg-black/65 px-3 py-1 text-xs font-semibold tabular-nums text-white">
                            {index + 1} / {images.length}
                        </span>
                    </>
                )}
            </div>

            {images.length > 1 && (
                <ul className="mt-3 flex gap-3 overflow-x-auto pb-1">
                    {images.map((img, i) => (
                        <li key={img.id}>
                            <button
                                type="button"
                                onClick={() => setIndex(i)}
                                aria-label={`Show photo ${i + 1}`}
                                aria-current={i === index}
                                className={`block size-20 cursor-pointer overflow-hidden rounded-xl ring-2 transition-all ${
                                    i === index ? 'ring-white' : 'opacity-70 ring-transparent hover:opacity-100'
                                }`}
                            >
                                <img src={img.url} alt="" loading="lazy" className="size-full object-cover" />
                            </button>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    )
}

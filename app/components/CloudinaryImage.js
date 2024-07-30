'use client';

import { CldImage } from 'next-cloudinary'

export default function CloudinaryImage({ publicId, alt }) {
  return (
    <CldImage
      width="400"
      height="300"
      src={publicId}
      sizes="100vw"
      alt={alt}
    />
  )
}
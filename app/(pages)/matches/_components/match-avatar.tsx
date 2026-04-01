"use client";

import React, { useState } from "react";
import Image from "next/image";

interface MatchAvatarProps {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  className?: string;
}

export const MatchAvatar: React.FC<MatchAvatarProps> = ({
  src,
  alt,
  width = 56,
  height = 56,
  className = "",
}) => {
  const [imgSrc, setImgSrc] = useState(src);
  const [hasError, setHasError] = useState(false);

  const showPlaceholder = !imgSrc || hasError;

  const handleError = () => {
    if (!hasError) setHasError(true);
  };

  if (showPlaceholder) {
    const initial = alt?.[0]?.toUpperCase() || "?";
    return (
      <div
        className={`flex items-center justify-center rounded-full bg-soft-rose text-maroon/70 ${className}`}
        style={{ width, height }}
      >
        <span className="text-xl font-semibold">{initial}</span>
      </div>
    );
  }

  return (
    <Image
      src={imgSrc}
      alt={alt}
      width={width}
      height={height}
      className={className}
      unoptimized
      onError={handleError}
    />
  );
};

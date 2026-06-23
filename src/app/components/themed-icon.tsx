interface ThemedIconProps {
  lightSrc: string;
  darkSrc: string;
  alt?: string;
  className?: string;
}

export function ThemedIcon({ lightSrc, darkSrc, alt = "", className = "w-5 h-5" }: ThemedIconProps) {
  return (
    <>
      <img src={lightSrc} alt={alt} className={`${className} dark:hidden`} />
      <img src={darkSrc} alt={alt} className={`${className} hidden dark:block`} />
    </>
  );
}

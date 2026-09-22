import Image from "next/image";

export function BrandMark() {
  return (
    <>
      <Image
        src="/logo.png"
        alt="promobazar.cz logo"
        width={36}
        height={36}
        className="w-9 h-9 rounded-lg object-contain"
        priority
      />
      <span className="font-display text-lg font-bold tracking-tight uppercase">
        promobazar.cz
      </span>
    </>
  );
}

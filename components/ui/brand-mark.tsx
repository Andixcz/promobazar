import Image from "next/image";

export function BrandMark() {
  return (
    <span className="inline-flex h-9 items-center gap-2.5">
      <Image
        src="/logo.svg"
        alt="promobazar.cz logo"
        width={7}
        height={10}
        className="h-full w-auto shrink-0"
        priority
      />
      <span className="relative -top-0.5 font-display text-lg font-bold leading-none tracking-tight uppercase">
        promobazar.cz
      </span>
    </span>
  );
}

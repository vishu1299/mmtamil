import type { ReactNode } from "react";

type MarketingPageShellProps = {
  title: string;
  intro?: string;
  children: ReactNode;
};

export function MarketingPageShell({ title, intro, children }: MarketingPageShellProps) {
  return (
    <div className="border-t border-border-soft bg-gradient-to-b from-white to-cream/30">
      <div className="mx-auto w-[90%] max-w-[960px] px-4 py-14 lg:py-20">
        <header className="mb-10">
          <h1 className="font-playfair text-3xl font-semibold text-maroon sm:text-4xl">{title}</h1>
          {intro ? (
            <p className="mt-4 text-base leading-relaxed text-[#6B6B6B] sm:text-lg">{intro}</p>
          ) : null}
        </header>
        <div className="space-y-5 text-[15px] leading-relaxed text-[#2C2C2C] sm:text-base">{children}</div>
      </div>
    </div>
  );
}

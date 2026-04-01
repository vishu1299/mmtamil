"use client";

/** South Indian style: 12 houses on the perimeter; centre label “கிரக நிலை”. */
export function HoroscopeChartGrid({
  cells,
  title,
}: {
  cells: string[] | undefined;
  title: string;
}) {
  const arr = Array.from({ length: 12 }, (_, i) => {
    const v = cells?.[i];
    return typeof v === "string" ? v.trim() : "";
  });
  const cell = (idx: number) => arr[idx] || "—";

  return (
    <div className="w-full">
      <p className="mb-2 text-center text-xs font-medium text-[#2C2C2C]">{title}</p>
      <div
        className="mx-auto grid aspect-square w-full max-w-[min(100%,20rem)] gap-1.5 rounded-xl border border-border-soft bg-white p-2 shadow-soft transition-shadow duration-300 hover:shadow-md sm:max-w-[280px]"
        style={{
          gridTemplateColumns: "repeat(4, 1fr)",
          gridTemplateRows: "repeat(4, 1fr)",
          gridTemplateAreas: `
            "a b c d"
            "e center center f"
            "g center center h"
            "i j k l"
          `,
        }}
      >
        {(
          [
            ["a", 0],
            ["b", 1],
            ["c", 2],
            ["d", 3],
            ["e", 11],
            ["f", 4],
            ["g", 10],
            ["h", 5],
            ["i", 9],
            ["j", 8],
            ["k", 7],
            ["l", 6],
          ] as const
        ).map(([area, idx]) => (
          <div
            key={area}
            style={{ gridArea: area }}
            className="flex min-h-0 items-center justify-center rounded-lg border border-border-soft bg-cream/50 px-0.5 py-1 text-center text-[10px] font-medium leading-tight text-[#2C2C2C] transition-colors duration-200 hover:border-maroon/20 hover:bg-soft-rose/30 sm:text-xs"
          >
            {cell(idx)}
          </div>
        ))}
        <div
          style={{ gridArea: "center" }}
          className="flex items-center justify-center rounded-lg border border-border-soft bg-cream/80 px-1 shadow-inner"
        >
          <span className="text-center text-[11px] font-medium leading-snug text-[#6B6B6B] sm:text-sm">
            கிரக நிலை
          </span>
        </div>
      </div>
    </div>
  );
}

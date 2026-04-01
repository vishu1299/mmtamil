"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { IoChevronBack } from "react-icons/io5";
import { FiDownload, FiEdit2, FiUpload } from "react-icons/fi";
import { toast } from "react-toastify";

import { getuserByid } from "../../profile/api/api";
import {
  createHoroscope,
  getHoroscopeByUserId,
  updateHoroscope,
  uploadHoroscopeImage,
} from "@/app/api/api";

type HoroscopeApiShape = {
  id?: number;
  rasiChart?: string[];
  navamsaChart?: string[];
  image?: string;
};

const totalHouses = 24;
const CHART_CELL_AREAS = [
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
] as const;

const PLANET_DEFS = [
  { code: "சூரி", label: "சூரியன்" },
  { code: "சந்", label: "சந்திரன்" },
  { code: "செவ்", label: "செவ்வாய்" },
  { code: "புதன்", label: "புதன்" },
  { code: "குரு", label: "குரு" },
  { code: "சுக்", label: "சுக்கிரன்" },
  { code: "சனி", label: "சனி" },
  { code: "ராகு", label: "ராகு" },
  { code: "கேது", label: "கேது" },
  { code: "லக்", label: "லக்னம்" },
] as const;

function normalizeHoroscopeResponse(res: any): HoroscopeApiShape | null {
  const root = res?.data?.data ?? res?.data ?? res;
  if (!root) return null;
  // many APIs wrap inside data.data
  const data = root?.data ?? root;
  return {
    id: typeof data?.id === "number" ? data.id : undefined,
    rasiChart: Array.isArray(data?.rasiChart) ? data.rasiChart : undefined,
    navamsaChart: Array.isArray(data?.navamsaChart) ? data.navamsaChart : undefined,
    image: typeof data?.image === "string" ? data.image : undefined,
  };
}

const CENTER_LABEL_RASI = "கிரக நிலை";
const CENTER_LABEL_NAVAMSA = "நவாம்ச நிலை";

function buildChartGrid(cells?: string[], centerLabel: string = CENTER_LABEL_RASI) {
  const arr = Array.from({ length: 12 }, (_, i) => {
    const v = cells?.[i];
    return typeof v === "string" ? v.trim() : "";
  });
  const cell = (idx: number) => arr[idx] || "";

  return (
    <div
      className="grid gap-0 rounded-lg border border-[#EADDDD] bg-white overflow-hidden"
      style={{
        gridTemplateColumns: "repeat(4, minmax(0, 1fr))",
        gridTemplateRows: "repeat(4, minmax(66px, auto))",
        gridTemplateAreas: `
          "a b c d"
          "e center center f"
          "g center center h"
          "i j k l"
        `,
      }}
    >
      {CHART_CELL_AREAS.map(([area, house]) => (
        <div
          key={`cell-${area}`}
          style={{ gridArea: area }}
          className="min-h-[66px] border border-[#EADDDD] p-1.5"
        >
          <div className="flex flex-wrap gap-1">
            {cell(house)
              ? cell(house)
                  .split(",")
                  .map((s) => s.trim())
                  .filter(Boolean)
                  .map((code) => (
                    <span
                      key={code}
                      className="inline-flex items-center rounded-md bg-[#8D1B3D]/10 px-1.5 py-0.5 text-[10px] font-medium text-[#8D1B3D]"
                    >
                      {code}
                    </span>
                  ))
              : null}
          </div>
        </div>
      ))}
      <div
        style={{ gridArea: "center" }}
        className="min-h-[132px] border border-[#EADDDD] bg-[#F6F1F1] flex items-center justify-center"
      >
        <span className="text-sm text-[#6B6B6B] font-medium">{centerLabel}</span>
      </div>
    </div>
  );
}

function getChartRangeFromCellIndex(cellIndex: number): [number, number] {
  return cellIndex < 12 ? [0, 11] : [12, 23];
}

export default function SettingsHoroscopePage() {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [userId, setUserId] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [downloading, setDownloading] = useState(false);
  const [showEdit, setShowEdit] = useState(false);
  const [activeCell, setActiveCell] = useState<number | null>(null);
  const [modalError, setModalError] = useState("");

  const [horoscopeId, setHoroscopeId] = useState<number | null>(null);
  const [rasiChart, setRasiChart] = useState<string[]>(Array(12).fill(""));
  const [navamsaChart, setNavamsaChart] = useState<string[]>(Array(12).fill(""));
  const [image, setImage] = useState<string | null>(null);

  const [editData, setEditData] = useState<Record<number, string[]>>(() => {
    const init: Record<number, string[]> = {};
    for (let i = 0; i < totalHouses; i++) init[i] = [];
    return init;
  });

  const imageSrc = useMemo(() => {
    if (!image) return null;
    if (image.startsWith("http")) return image;
    return `${process.env.NEXT_PUBLIC_IMAGE_URL ?? ""}${image.split("uploads")[1]}`;
  }, [image]);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      setLoading(true);
      try {
        const me = await getuserByid();
        const meRoot = me?.data?.data ?? me?.data;
        const uid = typeof meRoot?.id === "number" ? meRoot.id : Number(meRoot?.id);
        if (!uid || Number.isNaN(uid)) throw new Error("User id missing");
        if (cancelled) return;
        setUserId(uid);

        const horoRes = await getHoroscopeByUserId(uid);
        const horo = normalizeHoroscopeResponse(horoRes);
        if (!cancelled && horo) {
          setHoroscopeId(horo.id ?? uid);
          setRasiChart(Array.isArray(horo.rasiChart) ? horo.rasiChart : Array(12).fill(""));
          setNavamsaChart(Array.isArray(horo.navamsaChart) ? horo.navamsaChart : Array(12).fill(""));
          setImage(horo.image ?? null);

          const next: Record<number, string[]> = {};
          for (let i = 0; i < totalHouses; i++) next[i] = [];
          (horo.rasiChart ?? []).forEach((v, i) => {
            next[i] = typeof v === "string" && v.trim() ? v.split(",").map((s) => s.trim()).filter(Boolean) : [];
          });
          (horo.navamsaChart ?? []).forEach((v, i) => {
            next[12 + i] = typeof v === "string" && v.trim() ? v.split(",").map((s) => s.trim()).filter(Boolean) : [];
          });
          setEditData(next);
        }
      } catch (e) {
        if (!cancelled) toast.error("Failed to load horoscope");
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const togglePlanet = (cellIndex: number, code: string) => {
    setEditData((prev) => {
      const existing = prev[cellIndex] ?? [];
      const alreadySelected = existing.includes(code);
      const [start, end] = getChartRangeFromCellIndex(cellIndex);
      const chartStart = cellIndex < 12 ? 0 : 12;
      const chartEnd = chartStart + 12;
      if (!alreadySelected) {
        const usedElsewhere = Array.from({ length: totalHouses }, (_, idx) => idx).some(
          (idx) => idx !== cellIndex && (prev[idx] ?? []).includes(code)
        );
        if (usedElsewhere) {
          setModalError(`"${code}" இந்த chart-இல் ஏற்கனவே தேர்வு செய்யப்பட்டுள்ளது`);
          return prev;
        }
      }
      setModalError("");
      return {
        ...prev,
        [cellIndex]: alreadySelected ? existing.filter((x) => x !== code) : [...existing, code],
      };
    });
  };

  const removePlanet = (cellIndex: number, code: string) => {
    setEditData((prev) => ({
      ...prev,
      [cellIndex]: (prev[cellIndex] ?? []).filter((x) => x !== code),
    }));
    setModalError("");
  };

  const saveHoroscope = async () => {
    if (!userId) return;

    const housesWithData = Array.from({ length: totalHouses }, (_, i) => editData[i] ?? []).filter(
      (items) => items.length > 0
    );
    const hasLagna = housesWithData.some((items) => items.includes("லக்"));
    if (housesWithData.length === 0) {
      setModalError("குறைந்தது ஒரு கிரகத்தை தேர்வு செய்யவும்");
      return;
    }
    if (!hasLagna) {
      setModalError("லக் (Lagna) சேர்க்கவும்");
      return;
    }

    const rasi = Array.from({ length: 12 }, (_, i) => Array.from(new Set(editData[i] ?? [])).join(", "));
    const nav = Array.from({ length: 12 }, (_, i) => Array.from(new Set(editData[12 + i] ?? [])).join(", "));

    setSaving(true);
    try {
      // backend usually accepts userId on this endpoint; we pass horoscopeId if present otherwise userId
      const idForUpdate = horoscopeId ?? userId;
      try {
        await updateHoroscope(idForUpdate, { rasiChart: rasi, navamsaChart: nav });
      } catch {
        await createHoroscope(userId, { rasiChart: rasi, navamsaChart: nav });
      }
      setRasiChart(rasi);
      setNavamsaChart(nav);
      toast.success("Horoscope saved");
      setShowEdit(false);
      setActiveCell(null);
      setModalError("");
    } catch {
      toast.error("Failed to save horoscope");
    } finally {
      setSaving(false);
    }
  };

  const pickImage = () => fileInputRef.current?.click();

  const onImageSelected = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file || !userId) return;
    setUploadingImage(true);
    try {
      await uploadHoroscopeImage(userId, file);
      toast.success("Horoscope image uploaded");
      // refresh
      const horoRes = await getHoroscopeByUserId(userId);
      const horo = normalizeHoroscopeResponse(horoRes);
      setImage(horo?.image ?? null);
    } catch {
      toast.error("Failed to upload horoscope image");
    } finally {
      setUploadingImage(false);
    }
  };

  const downloadHoroscope = async () => {
    if (downloading) return;
    setDownloading(true);
    try {
      const W = 1200;
      const P = 48;
      const chartSize = 520;
      const gap = 48;

      // Canvas height: title + 2 charts + image section
      const imageBoxH = 420;
      const headerH = 90;
      const canvas = document.createElement("canvas");
      canvas.width = W;
      canvas.height = headerH + chartSize * 2 + gap + imageBoxH + P * 2 + 140;
      const ctx = canvas.getContext("2d");
      if (!ctx) throw new Error("Canvas not supported");

      // background
      ctx.fillStyle = "#FFFFFF";
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // title
      ctx.fillStyle = "#7A1232"; // maroon-ish
      ctx.font = "700 42px Arial";
      ctx.fillText("Horoscope", P, 64);
      ctx.fillStyle = "#6B6B6B";
      ctx.font = "400 22px Arial";
      ctx.fillText("Rasi chart • Navamsa chart • Horoscope image", P, 98);

      const drawChart = (x: number, y: number, title: string, centerLabel: string, cells: string[]) => {
        // title
        ctx.fillStyle = "#2C2C2C";
        ctx.font = "700 24px Arial";
        ctx.fillText(title, x, y - 14);

        // outer border
        ctx.strokeStyle = "#EADDDD";
        ctx.lineWidth = 3;
        ctx.strokeRect(x, y, chartSize, chartSize);

        // 4x4 grid with center 2x2
        const cellW = chartSize / 4;
        const cellH = chartSize / 4;

        const areaToGrid = (area: (typeof CHART_CELL_AREAS)[number][0]) => {
          // gridTemplateAreas:
          // a b c d
          // e center center f
          // g center center h
          // i j k l
          const map: Record<string, [number, number]> = {
            a: [0, 0],
            b: [1, 0],
            c: [2, 0],
            d: [3, 0],
            e: [0, 1],
            f: [3, 1],
            g: [0, 2],
            h: [3, 2],
            i: [0, 3],
            j: [1, 3],
            k: [2, 3],
            l: [3, 3],
          };
          return map[area];
        };

        // draw cells
        ctx.lineWidth = 2;
        ctx.strokeStyle = "#EADDDD";
        ctx.fillStyle = "#FFFFFF";

        CHART_CELL_AREAS.forEach(([area, house]) => {
          const [gx, gy] = areaToGrid(area);
          const cx = x + gx * cellW;
          const cy = y + gy * cellH;
          ctx.fillStyle = "#FFFFFF";
          ctx.fillRect(cx, cy, cellW, cellH);
          ctx.strokeRect(cx, cy, cellW, cellH);

          const raw = (cells?.[house] ?? "").trim();
          if (!raw) return;
          const parts = raw
            .split(",")
            .map((s) => s.trim())
            .filter(Boolean);

          ctx.fillStyle = "#7A1232";
          ctx.font = "700 14px Arial";
          let tx = cx + 8;
          let ty = cy + 20;
          parts.slice(0, 8).forEach((p, idx) => {
            // wrap small
            ctx.fillText(p, tx, ty);
            if ((idx + 1) % 3 === 0) {
              ty += 18;
              tx = cx + 8;
            } else {
              tx += 44;
            }
          });
        });

        // center block
        const centerX = x + cellW;
        const centerY = y + cellH;
        const centerW = cellW * 2;
        const centerH = cellH * 2;
        ctx.fillStyle = "#F6F1F1";
        ctx.fillRect(centerX, centerY, centerW, centerH);
        ctx.strokeStyle = "#EADDDD";
        ctx.strokeRect(centerX, centerY, centerW, centerH);
        ctx.fillStyle = "#6B6B6B";
        ctx.font = "700 20px Arial";
        const textWidth = ctx.measureText(centerLabel).width;
        ctx.fillText(centerLabel, centerX + (centerW - textWidth) / 2, centerY + centerH / 2 + 8);
      };

      const chartX = P;
      let y = headerH + P;
      drawChart(chartX, y, "Rasi Chart", CENTER_LABEL_RASI, rasiChart);
      y += chartSize + gap;
      drawChart(chartX, y, "Navamsa Chart", CENTER_LABEL_NAVAMSA, navamsaChart);
      y += chartSize + gap;

      // image section title
      ctx.fillStyle = "#2C2C2C";
      ctx.font = "700 24px Arial";
      ctx.fillText("Horoscope Image", chartX, y - 14);

      // image box
      const imgX = chartX;
      const imgY = y;
      const imgW = chartSize;
      const imgH = imageBoxH;
      ctx.fillStyle = "#F3F4F6";
      ctx.fillRect(imgX, imgY, imgW, imgH);
      ctx.strokeStyle = "#EADDDD";
      ctx.lineWidth = 2;
      ctx.strokeRect(imgX, imgY, imgW, imgH);

      if (imageSrc) {
        // fetch as blob to avoid tainted canvas where possible
        const res = await fetch(imageSrc, { mode: "cors" });
        const blob = await res.blob();
        const bitmap = await createImageBitmap(blob);

        const scale = Math.min(imgW / bitmap.width, imgH / bitmap.height);
        const dw = bitmap.width * scale;
        const dh = bitmap.height * scale;
        const dx = imgX + (imgW - dw) / 2;
        const dy = imgY + (imgH - dh) / 2;
        ctx.drawImage(bitmap, dx, dy, dw, dh);
      } else {
        ctx.fillStyle = "#6B6B6B";
        ctx.font = "400 18px Arial";
        ctx.fillText("No image uploaded.", imgX + 18, imgY + 32);
      }

      // footer
      ctx.fillStyle = "#9CA3AF";
      ctx.font = "400 14px Arial";
      ctx.fillText(`Generated ${new Date().toLocaleString()}`, P, canvas.height - 28);

      const blob: Blob | null = await new Promise((resolve) =>
        canvas.toBlob(resolve, "image/png", 0.95)
      );
      if (!blob) throw new Error("Failed to generate file");

      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `horoscope-${userId ?? "me"}.png`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);
    } catch (e) {
      toast.error("Failed to download horoscope");
    } finally {
      setDownloading(false);
    }
  };

  return (
    <main className="flex-1 flex flex-col max-w-[1560px] min-h-screen w-full lg:w-[90%] mx-auto lg:py-6 bg-gradient-to-b from-cream/50 via-white to-soft-rose/20 rounded-2xl">
      <div className="flex items-center justify-between px-5 py-4 lg:hidden">
        <div className="flex items-center gap-3">
          <button onClick={() => router.push("/settings/edit-profile")} className="text-[#2C2C2C]">
            <IoChevronBack className="text-2xl" />
          </button>
          <h1 className="font-playfair text-xl font-semibold text-[#2C2C2C]">Horoscope</h1>
        </div>
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={downloadHoroscope}
            disabled={loading || downloading}
            className="text-maroon font-semibold disabled:opacity-60"
          >
            {downloading ? "Downloading…" : "Download"}
          </button>
          <button
            type="button"
            onClick={() => setShowEdit(true)}
            className="text-maroon font-semibold"
          >
            Edit
          </button>
        </div>
      </div>

      <div className="px-5 lg:px-0 pb-28 lg:pb-6">
        <div className="lg:bg-white lg:border lg:border-border-soft lg:rounded-2xl lg:p-8 shadow-card hover:shadow-card-hover transition-all duration-300">
          <div className="hidden lg:flex items-center justify-between mb-6">
            <div>
              <h1 className="font-playfair text-[28px] font-semibold text-maroon">Horoscope</h1>
              <p className="text-[#6B6B6B] text-sm mt-1">Rasi chart, Navamsa chart and Horoscope image.</p>
            </div>
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={downloadHoroscope}
                disabled={loading || downloading}
                className="inline-flex items-center gap-2 rounded-xl border border-maroon px-4 py-2 text-maroon font-semibold hover:bg-maroon hover:text-white disabled:opacity-60"
              >
                <FiDownload /> {downloading ? "Downloading…" : "Download"}
              </button>
              <button
                type="button"
                onClick={() => setShowEdit(true)}
                className="inline-flex items-center gap-2 rounded-xl bg-maroon px-4 py-2 text-white font-semibold hover:bg-maroon/90"
              >
                <FiEdit2 /> Edit
              </button>
            </div>
          </div>

          {loading ? (
            <div className="py-10 text-center text-[#6B6B6B]">Loading…</div>
          ) : (
            <div className="space-y-8">
              <section>
                <div className="rounded-2xl border border-border-soft bg-white p-5">
                  <p className="text-center text-sm font-semibold text-[#2C2C2C] mb-4">Rasi Chart</p>
                  {buildChartGrid(rasiChart)}
                </div>
              </section>

              <section>
                <div className="rounded-2xl border border-border-soft bg-white p-5">
                  <p className="text-center text-sm font-semibold text-[#2C2C2C] mb-4">Navamsa Chart</p>
                  {buildChartGrid(navamsaChart, CENTER_LABEL_NAVAMSA)}
                </div>
              </section>

              <section>
                <div className="rounded-2xl border border-border-soft bg-white p-5">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-semibold text-[#2C2C2C]">Horoscope Image</p>
                    <button
                      type="button"
                      onClick={pickImage}
                      disabled={uploadingImage}
                      className="inline-flex items-center gap-2 rounded-lg border border-maroon px-3 py-2 text-sm font-semibold text-maroon hover:bg-maroon hover:text-white disabled:opacity-60"
                    >
                      <FiUpload /> {uploadingImage ? "Uploading…" : "Upload"}
                    </button>
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={onImageSelected}
                    />
                  </div>
                  {imageSrc ? (
                    <div className="mt-4 relative w-full aspect-[4/3] rounded-xl overflow-hidden bg-[#F3F4F6]">
                      <Image src={imageSrc} alt="Horoscope" fill className="object-cover" unoptimized />
                    </div>
                  ) : (
                    <p className="mt-4 text-sm text-[#6B6B6B]">No image uploaded.</p>
                  )}
                </div>
              </section>
            </div>
          )}
        </div>
      </div>

      {showEdit ? (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center">
          <div className="absolute inset-0 bg-black/40" onClick={() => { setShowEdit(false); setActiveCell(null); }} />
          <div className="relative bg-white w-full max-w-md rounded-t-2xl sm:rounded-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between px-6 pt-4 pb-4 border-b border-[#8D1B3D]">
              <h3 className="font-sfpro text-xl font-semibold text-[#191919]">Edit Horoscope</h3>
              <button
                type="button"
                onClick={() => setShowEdit(false)}
                className="text-maroon font-semibold"
              >
                Close
              </button>
            </div>

            <p className="text-center text-sm font-medium text-[#191919] py-4">
              Tap a box and select planets. Add Lagna (லக்) once.
            </p>

            <div className="px-6 pb-4 space-y-4">
              {[
                { title: "Rasi Chart", start: 0 },
                { title: "Navamsa Chart", start: 12 },
              ].map((section) => (
                <div key={section.title}>
                  <p className="text-xs font-semibold text-[#6B6B6B] mb-2">{section.title}</p>
                  <div
                    className="grid gap-0 rounded-lg border border-[#EADDDD] bg-[#F7F3F3] overflow-visible"
                    style={{
                      gridTemplateColumns: "repeat(4, minmax(0, 1fr))",
                      gridTemplateRows: "repeat(4, minmax(66px, auto))",
                      gridTemplateAreas: `
                        "a b c d"
                        "e center center f"
                        "g center center h"
                        "i j k l"
                      `,
                    }}
                  >
                    {CHART_CELL_AREAS.map(([area, house]) => {
                      const cellIndex = section.start + house;
                      const selected = editData[cellIndex] ?? [];
                      const [chartStart, chartEnd] = getChartRangeFromCellIndex(cellIndex);
                      const usedInChart = new Set(
                        Array.from(
                          { length: chartEnd - chartStart + 1 },
                          (_, offset) => chartStart + offset
                        )
                          .filter((idx) => idx !== cellIndex)
                          .flatMap((idx) => editData[idx] ?? [])
                      );
                      const availablePlanets = PLANET_DEFS.filter(
                        (planet) => selected.includes(planet.code) || !usedInChart.has(planet.code)
                      );
                      return (
                        <div
                          key={`${section.title}-${cellIndex}`}
                          style={{ gridArea: area }}
                          className="relative min-h-[66px] border border-[#EADDDD]"
                        >
                          <button
                            type="button"
                            onClick={() => {
                              setActiveCell(cellIndex);
                              setModalError("");
                            }}
                            className={`h-full w-full p-1.5 text-left transition-colors ${
                              activeCell === cellIndex ? "bg-[#F8E8EC]" : "bg-white hover:bg-[#F9F5F5]"
                            }`}
                          >
                            <div className="flex flex-wrap gap-1">
                              {selected.length > 0 ? (
                                selected.map((code) => (
                                  <span
                                    key={code}
                                    className="inline-flex items-center gap-1 rounded-md bg-[#8D1B3D]/10 px-1.5 py-0.5 text-[10px] font-medium text-[#8D1B3D]"
                                  >
                                    {code}
                                    <span
                                      onClick={(ev) => {
                                        ev.preventDefault();
                                        ev.stopPropagation();
                                        removePlanet(cellIndex, code);
                                      }}
                                      className="cursor-pointer"
                                      role="button"
                                      aria-label="Remove"
                                    >
                                      ×
                                    </span>
                                  </span>
                                ))
                              ) : (
                                <span className="text-[10px] text-[#A59B9B]">+</span>
                              )}
                            </div>
                          </button>

                          {activeCell === cellIndex ? (
                            <div className="absolute left-0 top-[calc(100%+4px)] z-20 w-44 overflow-hidden rounded-lg border border-[#EADDDD] bg-white shadow-xl">
                              {availablePlanets.map((planet) => {
                                const checked = selected.includes(planet.code);
                                return (
                                  <button
                                    type="button"
                                    key={planet.code}
                                    onClick={() => togglePlanet(cellIndex, planet.code)}
                                    className="flex w-full items-center justify-between border-b border-[#F1EAEA] px-3 py-2 text-sm text-[#2C2C2C] last:border-b-0 hover:bg-[#F9F5F5]"
                                  >
                                    <span>{planet.label}</span>
                                    {checked ? <span className="text-[#8D1B3D]">✓</span> : null}
                                  </button>
                                );
                              })}
                            </div>
                          ) : null}
                        </div>
                      );
                    })}
                    <div
                      style={{ gridArea: "center" }}
                      className="min-h-[132px] border border-[#EADDDD] bg-[#F6F1F1]"
                    >
                      <div className="flex h-full w-full items-center justify-center text-sm text-[#6B6B6B]">
                        {section.start === 12 ? CENTER_LABEL_NAVAMSA : CENTER_LABEL_RASI}
                      </div>
                    </div>
                  </div>
                </div>
              ))}

              {modalError ? <p className="text-xs text-red-500">{modalError}</p> : null}
            </div>

            <div className="px-6 pb-6 pt-2">
              <button
                type="button"
                onClick={saveHoroscope}
                disabled={saving}
                className="w-full py-4 bg-[#8D1B3D] hover:bg-[#6B1530] text-white font-semibold text-base rounded-xl transition-all duration-200 active:scale-[0.98] disabled:opacity-60"
              >
                {saving ? "Saving…" : "Save"}
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </main>
  );
}


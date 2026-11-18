"use client";

import { useState } from "react";
import { loadSupports } from "@/services/supportsClientService";
import { matchesFilter } from "@/lib/supports";
import { HeartOutlineIcon, SendIcon } from "./NavIcons";
import { formatCurrency } from "@/utils/formatCurrency";

const FILTERS = [
  { id: "all", label: "Semua" },
  { id: "gift", label: "Gift" },
  { id: "message", label: "Ada pesan" },
];

const dateFormat = new Intl.DateTimeFormat("id-ID", { day: "numeric", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" });

/**
 * `items` / `nextCursor` are the first page of "Semua". Each filter keeps its own list and cursor, so
 * the filters ask the API instead of only searching what is already on screen.
 */
export default function SupportsView({ totalSupport, items, nextCursor = "" }) {
  const [filter, setFilter] = useState("all");
  const [lists, setLists] = useState(() => ({
    all: { items, nextCursor },
    // With nothing at all, every filter is empty too, so no request is needed.
    ...(items.length === 0 && !nextCursor ? { gift: { items: [], nextCursor: "" }, message: { items: [], nextCursor: "" } } : {}),
  }));
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const list = lists[filter];
  const visible = list ? list.items.filter(matchesFilter(filter)) : [];

  async function fetchPage(target, cursor) {
    setLoading(true);
    setError("");
    try {
      const page = await loadSupports({ filter: target, cursor });
      setLists((prev) => ({
        ...prev,
        [target]: { items: [...(cursor ? prev[target]?.items ?? [] : []), ...page.items], nextCursor: page.nextCursor },
      }));
    } catch {
      setError("Gagal memuat dukungan. Periksa koneksi lalu coba lagi.");
    } finally {
      setLoading(false);
    }
  }

  function selectFilter(next) {
    setFilter(next);
    setError("");
    if (!lists[next]) fetchPage(next, "");
  }

  return (
    <>
      <section className="mt-6 flex items-center justify-between gap-3 rounded-[1.25rem] bg-brand-soft/70 px-5 py-5 md:mt-8 md:border md:border-line/70 md:px-5">
        <div className="min-w-0">
          <p className="text-[0.9375rem] font-semibold text-muted md:font-normal">Total Support Masuk</p>
          <p className="mt-2 truncate text-[1.75rem] font-bold leading-none text-ink md:mt-4 md:text-[2rem]">{formatCurrency(totalSupport)}</p>
        </div>
        {/* TODO: connect to the payout (pencairan) flow when it exists. */}
        <button
          type="button"
          className="flex h-12 shrink-0 items-center gap-2.5 rounded-2xl bg-brand px-5 text-base font-semibold text-white shadow-[0_0.5rem_1.25rem_rgba(46,104,178,0.3)] transition-colors hover:bg-brand-dark md:h-10 md:rounded-xl md:px-5 md:text-sm md:shadow-none"
        >
          <SendIcon className="size-6 md:size-5" />
          Cairkan
        </button>
      </section>

      <section className="mt-5 md:rounded-[1.25rem] md:border md:border-line md:bg-white md:p-5">
        <div role="group" aria-label="Filter dukungan" className="flex flex-wrap gap-3 border-b border-line pb-5">
          {FILTERS.map((entry) => {
            const selected = entry.id === filter;
            return (
              <button
                key={entry.id}
                type="button"
                aria-pressed={selected}
                onClick={() => selectFilter(entry.id)}
                className={`h-9 rounded-full border px-5 text-[0.9375rem] font-medium transition-colors md:h-10 md:rounded-xl md:px-6 md:text-sm md:font-semibold ${
                  selected
                    ? "border-accent bg-accent text-white md:border-brand md:bg-brand"
                    : "border-line bg-white text-ink md:border-brand md:text-brand"
                }`}
              >
                {entry.label}
              </button>
            );
          })}
        </div>

        {!list ? (
          <p role="status" className="mt-5 min-h-[13rem] py-10 text-center text-[0.9375rem] text-muted">
            {error ? (
              <>
                {error}{" "}
                <button type="button" onClick={() => fetchPage(filter, "")} className="font-semibold text-accent">
                  Coba lagi
                </button>
              </>
            ) : (
              "Memuat dukungan..."
            )}
          </p>
        ) : visible.length === 0 ? (
          <div className="mt-5 flex min-h-[13rem] flex-col items-center justify-center rounded-[1.25rem] bg-[#F6FAFF] px-6 py-8 text-center md:min-h-[15rem] md:bg-transparent">
            <HeartOutlineIcon className="size-9 text-accent" />
            <h2 className="mt-3 text-lg font-semibold text-ink">Belum ada dukungan</h2>
            <p className="mt-1 max-w-[18rem] text-[0.9375rem] leading-relaxed text-muted md:max-w-none">
              Saat ada Gift masuk, nominal, waktu, dan pesannya tercatat di sini.
            </p>
          </div>
        ) : (
          <ul className="divide-y divide-line">
            {visible.map((item) => (
              <li key={item.id} className="py-4">
                <div className="flex items-center justify-between gap-3">
                  <p className="truncate text-sm font-semibold text-ink">{item.name}</p>
                  <p className="shrink-0 text-sm font-semibold text-brand">{formatCurrency(item.amount)}</p>
                </div>
                {item.createdAt && <p className="mt-0.5 text-xs text-muted">{dateFormat.format(new Date(item.createdAt))}</p>}
                {item.message && <p className="mt-2 text-sm text-ink">{item.message}</p>}
              </li>
            ))}
          </ul>
        )}

        {list?.nextCursor ? (
          <div className="mt-4 text-center">
            <button
              type="button"
              disabled={loading}
              onClick={() => fetchPage(filter, list.nextCursor)}
              className="h-10 rounded-xl border border-brand bg-white px-6 text-sm font-semibold text-brand transition-colors hover:bg-brand-soft disabled:opacity-60"
            >
              {loading ? "Memuat..." : "Muat lebih banyak"}
            </button>
            {error ? <p role="alert" className="mt-2 text-xs text-red-600">{error}</p> : null}
          </div>
        ) : null}

        <p className="mt-10 px-2 text-center text-[0.9375rem] leading-relaxed text-muted md:mt-6 md:text-sm">
          Info pendukung ditampilkan sesuai pilihan privasi mereka.
        </p>
      </section>
    </>
  );
}

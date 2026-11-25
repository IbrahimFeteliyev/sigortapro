"use client";

import { CircleAlert, CloudUpload, FileText, RefreshCw, ShieldCheck, Trash2 } from "lucide-react";
import { AnimatePresence, m } from "motion/react";
import { useTranslations } from "next-intl";
import { useEffect, useId, useRef, useState, type DragEvent } from "react";
import { documentUpload } from "@/data/form-options";
import { cn } from "@/lib/utils";

interface LocalFile {
  id: string;
  name: string;
  size: number;
  kind: "image" | "pdf";
  /** Object URL for image previews — lives only in this browser tab. */
  url: string | null;
}

const isAllowedType = (file: File) => {
  const extension = `.${file.name.split(".").pop()?.toLowerCase()}`;
  return (
    (documentUpload.accept as readonly string[]).includes(file.type) ||
    (documentUpload.extensions as readonly string[]).includes(extension)
  );
};

/**
 * Identity-document picker — LOCAL DEMONSTRATION ONLY.
 * Files are previewed in the browser and never uploaded, transmitted or
 * persisted (no network, no localStorage/sessionStorage, no analytics).
 */
export function DocumentUpload({ onCountChange }: { onCountChange?: (count: number) => void }) {
  const t = useTranslations("Forms.upload");
  const inputRef = useRef<HTMLInputElement>(null);
  const replaceTarget = useRef<string | null>(null);
  const filesRef = useRef<LocalFile[]>([]);
  const [files, setFiles] = useState<LocalFile[]>([]);
  const [errors, setErrors] = useState<string[]>([]);
  const [dragging, setDragging] = useState(false);
  const hintId = useId();
  const maxMb = documentUpload.maxBytes / (1024 * 1024);

  // Revoke preview URLs when the component goes away.
  useEffect(() => () => filesRef.current.forEach((f) => f.url && URL.revokeObjectURL(f.url)), []);

  const update = (next: LocalFile[]) => {
    filesRef.current = next;
    setFiles(next);
    onCountChange?.(next.length);
  };

  const toLocal = (file: File): LocalFile => {
    const isPdf = file.type === "application/pdf" || file.name.toLowerCase().endsWith(".pdf");
    return {
      id: `${file.name}-${file.size}-${Math.random().toString(36).slice(2, 8)}`,
      name: file.name,
      size: file.size,
      kind: isPdf ? "pdf" : "image",
      url: isPdf ? null : URL.createObjectURL(file),
    };
  };

  const accept = (incoming: FileList | null) => {
    if (!incoming?.length) return;
    const nextErrors: string[] = [];
    const valid: File[] = [];
    for (const file of Array.from(incoming)) {
      if (!isAllowedType(file)) nextErrors.push(t("errorType", { name: file.name }));
      else if (file.size > documentUpload.maxBytes)
        nextErrors.push(t("errorSize", { name: file.name, size: maxMb }));
      else valid.push(file);
    }

    const target = replaceTarget.current;
    replaceTarget.current = null;
    let next = [...filesRef.current];
    if (target && valid[0]) {
      const old = next.find((f) => f.id === target);
      if (old?.url) URL.revokeObjectURL(old.url);
      next = next.map((f) => (f.id === target ? toLocal(valid[0]) : f));
    } else {
      const room = documentUpload.maxFiles - next.length;
      if (valid.length > room) nextErrors.push(t("errorCount", { count: documentUpload.maxFiles }));
      next = [...next, ...valid.slice(0, Math.max(0, room)).map(toLocal)];
    }
    setErrors(nextErrors);
    update(next);
    if (inputRef.current) inputRef.current.value = "";
  };

  const remove = (id: string) => {
    const file = filesRef.current.find((f) => f.id === id);
    if (file?.url) URL.revokeObjectURL(file.url);
    setErrors([]);
    update(filesRef.current.filter((f) => f.id !== id));
  };

  const openPicker = (replaceId: string | null = null) => {
    replaceTarget.current = replaceId;
    inputRef.current?.click();
  };

  const onDrop = (event: DragEvent) => {
    event.preventDefault();
    setDragging(false);
    accept(event.dataTransfer.files);
  };

  const full = files.length >= documentUpload.maxFiles;
  const kb = (bytes: number) =>
    bytes > 1024 * 1024
      ? `${(bytes / (1024 * 1024)).toFixed(1)} MB`
      : `${Math.max(1, Math.round(bytes / 1024))} KB`;

  return (
    <div>
      <p className="text-sm font-semibold text-ink">{t("title")}</p>
      <p className="mt-1 text-sm text-muted">{t("description")}</p>

      <input
        ref={inputRef}
        type="file"
        accept={[...documentUpload.accept, ...documentUpload.extensions].join(",")}
        multiple
        className="sr-only"
        tabIndex={-1}
        aria-hidden
        onChange={(event) => accept(event.target.files)}
      />

      {!full ? (
        <div
          onDragOver={(event) => {
            event.preventDefault();
            setDragging(true);
          }}
          onDragLeave={() => setDragging(false)}
          onDrop={onDrop}
          className={cn(
            "mt-3 flex flex-col items-center justify-center rounded-2xl border-2 border-dashed px-4 py-7 text-center transition-colors",
            dragging
              ? "border-brand-500 bg-brand-50"
              : "border-line-strong bg-surface hover:border-brand-300",
          )}
        >
          <span className="grid size-12 place-items-center rounded-2xl bg-white text-brand-600 shadow-xs">
            <CloudUpload aria-hidden className="size-6" />
          </span>
          <p className="mt-3 text-sm font-semibold text-ink">{t("dropTitle")}</p>
          <p id={hintId} className="mt-1 text-xs text-muted">
            {t("dropHint", { size: maxMb, count: documentUpload.maxFiles })}
          </p>
          <button
            type="button"
            onClick={() => openPicker()}
            aria-describedby={hintId}
            className="mt-4 rounded-full bg-white px-4 py-2 text-sm font-semibold text-brand-700 shadow-xs ring-1 ring-line transition-colors hover:bg-brand-50"
          >
            {t("choose")}
          </button>
        </div>
      ) : null}

      {errors.length ? (
        <ul role="alert" className="mt-3 space-y-1">
          {errors.map((error) => (
            <li key={error} className="flex items-start gap-1.5 text-sm font-medium text-danger-700">
              <CircleAlert aria-hidden className="mt-0.5 size-4 shrink-0" />
              {error}
            </li>
          ))}
        </ul>
      ) : null}

      <AnimatePresence initial={false}>
        {files.length ? (
          <m.ul
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="mt-3 grid gap-3 sm:grid-cols-2"
          >
            {files.map((file) => (
              <li key={file.id} className="overflow-hidden rounded-2xl bg-white ring-1 ring-line">
                <div className="relative grid aspect-[16/10] place-items-center bg-surface">
                  {file.url ? (
                    // eslint-disable-next-line @next/next/no-img-element -- local object URL preview
                    <img
                      src={file.url}
                      alt={t("previewAlt", { name: file.name })}
                      className="size-full object-cover"
                    />
                  ) : (
                    <span className="flex flex-col items-center gap-2 text-brand-700">
                      <FileText aria-hidden className="size-10" />
                      <span className="text-xs font-semibold">PDF</span>
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-2 p-3">
                  <span className="min-w-0 flex-1">
                    <span className="block truncate text-sm font-medium text-ink">{file.name}</span>
                    <span className="block text-xs text-muted">{kb(file.size)}</span>
                  </span>
                  <button
                    type="button"
                    onClick={() => openPicker(file.id)}
                    className="grid size-9 place-items-center rounded-full text-ink-soft transition-colors hover:bg-surface"
                  >
                    <RefreshCw aria-hidden className="size-4" />
                    <span className="sr-only">{t("replace", { name: file.name })}</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => remove(file.id)}
                    className="grid size-9 place-items-center rounded-full text-danger-700 transition-colors hover:bg-danger-50"
                  >
                    <Trash2 aria-hidden className="size-4" />
                    <span className="sr-only">{t("remove", { name: file.name })}</span>
                  </button>
                </div>
              </li>
            ))}
          </m.ul>
        ) : null}
      </AnimatePresence>

      <p className="mt-3 flex items-start gap-2 rounded-2xl bg-brand-50 px-3.5 py-3 text-xs leading-relaxed text-brand-900">
        <ShieldCheck aria-hidden className="mt-0.5 size-4 shrink-0 text-brand-700" />
        {t("demoNotice")}
      </p>
    </div>
  );
}

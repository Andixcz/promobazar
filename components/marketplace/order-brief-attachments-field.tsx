"use client";

import {
  FileIcon,
  Film,
  ImagePlus,
  Loader2,
  Trash2,
} from "lucide-react";
import { useCallback, useRef, useState, type DragEvent } from "react";

import { FormField } from "@/components/ui/form-field";
import {
  attachmentKind,
  ORDER_BRIEF_ACCEPT,
  ORDER_BRIEF_ATTACHMENT_MAX,
  ORDER_BRIEF_UPLOAD_PURPOSE,
  type OrderBriefAttachment,
} from "@/lib/orders/brief-attachments";
import {
  StorageUnavailableError,
  uploadFileToStorage,
} from "@/lib/storage/upload-file";
import { fieldControl, fieldControlSizeDefault } from "@/lib/ui-surfaces";
import { cn } from "@/lib/utils";

type OrderBriefAttachmentsFieldProps = {
  value: OrderBriefAttachment[];
  onChange: (next: OrderBriefAttachment[]) => void;
  disabled?: boolean;
};

function pickFiles(list: FileList | null | undefined): File[] {
  if (!list?.length) return [];
  return Array.from(list).filter((f) => f.size > 0);
}

export function OrderBriefAttachmentsField({
  value,
  onChange,
  disabled,
}: OrderBriefAttachmentsFieldProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const slotsLeft = ORDER_BRIEF_ATTACHMENT_MAX - value.length;
  const canAdd = slotsLeft > 0;
  const busy = disabled || uploading;

  const uploadFiles = useCallback(
    async (files: File[]) => {
      if (!files.length || busy || !canAdd) return;
      setError(null);
      const batch = files.slice(0, slotsLeft);
      setUploading(true);
      const added: OrderBriefAttachment[] = [];
      try {
        for (const file of batch) {
          const url = await uploadFileToStorage(file, ORDER_BRIEF_UPLOAD_PURPOSE);
          added.push({
            url,
            name: file.name,
            contentType: file.type || "application/octet-stream",
          });
        }
        onChange([...value, ...added]);
      } catch (err) {
        if (err instanceof StorageUnavailableError) {
          setError(err.message);
        } else {
          setError(
            err instanceof Error ? err.message : "Nahrání se nepodařilo.",
          );
        }
      } finally {
        setUploading(false);
        if (inputRef.current) inputRef.current.value = "";
      }
    },
    [busy, canAdd, onChange, slotsLeft, value],
  );

  function onFileInputChange(list: FileList | null) {
    void uploadFiles(pickFiles(list));
  }

  function onDrop(event: DragEvent) {
    event.preventDefault();
    setDragActive(false);
    void uploadFiles(pickFiles(event.dataTransfer.files));
  }

  return (
    <FormField
      className="w-full"
      label="Inspirace a materiály"
      htmlFor="order-brief-files"
      hint={`Obrázky, videa, PDF nebo ZIP. Max. ${ORDER_BRIEF_ATTACHMENT_MAX} souborů, každý do 100 MB.`}
    >
      <div className="w-full min-w-0 space-y-3">
        <div
          className={cn(
            fieldControl,
            fieldControlSizeDefault,
            "relative flex w-full min-w-0 min-h-[7.5rem] cursor-pointer flex-col items-center justify-center gap-2 border-dashed text-center transition-colors",
            dragActive && canAdd && "border-cyan/40 bg-cyan/[0.06]",
            (!canAdd || busy) && "cursor-not-allowed opacity-60",
          )}
          onDragEnter={(e) => {
            e.preventDefault();
            if (canAdd && !busy) setDragActive(true);
          }}
          onDragLeave={(e) => {
            e.preventDefault();
            setDragActive(false);
          }}
          onDragOver={(e) => e.preventDefault()}
          onDrop={onDrop}
          onClick={() => {
            if (!busy && canAdd) inputRef.current?.click();
          }}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") {
              e.preventDefault();
              if (!busy && canAdd) inputRef.current?.click();
            }
          }}
        >
          <input
            ref={inputRef}
            id="order-brief-files"
            type="file"
            accept={ORDER_BRIEF_ACCEPT}
            multiple
            className="sr-only"
            disabled={busy || !canAdd}
            onChange={(e) => onFileInputChange(e.target.files)}
          />
          {uploading ? (
            <Loader2 className="size-6 animate-spin text-cyan" aria-hidden />
          ) : (
            <ImagePlus className="size-6 text-cyan" aria-hidden />
          )}
          <p className="text-sm text-zinc-200">
            {canAdd
              ? "Přetáhni soubory sem nebo klikni pro výběr"
              : "Dosažen limit souborů"}
          </p>
          <p className="text-xs text-mist">
            {value.length} / {ORDER_BRIEF_ATTACHMENT_MAX}
          </p>
        </div>

        {error ? (
          <p className="text-sm text-destructive" role="alert">
            {error}
          </p>
        ) : null}

        {value.length > 0 ? (
          <ul className="w-full divide-y divide-white/[0.08] rounded-lg border border-white/[0.08]">
            {value.map((file) => {
              const kind = attachmentKind(file.contentType);
              return (
                <li
                  key={file.url}
                  className="flex items-center gap-3 px-3 py-2.5"
                >
                  <span className="flex size-9 shrink-0 items-center justify-center overflow-hidden rounded-md bg-white/[0.04] text-cyan">
                    {kind === "image" ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={file.url}
                        alt=""
                        className="size-9 object-cover"
                      />
                    ) : kind === "video" ? (
                      <Film className="size-4" aria-hidden />
                    ) : (
                      <FileIcon className="size-4" aria-hidden />
                    )}
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium text-white">
                      {file.name}
                    </p>
                    <a
                      href={file.url}
                      target="_blank"
                      rel="noreferrer"
                      className="text-xs text-cyan hover:underline"
                      onClick={(e) => e.stopPropagation()}
                    >
                      Náhled
                    </a>
                  </div>
                  <button
                    type="button"
                    className="inline-flex size-8 shrink-0 items-center justify-center rounded-md text-mist transition-colors hover:bg-white/[0.06] hover:text-white disabled:opacity-40"
                    aria-label={`Odebrat ${file.name}`}
                    disabled={busy}
                    onClick={() =>
                      onChange(value.filter((item) => item.url !== file.url))
                    }
                  >
                    <Trash2 className="size-4" aria-hidden />
                  </button>
                </li>
              );
            })}
          </ul>
        ) : null}
      </div>
    </FormField>
  );
}

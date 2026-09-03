"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Link from "@tiptap/extension-link";
import Image from "@tiptap/extension-image";
import Placeholder from "@tiptap/extension-placeholder";
import Underline from "@tiptap/extension-underline";
import { useState, useEffect, useCallback } from "react";
import MediaPicker from "@/components/admin/media/MediaPicker";
import type { MediaAssetData } from "@/components/admin/media/types";

interface AdminRichTextEditorProps {
  initialContent?: string;
  name?: string;
  placeholder?: string;
  onChange?: (html: string) => void;
  label?: string;
  required?: boolean;
}

export default function AdminRichTextEditor({
  initialContent = "",
  name = "content",
  placeholder = "Write your content here...",
  onChange,
  label = "Content",
  required = false,
}: AdminRichTextEditorProps) {
  const [contentHtml, setContentHtml] = useState(initialContent);
  const [isMediaPickerOpen, setIsMediaPickerOpen] = useState(false);
  const [isLinkModalOpen, setIsLinkModalOpen] = useState(false);
  const [linkUrl, setLinkUrl] = useState("");
  const [isImageConfigOpen, setIsImageConfigOpen] = useState(false);
  const [selectedImageTemp, setSelectedImageTemp] = useState<MediaAssetData | null>(null);
  const [imageAlt, setImageAlt] = useState("");
  const [imageTitle, setImageTitle] = useState("");
  const [isDecorative, setIsDecorative] = useState(false);

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: { levels: [2, 3] },
      }),
      Underline,
      Link.configure({
        openOnClick: false,
        HTMLAttributes: {
          class: "text-[#8D6E63] underline hover:text-[#5D4037]",
        },
      }),
      Image.configure({
        HTMLAttributes: {
          class: "rounded-lg max-w-full h-auto my-4",
        },
      }),
      Placeholder.configure({
        placeholder,
      }),
    ],
    content: initialContent,
    immediatelyRender: false,
    onUpdate: ({ editor }) => {
      const html = editor.getHTML();
      setContentHtml(html);
      if (onChange) onChange(html);
    },
  });

  // Sync initialContent if it changes externally
  useEffect(() => {
    if (editor && initialContent !== editor.getHTML() && !editor.isFocused) {
      editor.commands.setContent(initialContent);
    }
  }, [initialContent, editor]);

  const setLink = useCallback(() => {
    if (!editor) return;
    const previousUrl = editor.getAttributes("link").href;
    setLinkUrl(previousUrl || "");
    setIsLinkModalOpen(true);
  }, [editor]);

  const handleLinkSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editor) return;

    if (linkUrl === "") {
      editor.chain().focus().extendMarkRange("link").unsetLink().run();
    } else {
      editor.chain().focus().extendMarkRange("link").setLink({ href: linkUrl }).run();
    }
    setIsLinkModalOpen(false);
    setLinkUrl("");
  };

  const handleImageSelected = (asset: MediaAssetData) => {
    setSelectedImageTemp(asset);
    setImageAlt(asset.altText || "");
    setImageTitle("");
    setIsDecorative(false);
    setIsMediaPickerOpen(false);
    setIsImageConfigOpen(true);
  };

  const handleImageInsertFinal = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editor || !selectedImageTemp) return;

    const finalAlt = isDecorative ? "" : (imageAlt.trim() || selectedImageTemp.altText || "Editorial image");
    if (!isDecorative && !finalAlt) {
      alert("Please provide alt text for accessibility or mark the image as decorative.");
      return;
    }

    editor
      .chain()
      .focus()
      .setImage({
        src: selectedImageTemp.secureUrl,
        alt: finalAlt,
        title: imageTitle.trim() || undefined,
      })
      .run();

    setIsImageConfigOpen(false);
    setSelectedImageTemp(null);
  };

  if (!editor) {
    return (
      <div className="w-full h-48 border border-[#D7C9B8] rounded bg-[#FAF6F0] flex items-center justify-center text-sm text-[#8D6E63]">
        Loading editor...
      </div>
    );
  }

  return (
    <div className="space-y-1.5">
      <input type="hidden" name={name} value={contentHtml} />

      <div className="flex items-center justify-between">
        <label className="block text-xs font-medium text-[#5D4037]">
          {label} {required && "*"}
        </label>
        <span className="text-[11px] text-[#8D6E63]">
          {editor.storage.characterCount ? `${editor.storage.characterCount.characters()} chars` : ""}
        </span>
      </div>

      <div className="border border-[#D7C9B8] rounded-lg bg-white overflow-hidden shadow-xs focus-within:ring-2 focus-within:ring-[#C9A882] focus-within:border-transparent">
        {/* Toolbar */}
        <div
          className="flex flex-wrap items-center gap-1 p-1.5 bg-[#FAF6F0] border-b border-[#D7C9B8]"
          role="toolbar"
          aria-label="Rich text editor formatting toolbar"
        >
          {/* Undo / Redo */}
          <button
            type="button"
            onClick={() => editor.chain().focus().undo().run()}
            disabled={!editor.can().undo()}
            aria-label="Undo"
            className="p-1.5 rounded hover:bg-[#E8DCC8] disabled:opacity-40 text-[#5D4037] text-xs font-medium transition-colors cursor-pointer min-h-[36px] min-w-[36px] flex items-center justify-center"
            title="Undo"
          >
            ↩
          </button>
          <button
            type="button"
            onClick={() => editor.chain().focus().redo().run()}
            disabled={!editor.can().redo()}
            aria-label="Redo"
            className="p-1.5 rounded hover:bg-[#E8DCC8] disabled:opacity-40 text-[#5D4037] text-xs font-medium transition-colors cursor-pointer min-h-[36px] min-w-[36px] flex items-center justify-center"
            title="Redo"
          >
            ↪
          </button>

          <div className="w-[1px] h-5 bg-[#D7C9B8] mx-0.5" />

          {/* Paragraph / Headings */}
          <button
            type="button"
            onClick={() => editor.chain().focus().setParagraph().run()}
            aria-pressed={editor.isActive("paragraph")}
            aria-label="Paragraph"
            className={`px-2 py-1 rounded text-xs font-medium transition-colors cursor-pointer min-h-[36px] flex items-center justify-center ${
              editor.isActive("paragraph") ? "bg-[#C9A882] text-white" : "hover:bg-[#E8DCC8] text-[#5D4037]"
            }`}
          >
            P
          </button>
          <button
            type="button"
            onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
            aria-pressed={editor.isActive("heading", { level: 2 })}
            aria-label="Heading 2"
            className={`px-2 py-1 rounded text-xs font-semibold transition-colors cursor-pointer min-h-[36px] flex items-center justify-center ${
              editor.isActive("heading", { level: 2 }) ? "bg-[#C9A882] text-white" : "hover:bg-[#E8DCC8] text-[#5D4037]"
            }`}
          >
            H2
          </button>
          <button
            type="button"
            onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
            aria-pressed={editor.isActive("heading", { level: 3 })}
            aria-label="Heading 3"
            className={`px-2 py-1 rounded text-xs font-semibold transition-colors cursor-pointer min-h-[36px] flex items-center justify-center ${
              editor.isActive("heading", { level: 3 }) ? "bg-[#C9A882] text-white" : "hover:bg-[#E8DCC8] text-[#5D4037]"
            }`}
          >
            H3
          </button>

          <div className="w-[1px] h-5 bg-[#D7C9B8] mx-0.5" />

          {/* Formatting */}
          <button
            type="button"
            onClick={() => editor.chain().focus().toggleBold().run()}
            aria-pressed={editor.isActive("bold")}
            aria-label="Bold"
            className={`px-2.5 py-1 rounded text-xs font-bold transition-colors cursor-pointer min-h-[36px] flex items-center justify-center ${
              editor.isActive("bold") ? "bg-[#C9A882] text-white" : "hover:bg-[#E8DCC8] text-[#5D4037]"
            }`}
          >
            B
          </button>
          <button
            type="button"
            onClick={() => editor.chain().focus().toggleItalic().run()}
            aria-pressed={editor.isActive("italic")}
            aria-label="Italic"
            className={`px-2.5 py-1 rounded text-xs italic transition-colors cursor-pointer min-h-[36px] flex items-center justify-center ${
              editor.isActive("italic") ? "bg-[#C9A882] text-white" : "hover:bg-[#E8DCC8] text-[#5D4037]"
            }`}
          >
            I
          </button>
          <button
            type="button"
            onClick={() => editor.chain().focus().toggleUnderline().run()}
            aria-pressed={editor.isActive("underline")}
            aria-label="Underline"
            className={`px-2.5 py-1 rounded text-xs underline transition-colors cursor-pointer min-h-[36px] flex items-center justify-center ${
              editor.isActive("underline") ? "bg-[#C9A882] text-white" : "hover:bg-[#E8DCC8] text-[#5D4037]"
            }`}
          >
            U
          </button>

          <div className="w-[1px] h-5 bg-[#D7C9B8] mx-0.5" />

          {/* Lists & Quotes */}
          <button
            type="button"
            onClick={() => editor.chain().focus().toggleBulletList().run()}
            aria-pressed={editor.isActive("bulletList")}
            aria-label="Bullet list"
            className={`px-2.5 py-1 rounded text-xs font-medium transition-colors cursor-pointer min-h-[36px] flex items-center justify-center ${
              editor.isActive("bulletList") ? "bg-[#C9A882] text-white" : "hover:bg-[#E8DCC8] text-[#5D4037]"
            }`}
            title="Bullet List"
          >
            • List
          </button>
          <button
            type="button"
            onClick={() => editor.chain().focus().toggleOrderedList().run()}
            aria-pressed={editor.isActive("orderedList")}
            aria-label="Ordered list"
            className={`px-2.5 py-1 rounded text-xs font-medium transition-colors cursor-pointer min-h-[36px] flex items-center justify-center ${
              editor.isActive("orderedList") ? "bg-[#C9A882] text-white" : "hover:bg-[#E8DCC8] text-[#5D4037]"
            }`}
            title="Ordered List"
          >
            1. List
          </button>
          <button
            type="button"
            onClick={() => editor.chain().focus().toggleBlockquote().run()}
            aria-pressed={editor.isActive("blockquote")}
            aria-label="Blockquote"
            className={`px-2.5 py-1 rounded text-xs font-medium transition-colors cursor-pointer min-h-[36px] flex items-center justify-center ${
              editor.isActive("blockquote") ? "bg-[#C9A882] text-white" : "hover:bg-[#E8DCC8] text-[#5D4037]"
            }`}
            title="Blockquote"
          >
            “ ”
          </button>

          <div className="w-[1px] h-5 bg-[#D7C9B8] mx-0.5" />

          {/* Links & Media */}
          <button
            type="button"
            onClick={setLink}
            aria-pressed={editor.isActive("link")}
            aria-label="Insert link"
            className={`px-2.5 py-1 rounded text-xs font-medium transition-colors cursor-pointer min-h-[36px] flex items-center justify-center ${
              editor.isActive("link") ? "bg-[#C9A882] text-white" : "hover:bg-[#E8DCC8] text-[#5D4037]"
            }`}
            title="Insert Link"
          >
            🔗 Link
          </button>
          {editor.isActive("link") && (
            <button
              type="button"
              onClick={() => editor.chain().focus().unsetLink().run()}
              aria-label="Remove link"
              className="px-2 py-1 rounded text-xs font-medium hover:bg-[#E8DCC8] text-[#8D6E63] transition-colors cursor-pointer min-h-[36px] flex items-center justify-center"
              title="Remove Link"
            >
              Unlink
            </button>
          )}

          <button
            type="button"
            onClick={() => setIsMediaPickerOpen(true)}
            aria-label="Insert image from media library"
            className="px-2.5 py-1 rounded text-xs font-medium hover:bg-[#E8DCC8] text-[#5D4037] transition-colors cursor-pointer min-h-[36px] flex items-center justify-center"
            title="Insert Image"
          >
            🖼️ Image
          </button>

          <button
            type="button"
            onClick={() => editor.chain().focus().setHorizontalRule().run()}
            aria-label="Horizontal rule"
            className="px-2 py-1 rounded text-xs font-medium hover:bg-[#E8DCC8] text-[#5D4037] transition-colors cursor-pointer min-h-[36px] flex items-center justify-center"
            title="Horizontal Rule"
          >
            ―
          </button>

          <button
            type="button"
            onClick={() => editor.chain().focus().clearContent().run()}
            aria-label="Clear formatting"
            className="px-2 py-1 rounded text-xs font-medium hover:bg-red-50 text-red-700 transition-colors cursor-pointer ml-auto min-h-[36px] flex items-center justify-center"
            title="Clear All Content"
          >
            Clear
          </button>
        </div>

        {/* Editor Content Area */}
        <div className="p-4 min-h-[240px] prose prose-sm max-w-none focus:outline-none text-[#5D4037]">
          <EditorContent editor={editor} />
        </div>
      </div>

      {/* Link Modal */}
      {isLinkModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white rounded-lg border border-[#E8DCC8] p-5 w-full max-w-md shadow-xl space-y-4">
            <h3 className="text-sm font-semibold text-[#5D4037]">Insert / Edit Link</h3>
            <form onSubmit={handleLinkSubmit} className="space-y-3">
              <div>
                <label className="block text-xs font-medium text-[#5D4037] mb-1">URL (https:// or /path)</label>
                <input
                  type="text"
                  value={linkUrl}
                  onChange={(e) => setLinkUrl(e.target.value)}
                  placeholder="https://example.com or /trails/boga-lake"
                  required
                  className="w-full px-3 py-2 text-sm border border-[#D7C9B8] rounded bg-white text-[#5D4037] focus:outline-none focus:ring-2 focus:ring-[#C9A882]"
                />
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsLinkModalOpen(false)}
                  className="px-3 py-1.5 text-xs bg-gray-100 hover:bg-gray-200 text-gray-700 rounded transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-3 py-1.5 text-xs bg-[#5D4037] hover:bg-[#4E342E] text-white rounded transition-colors cursor-pointer"
                >
                  Apply Link
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Media Picker Modal */}
      <MediaPicker
        open={isMediaPickerOpen}
        mode="image"
        selected={null}
        onClose={() => setIsMediaPickerOpen(false)}
        onSelect={handleImageSelected}
        title="Insert Inline Image from Media Library"
      />

      {/* Image Configuration Modal */}
      {isImageConfigOpen && selectedImageTemp && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white rounded-lg border border-[#E8DCC8] p-5 w-full max-w-md shadow-xl space-y-4">
            <h3 className="text-sm font-semibold text-[#5D4037]">Configure Inline Image</h3>
            <div className="w-full h-36 bg-gray-100 rounded overflow-hidden flex items-center justify-center">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={selectedImageTemp.secureUrl} alt="Preview" className="h-full object-contain" />
            </div>
            <form onSubmit={handleImageInsertFinal} className="space-y-3">
              <div>
                <label className="block text-xs font-medium text-[#5D4037] mb-1">Alt Text * (Required for accessibility)</label>
                <input
                  type="text"
                  value={imageAlt}
                  onChange={(e) => setImageAlt(e.target.value)}
                  disabled={isDecorative}
                  placeholder="Describe the image..."
                  className="w-full px-3 py-2 text-sm border border-[#D7C9B8] rounded bg-white text-[#5D4037] focus:outline-none focus:ring-2 focus:ring-[#C9A882] disabled:bg-gray-100"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-[#5D4037] mb-1">Title / Caption (Optional)</label>
                <input
                  type="text"
                  value={imageTitle}
                  onChange={(e) => setImageTitle(e.target.value)}
                  placeholder="Optional title or caption"
                  className="w-full px-3 py-2 text-sm border border-[#D7C9B8] rounded bg-white text-[#5D4037] focus:outline-none focus:ring-2 focus:ring-[#C9A882]"
                />
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="isDecorative"
                  checked={isDecorative}
                  onChange={(e) => setIsDecorative(e.target.checked)}
                  className="rounded border-[#D7C9B8] text-[#5D4037] focus:ring-[#C9A882]"
                />
                <label htmlFor="isDecorative" className="text-xs text-[#5D4037]">
                  Mark as decorative (skip alt text requirement)
                </label>
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsImageConfigOpen(false)}
                  className="px-3 py-1.5 text-xs bg-gray-100 hover:bg-gray-200 text-gray-700 rounded transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-3 py-1.5 text-xs bg-[#5D4037] hover:bg-[#4E342E] text-white rounded transition-colors cursor-pointer"
                >
                  Insert Image
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

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

const PlaceholderStyles = () => (
  <style dangerouslySetInnerHTML={{ __html: `
    .tiptap p.is-editor-empty:first-child::before {
      color: #8D6E63;
      content: attr(data-placeholder);
      float: left;
      height: 0;
      pointer-events: none;
    }
  ` }} />
);

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
    editor.chain().focus().setImage({
      src: selectedImageTemp.secureUrl,
      alt: finalAlt,
      title: imageTitle.trim() || undefined,
    }).run();
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
      <PlaceholderStyles />
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
          className="flex flex-wrap items-center gap-0.5 p-1.5 bg-[#FAF6F0] border-b border-[#D7C9B8]"
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
            title="Undo (Ctrl+Z)"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 14 4 9 9 4"/><path d="M20 20v-7a4 4 0 0 0-4-4H4"/></svg>
          </button>
          <button
            type="button"
            onClick={() => editor.chain().focus().redo().run()}
            disabled={!editor.can().redo()}
            aria-label="Redo"
            className="p-1.5 rounded hover:bg-[#E8DCC8] disabled:opacity-40 text-[#5D4037] text-xs font-medium transition-colors cursor-pointer min-h-[36px] min-w-[36px] flex items-center justify-center"
            title="Redo (Ctrl+Shift+Z)"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 14 20 9 15 4"/><path d="M4 20v-7a4 4 0 0 1 4-4h12"/></svg>
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
            title="Paragraph"
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
            title="Heading 2"
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
            title="Heading 3"
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
            className={`px-2 py-1 rounded text-xs font-bold transition-colors cursor-pointer min-h-[36px] flex items-center justify-center ${
              editor.isActive("bold") ? "bg-[#C9A882] text-white" : "hover:bg-[#E8DCC8] text-[#5D4037]"
            }`}
            title="Bold (Ctrl+B)"
          >
            B
          </button>
          <button
            type="button"
            onClick={() => editor.chain().focus().toggleItalic().run()}
            aria-pressed={editor.isActive("italic")}
            aria-label="Italic"
            className={`px-2 py-1 rounded text-xs italic transition-colors cursor-pointer min-h-[36px] flex items-center justify-center ${
              editor.isActive("italic") ? "bg-[#C9A882] text-white" : "hover:bg-[#E8DCC8] text-[#5D4037]"
            }`}
            title="Italic (Ctrl+I)"
          >
            I
          </button>
          <button
            type="button"
            onClick={() => editor.chain().focus().toggleUnderline().run()}
            aria-pressed={editor.isActive("underline")}
            aria-label="Underline"
            className={`px-2 py-1 rounded text-xs underline transition-colors cursor-pointer min-h-[36px] flex items-center justify-center ${
              editor.isActive("underline") ? "bg-[#C9A882] text-white" : "hover:bg-[#E8DCC8] text-[#5D4037]"
            }`}
            title="Underline (Ctrl+U)"
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
            className={`px-1.5 py-1 rounded transition-colors cursor-pointer min-h-[36px] flex items-center justify-center ${
              editor.isActive("bulletList") ? "bg-[#C9A882] text-white" : "hover:bg-[#E8DCC8] text-[#5D4037]"
            }`}
            title="Bullet List"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="4" cy="6" r="1.5" fill="currentColor" stroke="none"/><circle cx="4" cy="12" r="1.5" fill="currentColor" stroke="none"/><circle cx="4" cy="18" r="1.5" fill="currentColor" stroke="none"/><line x1="9" y1="6" x2="20" y2="6"/><line x1="9" y1="12" x2="20" y2="12"/><line x1="9" y1="18" x2="20" y2="18"/></svg>
          </button>
          <button
            type="button"
            onClick={() => editor.chain().focus().toggleOrderedList().run()}
            aria-pressed={editor.isActive("orderedList")}
            aria-label="Ordered list"
            className={`px-1.5 py-1 rounded transition-colors cursor-pointer min-h-[36px] flex items-center justify-center ${
              editor.isActive("orderedList") ? "bg-[#C9A882] text-white" : "hover:bg-[#E8DCC8] text-[#5D4037]"
            }`}
            title="Ordered List"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><text x="2" y="8" fontSize="8" fill="currentColor" stroke="none" fontFamily="sans-serif">1</text><text x="2" y="14" fontSize="8" fill="currentColor" stroke="none" fontFamily="sans-serif">2</text><text x="2" y="20" fontSize="8" fill="currentColor" stroke="none" fontFamily="sans-serif">3</text><line x1="10" y1="6" x2="20" y2="6"/><line x1="10" y1="12" x2="20" y2="12"/><line x1="10" y1="18" x2="20" y2="18"/></svg>
          </button>
          <button
            type="button"
            onClick={() => editor.chain().focus().toggleBlockquote().run()}
            aria-pressed={editor.isActive("blockquote")}
            aria-label="Blockquote"
            className={`px-1.5 py-1 rounded transition-colors cursor-pointer min-h-[36px] flex items-center justify-center ${
              editor.isActive("blockquote") ? "bg-[#C9A882] text-white" : "hover:bg-[#E8DCC8] text-[#5D4037]"
            }`}
            title="Blockquote"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M4.583 17.321C3.553 16.227 3 15 3 13.011c0-3.5 2.457-6.637 6.03-8.188l.893 1.378c-3.335 1.804-3.987 4.145-4.247 5.621.537-.278 1.24-.375 1.929-.311 1.804.167 3.226 1.648 3.226 3.489a3.5 3.5 0 01-3.5 3.5c-1.073 0-2.099-.49-2.748-1.179zm10 0C13.553 16.227 13 15 13 13.011c0-3.5 2.457-6.637 6.03-8.188l.893 1.378c-3.335 1.804-3.987 4.145-4.247 5.621.537-.278 1.24-.375 1.929-.311 1.804.167 3.226 1.648 3.226 3.489a3.5 3.5 0 01-3.5 3.5c-1.073 0-2.099-.49-2.748-1.179z"/></svg>
          </button>

          <div className="w-[1px] h-5 bg-[#D7C9B8] mx-0.5" />

          {/* Links & Media */}
          <button
            type="button"
            onClick={setLink}
            aria-pressed={editor.isActive("link")}
            aria-label="Insert link"
            className={`px-1.5 py-1 rounded transition-colors cursor-pointer min-h-[36px] flex items-center justify-center ${
              editor.isActive("link") ? "bg-[#C9A882] text-white" : "hover:bg-[#E8DCC8] text-[#5D4037]"
            }`}
            title="Insert Link"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/></svg>
          </button>
          {editor.isActive("link") && (
            <button
              type="button"
              onClick={() => editor.chain().focus().unsetLink().run()}
              aria-label="Remove link"
              className="px-1.5 py-1 rounded hover:bg-[#E8DCC8] text-[#8D6E63] transition-colors cursor-pointer min-h-[36px] flex items-center justify-center"
              title="Remove Link"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
            </button>
          )}

          <button
            type="button"
            onClick={() => setIsMediaPickerOpen(true)}
            aria-label="Insert image from media library"
            className="px-1.5 py-1 rounded hover:bg-[#E8DCC8] text-[#5D4037] transition-colors cursor-pointer min-h-[36px] flex items-center justify-center"
            title="Insert Image"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>
          </button>

          <button
            type="button"
            onClick={() => editor.chain().focus().setHorizontalRule().run()}
            aria-label="Horizontal rule"
            className="px-1.5 py-1 rounded hover:bg-[#E8DCC8] text-[#5D4037] transition-colors cursor-pointer min-h-[36px] flex items-center justify-center"
            title="Horizontal Rule"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="2" y1="12" x2="22" y2="12"/></svg>
          </button>

          <button
            type="button"
            onClick={() => editor.chain().focus().clearContent().run()}
            aria-label="Clear all content"
            className="px-1.5 py-1 rounded hover:bg-red-50 text-red-700 transition-colors cursor-pointer ml-auto min-h-[36px] flex items-center justify-center"
            title="Clear All Content"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>
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
                <label className="block text-xs font-medium text-[#5D4037] mb-1">Alt Text (Required for accessibility) <span className="text-red-600">*</span></label>
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
                  className="w-3.5 h-3.5 rounded border-[#D7C9B8] text-[#5D4037] focus:ring-[#C9A882]"
                />
                <label htmlFor="isDecorative" className="text-xs text-[#5D4037]">
                  Decorative image (no alt text)
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

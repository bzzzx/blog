"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";
import { marked } from "marked";

const API = "/api/admin";

interface PostData {
  slug: string;
  title: string;
  date: string;
  description: string;
  tags: string[];
  category: string;
  content: string;
  sha?: string;
}

/* ─── Toolbar Button ─── */
function ToolBtn({
  label,
  title,
  onClick,
}: {
  label: string;
  title: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      title={title}
      onClick={onClick}
      className="rounded-md px-2 py-1 text-sm text-zinc-500 transition-colors hover:bg-zinc-100 hover:text-zinc-800 dark:text-zinc-400 dark:hover:bg-zinc-700 dark:hover:text-zinc-200"
    >
      {label}
    </button>
  );
}

/* ─── Dialogs ─── */
function ImageDialog({
  open,
  onClose,
  onInsert,
}: {
  open: boolean;
  onClose: () => void;
  onInsert: (alt: string, url: string) => void;
}) {
  const [alt, setAlt] = useState("");
  const [url, setUrl] = useState("");
  const [tab, setTab] = useState<"upload" | "url">("upload");
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [preview, setPreview] = useState("");
  const fileRef = useRef<HTMLInputElement>(null);

  if (!open) return null;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (f) {
      setFile(f);
      const reader = new FileReader();
      reader.onload = () => setPreview(reader.result as string);
      reader.readAsDataURL(f);
    }
  };

  const handleUpload = async () => {
    if (!file) return;
    setUploading(true);
    try {
      const token = sessionStorage.getItem("admin_token") || "";
      const reader = new FileReader();
      reader.onload = async () => {
        const res = await fetch("/api/admin/upload", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            filename: file.name,
            data: reader.result as string,
          }),
        });
        const d = await res.json();
        if (d.success) {
          onInsert(alt || file.name.replace(/\.[^.]+$/, ""), d.url);
          setAlt("");
          setFile(null);
          setPreview("");
          onClose();
        } else {
          alert(d.error || "上传失败");
        }
        setUploading(false);
      };
      reader.readAsDataURL(file);
    } catch {
      alert("上传失败");
      setUploading(false);
    }
  };

  const handleUrlSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (url) {
      onInsert(alt || "image", url);
      setAlt("");
      setUrl("");
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30">
      <div className="w-[460px] rounded-2xl bg-white p-6 shadow-2xl dark:bg-zinc-800">
        <h3 className="mb-4 text-lg font-semibold text-zinc-900 dark:text-zinc-100">插入图片</h3>

        {/* Tabs */}
        <div className="mb-4 flex rounded-lg bg-zinc-100 p-0.5 dark:bg-zinc-700">
          <button
            type="button"
            onClick={() => setTab("upload")}
            className={`flex-1 rounded-md py-1.5 text-sm font-medium transition-colors ${
              tab === "upload"
                ? "bg-white text-zinc-900 shadow-sm dark:bg-zinc-600 dark:text-zinc-100"
                : "text-zinc-500 dark:text-zinc-400"
            }`}
          >
            📁 上传图片
          </button>
          <button
            type="button"
            onClick={() => setTab("url")}
            className={`flex-1 rounded-md py-1.5 text-sm font-medium transition-colors ${
              tab === "url"
                ? "bg-white text-zinc-900 shadow-sm dark:bg-zinc-600 dark:text-zinc-100"
                : "text-zinc-500 dark:text-zinc-400"
            }`}
          >
            🔗 图片链接
          </button>
        </div>

        {tab === "upload" ? (
          <div>
            <div
              onClick={() => fileRef.current?.click()}
              className="mb-3 flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-zinc-300 py-8 transition-colors hover:border-blue-400 hover:bg-blue-50/50 dark:border-zinc-600 dark:hover:border-blue-500 dark:hover:bg-blue-900/20"
            >
              {preview ? (
                <img src={preview} alt="预览" className="max-h-32 max-w-full rounded-lg object-contain" />
              ) : (
                <>
                  <span className="text-3xl">📁</span>
                  <span className="mt-2 text-sm text-zinc-500 dark:text-zinc-400">
                    {file ? file.name : "点击选择图片文件"}
                  </span>
                  <span className="mt-1 text-xs text-zinc-400 dark:text-zinc-500">
                    支持 PNG, JPG, GIF, SVG
                  </span>
                </>
              )}
            </div>
            <input
              ref={fileRef}
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="hidden"
            />
            <input
              type="text"
              value={alt}
              onChange={(e) => setAlt(e.target.value)}
              placeholder="替代文字（可选）"
              className="mb-4 w-full rounded-lg border px-3 py-2 text-sm dark:border-zinc-600 dark:bg-zinc-700 dark:text-zinc-100"
            />
            <div className="flex justify-end gap-2">
              <button type="button" onClick={onClose} className="rounded-lg px-4 py-2 text-sm text-zinc-500 hover:bg-zinc-100 dark:hover:bg-zinc-700">取消</button>
              <button
                type="button"
                onClick={handleUpload}
                disabled={!file || uploading}
                className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50"
              >
                {uploading ? "上传中..." : "上传并插入"}
              </button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleUrlSubmit}>
            <input
              type="text"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="图片 URL，如 https://example.com/img.png"
              className="mb-3 w-full rounded-lg border px-3 py-2 text-sm dark:border-zinc-600 dark:bg-zinc-700 dark:text-zinc-100"
              autoFocus
            />
            <input
              type="text"
              value={alt}
              onChange={(e) => setAlt(e.target.value)}
              placeholder="替代文字（可选）"
              className="mb-4 w-full rounded-lg border px-3 py-2 text-sm dark:border-zinc-600 dark:bg-zinc-700 dark:text-zinc-100"
            />
            <div className="flex justify-end gap-2">
              <button type="button" onClick={onClose} className="rounded-lg px-4 py-2 text-sm text-zinc-500 hover:bg-zinc-100 dark:hover:bg-zinc-700">取消</button>
              <button type="submit" disabled={!url} className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50">插入</button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}

function CodeDialog({
  open,
  onClose,
  onInsert,
}: {
  open: boolean;
  onClose: () => void;
  onInsert: (lang: string, code: string) => void;
}) {
  const [lang, setLang] = useState("");
  const [code, setCode] = useState("");

  if (!open) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (code) {
      onInsert(lang, code);
      setLang("");
      setCode("");
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30">
      <form
        onSubmit={handleSubmit}
        className="w-[500px] rounded-2xl bg-white p-6 shadow-2xl dark:bg-zinc-800"
      >
        <h3 className="mb-4 text-lg font-semibold">插入代码块</h3>
        <select
          value={lang}
          onChange={(e) => setLang(e.target.value)}
          className="mb-3 w-full rounded-lg border px-3 py-2 text-sm dark:border-zinc-600 dark:bg-zinc-700 dark:text-zinc-100"
        >
          <option value="">选择语言（可选）</option>
          <option value="typescript">TypeScript</option>
          <option value="javascript">JavaScript</option>
          <option value="python">Python</option>
          <option value="bash">Bash / Shell</option>
          <option value="yaml">YAML</option>
          <option value="json">JSON</option>
          <option value="dockerfile">Dockerfile</option>
          <option value="nginx">Nginx</option>
          <option value="sql">SQL</option>
          <option value="css">CSS</option>
          <option value="html">HTML</option>
          <option value="rust">Rust</option>
          <option value="go">Go</option>
          <option value="java">Java</option>
        </select>
        <textarea
          value={code}
          onChange={(e) => setCode(e.target.value)}
          rows={8}
          placeholder="粘贴代码..."
          className="mb-4 w-full rounded-lg border px-3 py-2 text-sm font-mono dark:border-zinc-600 dark:bg-zinc-700 dark:text-zinc-100"
        />
        <div className="flex justify-end gap-2">
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg px-4 py-2 text-sm text-zinc-500 hover:bg-zinc-100 dark:hover:bg-zinc-700"
          >
            取消
          </button>
          <button
            type="submit"
            className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
          >
            插入
          </button>
        </div>
      </form>
    </div>
  );
}

/* ─── Main Editor ─── */
export default function PostEditor({ editData }: { editData?: PostData }) {
  const router = useRouter();
  const isEdit = !!editData;
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [date, setDate] = useState(new Date().toISOString().slice(0, 10));
  const [description, setDescription] = useState("");
  const [tagsInput, setTagsInput] = useState("");
  const [category, setCategory] = useState("");
  const [content, setContent] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [preview, setPreview] = useState(false);
  const [showImage, setShowImage] = useState(false);
  const [showCode, setShowCode] = useState(false);
  const [categories, setCategories] = useState<string[]>([]);

  const token =
    typeof window !== "undefined"
      ? sessionStorage.getItem("admin_token") || ""
      : "";

  // Load categories from API
  useEffect(() => {
    if (!token) return;
    fetch(`${API}/categories`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((r) => r.json())
      .then((data) => {
        if (Array.isArray(data)) setCategories(data);
      })
      .catch(() => {});
  }, [token]);

  useEffect(() => {
    if (editData) {
      setTitle(editData.title || "");
      setSlug(editData.slug || "");
      setDate(editData.date?.slice(0, 10) || "");
      setDescription(editData.description || "");
      setTagsInput((editData.tags || []).join(", "));
      setCategory(editData.category || "");
      setContent(editData.content || "");
    }
  }, [editData]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSaving(true);

    const tags = tagsInput
      .split(",")
      .map((t) => t.trim())
      .filter(Boolean);

    try {
      const body: Record<string, unknown> = {
        slug,
        title,
        date,
        description,
        tags,
        category,
        content,
      };
      if (isEdit && editData?.sha) body.sha = editData.sha;

      const res = await fetch(`${API}/posts`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(body),
      });

      const data = await res.json();
      if (data.success) {
        router.push("/admin/posts");
        router.refresh();
      } else {
        setError(data.error || "保存失败");
      }
    } catch {
      setError("网络错误");
    }
    setSaving(false);
  };

  const autoSlug = (t: string) =>
    t
      .toLowerCase()
      .replace(/[^\w一-鿿]+/g, "-")
      .replace(/^-|-$/g, "");

  /* ─── Textarea helpers ─── */
  const insertAtCursor = useCallback(
    (before: string, after: string, placeholder?: string) => {
      const ta = textareaRef.current;
      if (!ta) return;
      const start = ta.selectionStart;
      const end = ta.selectionEnd;
      const selected = ta.value.substring(start, end);
      const text = selected || placeholder || "";
      const newContent =
        content.substring(0, start) +
        before +
        text +
        after +
        content.substring(end);
      setContent(newContent);
      // restore cursor
      requestAnimationFrame(() => {
        ta.focus();
        const pos = start + before.length + text.length + after.length;
        ta.setSelectionRange(pos, pos);
      });
    },
    [content]
  );

  const wrapSelection = useCallback(
    (wrapper: string, placeholder?: string) => {
      const ta = textareaRef.current;
      if (!ta) return;
      const start = ta.selectionStart;
      const end = ta.selectionEnd;
      const selected = ta.value.substring(start, end);
      const text = selected || placeholder || "";
      const newContent =
        content.substring(0, start) +
        wrapper.replace("$1", text) +
        content.substring(end);
      setContent(newContent);
    },
    [content]
  );

  /* ─── Image / Code callbacks ─── */
  const insertImage = (alt: string, url: string) => {
    const md = `![${alt}](${url})`;
    const ta = textareaRef.current;
    if (!ta) {
      setContent((c) => c + "\n" + md + "\n");
      return;
    }
    const start = ta.selectionStart;
    setContent(
      content.substring(0, start) + md + content.substring(ta.selectionEnd)
    );
  };

  const insertCodeBlock = (lang: string, code: string) => {
    const md = `\`\`\`${lang}\n${code}\n\`\`\``;
    const ta = textareaRef.current;
    if (!ta) {
      setContent((c) => c + "\n" + md + "\n");
      return;
    }
    const start = ta.selectionStart;
    setContent(
      content.substring(0, start) + md + content.substring(ta.selectionEnd)
    );
  };

  /* ─── Preview HTML ─── */
  const previewHtml = marked.parse(content) as string;

  /* ─── Auth guard ─── */
  if (!token) {
    return (
      <div className="p-8 text-center">
        <a href="/admin" className="text-blue-600 hover:underline">
          请先登录
        </a>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-zinc-50 dark:bg-zinc-950">
      {/* Sidebar */}
      <aside className="w-56 shrink-0 border-r border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-900">
        <h2 className="mb-6 text-lg font-bold">管理后台</h2>
        <nav className="flex flex-col gap-2">
          <a href="/admin" className="rounded-lg px-3 py-2 text-sm text-zinc-600 hover:bg-zinc-100 dark:text-zinc-400 dark:hover:bg-zinc-800">仪表盘</a>
          <a href="/admin/posts" className="rounded-lg px-3 py-2 text-sm text-zinc-600 hover:bg-zinc-100 dark:text-zinc-400 dark:hover:bg-zinc-800">文章管理</a>
          <a href="/admin/categories" className="rounded-lg px-3 py-2 text-sm text-zinc-600 hover:bg-zinc-100 dark:text-zinc-400 dark:hover:bg-zinc-800">分类管理</a>
          <a href="/admin/posts/new" className="rounded-lg bg-blue-50 px-3 py-2 text-sm font-medium text-blue-700 dark:bg-blue-900/30 dark:text-blue-400">+ 新建文章</a>
          <hr className="my-2 border-zinc-200 dark:border-zinc-700" />
          <a href="/" className="rounded-lg px-3 py-2 text-sm text-zinc-500">← 返回网站</a>
        </nav>
      </aside>

      {/* Editor */}
      <div className="flex-1 p-8">
        <h1 className="mb-6 text-2xl font-bold text-zinc-900 dark:text-zinc-100">
          {isEdit ? "编辑文章" : "新建文章"}
        </h1>

        {error && (
          <p className="mb-4 rounded-lg bg-red-50 p-3 text-sm text-red-600 dark:bg-red-900/30 dark:text-red-400">{error}</p>
        )}

        <form onSubmit={handleSubmit} className="max-w-4xl space-y-5">
          {/* Row 1: Title + Slug */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="mb-1 block text-sm font-medium text-zinc-700 dark:text-zinc-300">标题 *</label>
              <input
                type="text"
                value={title}
                onChange={(e) => { setTitle(e.target.value); if (!isEdit) setSlug(autoSlug(e.target.value)); }}
                className="w-full rounded-lg border border-zinc-300 px-3 py-2 text-sm dark:border-zinc-600 dark:bg-zinc-800 dark:text-zinc-100"
                required
              />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-zinc-700 dark:text-zinc-300">Slug</label>
              <input
                type="text"
                value={slug}
                onChange={(e) => setSlug(e.target.value)}
                className="w-full rounded-lg border border-zinc-300 px-3 py-2 text-sm font-mono dark:border-zinc-600 dark:bg-zinc-800 dark:text-zinc-100"
                required
              />
            </div>
          </div>

          {/* Row 2: Category + Date + Tags */}
          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="mb-1 block text-sm font-medium text-zinc-700 dark:text-zinc-300">分类</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full rounded-lg border border-zinc-300 px-3 py-2 text-sm dark:border-zinc-600 dark:bg-zinc-800 dark:text-zinc-100"
              >
                <option value="">选择分类...</option>
                {categories.map((c) => (<option key={c} value={c}>{c}</option>))}
              </select>
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-zinc-700 dark:text-zinc-300">日期</label>
              <input type="date" value={date} onChange={(e) => setDate(e.target.value)} className="w-full rounded-lg border border-zinc-300 px-3 py-2 text-sm dark:border-zinc-600 dark:bg-zinc-800 dark:text-zinc-100" />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-zinc-700 dark:text-zinc-300">标签（逗号分隔）</label>
              <input type="text" value={tagsInput} onChange={(e) => setTagsInput(e.target.value)} placeholder="Next.js, React, 部署" className="w-full rounded-lg border border-zinc-300 px-3 py-2 text-sm dark:border-zinc-600 dark:bg-zinc-800 dark:text-zinc-100" />
            </div>
          </div>

          {/* Row 3: Description */}
          <div>
            <label className="mb-1 block text-sm font-medium text-zinc-700 dark:text-zinc-300">描述</label>
            <input type="text" value={description} onChange={(e) => setDescription(e.target.value)} className="w-full rounded-lg border border-zinc-300 px-3 py-2 text-sm dark:border-zinc-600 dark:bg-zinc-800 dark:text-zinc-100" />
          </div>

          {/* Row 4: Content with toolbar */}
          <div>
            <div className="mb-1 flex items-center justify-between">
              <label className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
                正文 (Markdown)
              </label>
              <button
                type="button"
                onClick={() => setPreview(!preview)}
                className="text-xs font-medium text-blue-600 hover:underline dark:text-blue-400"
              >
                {preview ? "✏️ 编辑" : "👁 预览"}
              </button>
            </div>

            {/* ── Toolbar ── */}
            {!preview && (
              <div className="mb-2 flex flex-wrap items-center gap-0.5 rounded-lg border border-zinc-200 bg-white p-1 dark:border-zinc-700 dark:bg-zinc-800">
                <ToolBtn label="H2" title="二级标题" onClick={() => insertAtCursor("\n## ", "\n", "标题")} />
                <ToolBtn label="H3" title="三级标题" onClick={() => insertAtCursor("\n### ", "\n", "标题")} />
                <span className="mx-1 text-zinc-300 dark:text-zinc-600">|</span>
                <ToolBtn label="B" title="加粗" onClick={() => wrapSelection("**$1**", "加粗文字")} />
                <ToolBtn label="I" title="斜体" onClick={() => wrapSelection("*$1*", "斜体文字")} />
                <ToolBtn label="~~" title="删除线" onClick={() => wrapSelection("~~$1~~", "删除文字")} />
                <span className="mx-1 text-zinc-300 dark:text-zinc-600">|</span>
                <ToolBtn label="🔗" title="链接" onClick={() => wrapSelection("[$1](url)", "链接文字")} />
                <ToolBtn
                  label="🖼"
                  title="插入图片"
                  onClick={() => setShowImage(true)}
                />
                <ToolBtn
                  label="💻"
                  title="插入代码块"
                  onClick={() => setShowCode(true)}
                />
                <span className="mx-1 text-zinc-300 dark:text-zinc-600">|</span>
                <ToolBtn label="› 引用" title="引用块" onClick={() => insertAtCursor("\n> ", "\n", "引用文字")} />
                <ToolBtn label="• 列表" title="无序列表" onClick={() => insertAtCursor("\n- ", "\n", "列表项")} />
                <ToolBtn label="1. 列表" title="有序列表" onClick={() => insertAtCursor("\n1. ", "\n", "列表项")} />
                <ToolBtn label="---" title="分隔线" onClick={() => insertAtCursor("\n\n---\n\n", "")} />
              </div>
            )}

            {/* ── Content area ── */}
            {preview ? (
              <div
                className="prose prose-sm max-w-none min-h-[400px] rounded-lg border border-zinc-200 bg-white p-5 dark:prose-invert dark:border-zinc-600 dark:bg-zinc-800"
                dangerouslySetInnerHTML={{ __html: previewHtml }}
              />
            ) : (
              <textarea
                ref={textareaRef}
                value={content}
                onChange={(e) => setContent(e.target.value)}
                rows={22}
                className="w-full rounded-lg border border-zinc-300 px-4 py-3 text-sm font-mono leading-relaxed dark:border-zinc-600 dark:bg-zinc-800 dark:text-zinc-100"
                placeholder={`在这里写 Markdown 内容...

使用上方工具栏快速插入格式、图片和代码块。
也可以拖拽或粘贴图片 URL。`}
              />
            )}
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-2">
            <button
              type="submit"
              disabled={saving}
              className="rounded-lg bg-blue-600 px-6 py-2.5 text-sm font-medium text-white shadow-sm hover:bg-blue-700 disabled:opacity-50 transition-colors"
            >
              {saving ? "保存中..." : isEdit ? "更新文章" : "发布文章"}
            </button>
            <a
              href="/admin/posts"
              className="rounded-lg border border-zinc-300 px-6 py-2.5 text-sm font-medium hover:bg-zinc-50 dark:border-zinc-600 dark:hover:bg-zinc-800 transition-colors"
            >
              取消
            </a>
          </div>
        </form>
      </div>

      {/* Dialogs */}
      <ImageDialog open={showImage} onClose={() => setShowImage(false)} onInsert={insertImage} />
      <CodeDialog open={showCode} onClose={() => setShowCode(false)} onInsert={insertCodeBlock} />
    </div>
  );
}

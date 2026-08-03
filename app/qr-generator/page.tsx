"use client";

import Link from "next/link";
import { ChangeEvent, useEffect, useMemo, useState } from "react";
import * as QRCode from "qrcode";

type QrKind = "url" | "text" | "email" | "phone" | "sms" | "whatsapp" | "wifi" | "contact";
type FormState = Record<string, string>;

const kinds: Array<{ id: QrKind; label: string }> = [
  { id: "url", label: "Website URL" },
  { id: "text", label: "Plain text" },
  { id: "email", label: "Email" },
  { id: "phone", label: "Phone call" },
  { id: "sms", label: "SMS" },
  { id: "whatsapp", label: "WhatsApp" },
  { id: "wifi", label: "Wi-Fi" },
  { id: "contact", label: "Contact card" },
];

const resolutionPresets = [
  { label: "1×", size: 512, detail: "512 × 512" },
  { label: "2×", size: 1024, detail: "1024 × 1024" },
  { label: "3×", size: 1536, detail: "1536 × 1536" },
  { label: "HD", size: 2048, detail: "2048 × 2048" },
];

const defaults: Record<QrKind, FormState> = {
  url: { value: "https://docsprinthub.com" },
  text: { value: "" },
  email: { email: "", subject: "", body: "" },
  phone: { phone: "" },
  sms: { phone: "", message: "" },
  whatsapp: { phone: "", message: "" },
  wifi: { name: "", password: "", encryption: "WPA" },
  contact: { firstName: "", lastName: "", phone: "", email: "", organization: "", website: "" },
};

function cleanPhone(phone: string) {
  return phone.replace(/[^\d+]/g, "");
}

function buildContent(kind: QrKind, fields: FormState) {
  switch (kind) {
    case "url": {
      const value = fields.value.trim();
      return value && !/^https?:\/\//i.test(value) ? `https://${value}` : value;
    }
    case "text": return fields.value.trim();
    case "email": return fields.email ? `mailto:${fields.email}?subject=${encodeURIComponent(fields.subject ?? "")}&body=${encodeURIComponent(fields.body ?? "")}` : "";
    case "phone": return fields.phone ? `tel:${cleanPhone(fields.phone)}` : "";
    case "sms": return fields.phone ? `SMSTO:${cleanPhone(fields.phone)}:${fields.message ?? ""}` : "";
    case "whatsapp": return fields.phone ? `https://wa.me/${cleanPhone(fields.phone).replace("+", "")}?text=${encodeURIComponent(fields.message ?? "")}` : "";
    case "wifi": return fields.name ? `WIFI:T:${fields.encryption || "WPA"};S:${fields.name.replace(/([;,:\\])/g, "\\$1")};P:${fields.password.replace(/([;,:\\])/g, "\\$1")};;` : "";
    case "contact": {
      if (!fields.firstName && !fields.lastName && !fields.phone && !fields.email) return "";
      return ["BEGIN:VCARD", "VERSION:3.0", `N:${fields.lastName};${fields.firstName};;;`, `FN:${[fields.firstName, fields.lastName].filter(Boolean).join(" ")}`, fields.organization && `ORG:${fields.organization}`, fields.phone && `TEL:${fields.phone}`, fields.email && `EMAIL:${fields.email}`, fields.website && `URL:${fields.website}`, "END:VCARD"].filter(Boolean).join("\n");
    }
  }
}

function downloadBlob(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  link.remove();
  window.setTimeout(() => URL.revokeObjectURL(url), 500);
}

function Field({ label, value, onChange, type = "text", placeholder = "" }: { label: string; value: string; onChange: (value: string) => void; type?: string; placeholder?: string }) {
  return <label className="block"><span className="text-sm font-bold text-slate-800">{label}</span><input type={type} value={value} onChange={(event) => onChange(event.target.value)} placeholder={placeholder} className="mt-2 w-full rounded-xl border border-slate-300 px-4 py-3 text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-blue-600 focus:ring-2 focus:ring-blue-100" /></label>;
}

export default function QrGeneratorPage() {
  const [kind, setKind] = useState<QrKind>("url");
  const [fields, setFields] = useState<FormState>(defaults.url);
  const [foreground, setForeground] = useState("#111827");
  const [background, setBackground] = useState("#ffffff");
  const [size, setSize] = useState(1024);
  const [margin, setMargin] = useState(2);
  const [correction, setCorrection] = useState<QRCode.QRCodeErrorCorrectionLevel>("M");
  const [logo, setLogo] = useState<File | null>(null);
  const [preview, setPreview] = useState("");
  const [notice, setNotice] = useState("");
  const [error, setError] = useState("");

  const content = useMemo(() => buildContent(kind, fields), [kind, fields]);

  function updateField(key: string, value: string) {
    setFields((current) => ({ ...current, [key]: value }));
    setNotice("");
  }

  function selectKind(nextKind: QrKind) {
    setKind(nextKind);
    setFields(defaults[nextKind]);
    setError("");
    setNotice("");
  }

  function handleLogo(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0] ?? null;
    if (file && !["image/png", "image/jpeg"].includes(file.type)) {
      setError("Logo ke liye sirf PNG ya JPG choose kijiye.");
    } else {
      setLogo(file);
      setError("");
    }
    event.target.value = "";
  }

  useEffect(() => {
    let cancelled = false;
    if (!content) {
      return;
    }
    const options: QRCode.QRCodeToDataURLOptions = { width: size, margin, errorCorrectionLevel: logo ? "H" : correction, color: { dark: foreground, light: background } };
    QRCode.toDataURL(content, options).then(async (dataUrl) => {
      if (!logo) return dataUrl;
      const logoUrl = URL.createObjectURL(logo);
      const [qrImage, logoImage] = await Promise.all([loadImage(dataUrl), loadImage(logoUrl)]);
      URL.revokeObjectURL(logoUrl);
      const canvas = document.createElement("canvas");
      canvas.width = size;
      canvas.height = size;
      const context = canvas.getContext("2d");
      if (!context) throw new Error("QR canvas load nahi hua.");
      context.drawImage(qrImage, 0, 0, size, size);
      const logoSize = Math.round(size * 0.19);
      const position = (size - logoSize) / 2;
      context.fillStyle = background;
      context.fillRect(position - 10, position - 10, logoSize + 20, logoSize + 20);
      context.drawImage(logoImage, position, position, logoSize, logoSize);
      return canvas.toDataURL("image/png");
    }).then((dataUrl) => {
      if (!cancelled) {
        setPreview(dataUrl);
        setError("");
      }
    }).catch((caught) => {
      if (!cancelled) setError(caught instanceof Error ? caught.message : "QR generate nahi ho saka.");
    });
    return () => { cancelled = true; };
  }, [background, content, correction, foreground, logo, margin, size]);

  async function copyContent() {
    if (!content) return setError("Pehle QR content fill kijiye.");
    try {
      await navigator.clipboard.writeText(content);
      setNotice("QR content copy ho gaya.");
    } catch {
      setError("Copy allow nahi hua. Browser permission check kijiye.");
    }
  }

  async function downloadPng() {
    if (!content || !preview) return setError("Pehle QR content fill kijiye.");
    const blob = await (await fetch(preview)).blob();
    downloadBlob(blob, "docsprinthub-qr.png");
    setNotice("PNG download start ho gaya hai.");
  }

  async function downloadSvg() {
    if (!content) return setError("Pehle QR content fill kijiye.");
    const svg = await QRCode.toString(content, { type: "svg", width: size, margin, errorCorrectionLevel: correction, color: { dark: foreground, light: background } });
    downloadBlob(new Blob([svg], { type: "image/svg+xml" }), "docsprinthub-qr.svg");
    setNotice(logo ? "SVG download start ho gaya hai. SVG mein uploaded logo include nahi hota." : "SVG download start ho gaya hai.");
  }

  function reset() {
    setKind("url"); setFields(defaults.url); setForeground("#111827"); setBackground("#ffffff"); setSize(1024); setMargin(2); setCorrection("M"); setLogo(null); setNotice(""); setError("");
  }

  return <main className="min-h-screen bg-slate-50 text-slate-900">
    <header className="border-b border-slate-200 bg-white"><div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4 sm:px-8"><Link href="/" className="text-2xl font-bold tracking-tight sm:text-3xl">DocSprint<span className="text-blue-600">Hub</span></Link><Link href="/pdf-tools" className="rounded-xl bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-700 sm:px-5">PDF Tools</Link></div></header>
    <section className="border-b border-blue-100 bg-gradient-to-b from-blue-50 to-slate-50 px-5 py-8 text-center sm:px-8 sm:py-10"><p className="text-sm font-bold uppercase tracking-[0.2em] text-blue-700">DocSprintHub</p><h1 className="mt-2 text-4xl font-bold tracking-tight text-slate-950 sm:text-5xl">QR Generator</h1><p className="mx-auto mt-3 max-w-2xl text-base leading-7 text-slate-600 sm:text-lg">Create custom QR codes for links, payments, contact details, Wi-Fi aur more.</p></section>
    <section className="mx-auto grid max-w-7xl gap-7 px-5 py-7 sm:px-8 lg:grid-cols-[minmax(0,1.2fr)_minmax(330px,0.8fr)] lg:py-10">
      <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-7"><h2 className="text-2xl font-bold">QR content</h2><p className="mt-2 text-slate-600">QR type select karke information fill kijiye.</p>
        <div className="mt-6 flex flex-wrap gap-2">{kinds.map((option) => <button key={option.id} type="button" onClick={() => selectKind(option.id)} className={`rounded-lg px-3 py-2 text-sm font-semibold transition ${kind === option.id ? "bg-blue-600 text-white" : "bg-slate-100 text-slate-700 hover:bg-blue-50 hover:text-blue-700"}`}>{option.label}</button>)}</div>
        <div className="mt-6 grid gap-4 sm:grid-cols-2">
          {(kind === "url" || kind === "text") && <label className="block sm:col-span-2"><span className="text-sm font-bold text-slate-800">{kind === "url" ? "Website URL" : "Text"}</span><textarea value={fields.value} onChange={(event) => updateField("value", event.target.value)} rows={kind === "text" ? 5 : 2} placeholder={kind === "url" ? "https://example.com" : "Write text for the QR code"} className="mt-2 w-full rounded-xl border border-slate-300 px-4 py-3 text-slate-900 outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100" /></label>}
          {kind === "email" && <><Field label="Email address" type="email" value={fields.email} onChange={(value) => updateField("email", value)} placeholder="name@example.com" /><Field label="Subject" value={fields.subject} onChange={(value) => updateField("subject", value)} /><label className="block sm:col-span-2"><span className="text-sm font-bold text-slate-800">Message</span><textarea value={fields.body} onChange={(event) => updateField("body", event.target.value)} rows={4} className="mt-2 w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100" /></label></>}
          {(kind === "phone" || kind === "sms" || kind === "whatsapp") && <><Field label="Phone number with country code" value={fields.phone} onChange={(value) => updateField("phone", value)} placeholder="+919876543210" />{kind !== "phone" && <label className="block sm:col-span-2"><span className="text-sm font-bold text-slate-800">Message</span><textarea value={fields.message} onChange={(event) => updateField("message", event.target.value)} rows={4} className="mt-2 w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100" /></label>}</>}
          {kind === "wifi" && <><Field label="Wi-Fi name (SSID)" value={fields.name} onChange={(value) => updateField("name", value)} /><Field label="Wi-Fi password" type="password" value={fields.password} onChange={(value) => updateField("password", value)} /><label className="block"><span className="text-sm font-bold text-slate-800">Security type</span><select value={fields.encryption} onChange={(event) => updateField("encryption", event.target.value)} className="mt-2 w-full rounded-xl border border-slate-300 bg-white px-4 py-3 outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100"><option>WPA</option><option>WEP</option><option>nopass</option></select></label></>}
          {kind === "contact" && <><Field label="First name" value={fields.firstName} onChange={(value) => updateField("firstName", value)} /><Field label="Last name" value={fields.lastName} onChange={(value) => updateField("lastName", value)} /><Field label="Phone" value={fields.phone} onChange={(value) => updateField("phone", value)} /><Field label="Email" type="email" value={fields.email} onChange={(value) => updateField("email", value)} /><Field label="Organization" value={fields.organization} onChange={(value) => updateField("organization", value)} /><Field label="Website" value={fields.website} onChange={(value) => updateField("website", value)} /></>}
        </div>
        <div className="mt-8 border-t border-slate-200 pt-6"><h2 className="text-xl font-bold">Customize</h2><div className="mt-4 grid gap-4 sm:grid-cols-2"><label><span className="text-sm font-bold">QR color</span><input type="color" value={foreground} onChange={(event) => setForeground(event.target.value)} className="mt-2 block h-12 w-full cursor-pointer rounded-lg border border-slate-300 bg-white p-1" /></label><label><span className="text-sm font-bold">Background color</span><input type="color" value={background} onChange={(event) => setBackground(event.target.value)} className="mt-2 block h-12 w-full cursor-pointer rounded-lg border border-slate-300 bg-white p-1" /></label></div><div className="mt-5"><span className="text-sm font-bold text-slate-800">Download resolution</span><div className="mt-2 grid grid-cols-2 gap-2 sm:grid-cols-4">{resolutionPresets.map((preset) => <button key={preset.size} type="button" onClick={() => setSize(preset.size)} className={`rounded-xl border px-3 py-3 text-left transition ${size === preset.size ? "border-blue-600 bg-blue-50 ring-1 ring-blue-600" : "border-slate-200 hover:border-blue-300 hover:bg-slate-50"}`}><span className="block font-bold">{preset.label}</span><span className="mt-1 block text-xs text-slate-500">{preset.detail}</span></button>)}</div><p className="mt-2 text-xs text-slate-500">Selected: {size} × {size}px. Preview compact dikhega, download isi resolution mein hoga.</p></div><div className="mt-5 grid gap-4 sm:grid-cols-2"><label><span className="text-sm font-bold">Custom size: {size}px</span><input type="range" min="256" max="2048" step="32" value={size} onChange={(event) => setSize(Number(event.target.value))} className="mt-4 w-full accent-blue-600" /></label><label><span className="text-sm font-bold">Margin: {margin}</span><input type="range" min="0" max="6" value={margin} onChange={(event) => setMargin(Number(event.target.value))} className="mt-4 w-full accent-blue-600" /></label><label><span className="text-sm font-bold">Error correction</span><select value={correction} onChange={(event) => setCorrection(event.target.value as QRCode.QRCodeErrorCorrectionLevel)} className="mt-2 w-full rounded-xl border border-slate-300 bg-white px-4 py-3 outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100"><option value="L">Low</option><option value="M">Medium</option><option value="Q">Quartile</option><option value="H">High</option></select></label><label><span className="text-sm font-bold">Center logo (optional)</span><span className="mt-2 flex cursor-pointer items-center justify-center rounded-xl border border-dashed border-slate-300 px-4 py-3 text-sm font-semibold text-blue-700 hover:bg-blue-50">{logo ? logo.name : "Choose PNG or JPG"}<input type="file" accept="image/png,image/jpeg" className="sr-only" onChange={handleLogo} /></span></label></div></div>
      </section>
      <aside className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm lg:sticky lg:top-5 sm:p-7"><h2 className="text-2xl font-bold">Live preview</h2><p className="mt-2 text-sm leading-6 text-slate-600">QR scan karne se isi information par action hoga.</p><div className="mt-6 flex min-h-72 items-center justify-center rounded-2xl bg-slate-100 p-5">{content && preview ? <img src={preview} alt="Generated QR code preview" className="h-auto max-w-full rounded-lg shadow-sm" style={{ width: Math.min(size, 360) }} /> : <p className="text-center text-sm text-slate-500">QR preview ke liye required fields fill kijiye.</p>}</div>{content && <div className="mt-5 rounded-xl bg-slate-50 p-3 text-xs leading-5 text-slate-600 break-all">{content}</div>} {error && <p role="alert" className="mt-4 rounded-xl bg-red-50 p-3 text-sm font-medium text-red-800">{error}</p>}{notice && <p role="status" className="mt-4 rounded-xl bg-emerald-50 p-3 text-sm font-medium text-emerald-800">{notice}</p>}<div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-1"><button type="button" onClick={downloadPng} className="rounded-xl bg-blue-600 px-4 py-3 font-bold text-white hover:bg-blue-700">Download PNG</button><button type="button" onClick={downloadSvg} className="rounded-xl border border-blue-600 px-4 py-3 font-bold text-blue-700 hover:bg-blue-50">Download SVG</button><button type="button" onClick={copyContent} className="rounded-xl border border-slate-300 px-4 py-3 font-bold text-slate-700 hover:bg-slate-50">Copy content</button><button type="button" onClick={reset} className="rounded-xl border border-slate-300 px-4 py-3 font-bold text-slate-700 hover:bg-slate-50">Reset</button></div><p className="mt-5 text-xs leading-5 text-slate-500">Content aur customization aapke browser mein hi process hote hain.</p></aside>
    </section>
  </main>;
}

function loadImage(source: string) {
  return new Promise<HTMLImageElement>((resolve, reject) => {
    const image = new Image();
    image.onload = () => resolve(image);
    image.onerror = () => reject(new Error("Logo load nahi hua."));
    image.src = source;
  });
}

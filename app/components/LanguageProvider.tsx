"use client";

import { createContext, ReactNode, useContext, useEffect, useRef, useState } from "react";
import { ChevronDown, Globe2 } from "lucide-react";

type Language = "en" | "hi";
type LanguageContextValue = { language: Language; setLanguage: (language: Language) => void };

const LanguageContext = createContext<LanguageContextValue | null>(null);

const hindi: Record<string, string> = {
  "Home": "होम",
  "Get Started": "शुरू करें",
  "Resume Builder": "रेज़्यूमे बिल्डर",
  "Letter Writer": "पत्र लेखक",
  "PDF Tools": "पीडीएफ टूल्स",
  "Contact": "संपर्क",
  "Professional Document & PDF Tools": "पेशेवर दस्तावेज़ और पीडीएफ टूल्स",
  "Create, Edit & Manage Documents, PDFs and More — All in One Place.": "दस्तावेज़ और पीडीएफ बनाएं, संपादित करें और प्रबंधित करें — सब एक ही जगह।",
  "Explore Tools": "टूल्स देखें",
  "Free to Start": "शुरू करने के लिए निःशुल्क",
  "Hindi & English": "हिंदी और अंग्रेज़ी",
  "Mobile Friendly": "मोबाइल अनुकूल",
  "Easy to Use": "उपयोग में आसान",
  "Popular Tools": "लोकप्रिय टूल्स",
  "Why Choose DocSprintHub?": "DocSprintHub क्यों चुनें?",
  "Fast & Easy": "तेज़ और आसान",
  "Free Tools": "निःशुल्क टूल्स",
  "Secure Processing": "सुरक्षित प्रोसेसिंग",
  "Hindi & English Documents": "हिंदी और अंग्रेज़ी दस्तावेज़",
  "No Technical Skills Needed": "तकनीकी ज्ञान की आवश्यकता नहीं",
  "Your Complete Document Hub": "आपका संपूर्ण दस्तावेज़ केंद्र",
  "Tools": "टूल्स",
  "Company": "कंपनी",
  "About": "हमारे बारे में",
  "Privacy Policy": "गोपनीयता नीति",
  "Terms & Conditions": "नियम और शर्तें",
  "All Rights Reserved.": "सर्वाधिकार सुरक्षित।",
  "Merge PDFs": "पीडीएफ जोड़ें",
  "Split PDF": "पीडीएफ विभाजित करें",
  "Compress PDF": "पीडीएफ संपीड़ित करें",
  "Convert": "बदलें",
  "Organize": "व्यवस्थित करें",
  "Edit PDF": "पीडीएफ संपादित करें",
  "Protect": "सुरक्षित करें",
  "PDF to JPG / PNG": "पीडीएफ से JPG / PNG",
  "JPG / PNG to PDF": "JPG / PNG से पीडीएफ",
  "Add watermark": "वॉटरमार्क जोड़ें",
  "Add page numbers": "पेज नंबर जोड़ें",
  "Edit metadata": "मेटाडेटा संपादित करें",
  "Unlock PDF": "पीडीएफ अनलॉक करें",
  "PDF to Word": "पीडीएफ से वर्ड",
  "PDF to Excel": "पीडीएफ से एक्सेल",
  "OCR scanned file": "स्कैन की गई फ़ाइल का OCR",
  "Select files": "फ़ाइलें चुनें",
  "Add files": "फ़ाइलें जोड़ें",
  "Clear all": "सभी हटाएं",
  "Remove": "हटाएं",
  "Up": "ऊपर",
  "Down": "नीचे",
  "Drag": "खींचें",
  "Compression level": "संपीड़न स्तर",
  "High quality — larger file": "उच्च गुणवत्ता — बड़ी फ़ाइल",
  "Recommended — high quality": "अनुशंसित — उच्च गुणवत्ता",
  "Smallest file — lower quality": "सबसे छोटी फ़ाइल — कम गुणवत्ता",
  "Compression output note": "संपीड़न आउटपुट नोट",
  "Pages to process": "प्रोसेस करने के पेज",
  "Pages to delete": "हटाने के पेज",
  "New page order": "नया पेज क्रम",
  "Rotate clockwise": "घड़ी की दिशा में घुमाएं",
  "Image format": "इमेज फ़ॉर्मेट",
  "Watermark text": "वॉटरमार्क टेक्स्ट",
  "OCR language": "OCR भाषा",
  "English": "अंग्रेज़ी",
  "Hindi": "हिंदी",
  "QR Generator": "QR जनरेटर",
  "QR content": "QR सामग्री",
  "Customize": "अनुकूलित करें",
  "Live preview": "लाइव पूर्वावलोकन",
  "QR color": "QR रंग",
  "Background color": "पृष्ठभूमि रंग",
  "Download resolution": "डाउनलोड रिज़ॉल्यूशन",
  "Custom size": "कस्टम आकार",
  "Margin": "मार्जिन",
  "Error correction": "त्रुटि सुधार",
  "Center logo (optional)": "बीच का लोगो (वैकल्पिक)",
  "Download PNG": "PNG डाउनलोड करें",
  "Download SVG": "SVG डाउनलोड करें",
  "Copy content": "सामग्री कॉपी करें",
  "Reset": "रीसेट करें",
  "Website URL": "वेबसाइट URL",
  "Plain text": "सादा टेक्स्ट",
  "Phone call": "फोन कॉल",
  "Contact card": "संपर्क कार्ड",
  "Email address": "ईमेल पता",
  "Subject": "विषय",
  "Message": "संदेश",
  "Phone number with country code": "देश कोड सहित फोन नंबर",
  "Wi-Fi name (SSID)": "Wi-Fi नाम (SSID)",
  "Wi-Fi password": "Wi-Fi पासवर्ड",
  "Security type": "सुरक्षा प्रकार",
  "First name": "पहला नाम",
  "Last name": "उपनाम",
  "Organization": "संस्था",
  "Website": "वेबसाइट",
  "Cover Page Generator": "कवर पेज जनरेटर",
  "Cover page details": "कवर पेज विवरण",
  "Cover heading": "कवर शीर्षक",
  "Small heading": "छोटा शीर्षक",
  "Project / assignment title": "प्रोजेक्ट / असाइनमेंट शीर्षक",
  "Course / subject": "कोर्स / विषय",
  "Submitted by": "प्रस्तुतकर्ता",
  "Roll number": "रोल नंबर",
  "Submitted to": "प्रस्तुत किया गया",
  "Session / date": "सत्र / तारीख",
  "College / institute": "कॉलेज / संस्थान",
  "Institute logo (optional)": "संस्थान लोगो (वैकल्पिक)",
  "Choose PNG or JPG": "PNG या JPG चुनें",
  "Download A4 PDF": "A4 PDF डाउनलोड करें",
  "Download JPG": "JPG डाउनलोड करें",
  "Print A4": "A4 प्रिंट करें",
  "Live A4 preview": "लाइव A4 पूर्वावलोकन",
  "Academic Frame": "अकादमिक फ्रेम",
  "Modern Studio": "आधुनिक स्टूडियो",
  "Editorial": "संपादकीय",
  "Resume": "रेज़्यूमे",
  "Choose Your Resume Template": "अपना रेज़्यूमे टेम्पलेट चुनें",
  "Back to Home": "होम पर वापस जाएं",
  "Continue": "जारी रखें",
  "Preview Resume": "रेज़्यूमे देखें",
  "Export Resume": "रेज़्यूमे निर्यात करें",
  "Export as PDF": "PDF के रूप में निर्यात करें",
  "Export as JPG": "JPG के रूप में निर्यात करें",
  "Print Resume": "रेज़्यूमे प्रिंट करें",
  "Personal Details": "व्यक्तिगत विवरण",
  "Career Objective": "करियर उद्देश्य",
  "Education": "शिक्षा",
  "Experience": "अनुभव",
  "Skills": "कौशल",
  "Certificates": "प्रमाणपत्र",
  "Declaration": "घोषणा",
  "Language": "भाषा",
};

function translate(source: string, language: Language) {
  if (language === "en") return source;
  const text = source.trim();
  const translated = hindi[text];
  if (!translated) return source;
  return source.replace(text, translated);
}

export default function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguage] = useState<Language>(() => {
    if (typeof window === "undefined") return "en";
    const savedLanguage = window.localStorage.getItem("docsprinthub-language");
    return savedLanguage === "hi" || savedLanguage === "en" ? savedLanguage : "en";
  });
  const textSources = useRef(new WeakMap<Text, string>());
  const attributeSources = useRef(new WeakMap<HTMLElement, Record<string, string>>());

  useEffect(() => {
    window.localStorage.setItem("docsprinthub-language", language);
    document.documentElement.lang = language === "hi" ? "hi" : "en";

    const applyLanguage = () => {
      const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
      let node = walker.nextNode();
      while (node) {
        const textNode = node as Text;
        if (!textNode.parentElement?.closest("[data-no-translate]")) {
          const source = textSources.current.get(textNode) ?? textNode.nodeValue ?? "";
          textSources.current.set(textNode, source);
          const nextText = translate(source, language);
          if (textNode.nodeValue !== nextText) textNode.nodeValue = nextText;
        }
        node = walker.nextNode();
      }

      document.querySelectorAll<HTMLElement>("[placeholder], [title], [aria-label]").forEach((element) => {
        if (element.closest("[data-no-translate]")) return;
        const saved = attributeSources.current.get(element) ?? {};
        (["placeholder", "title", "aria-label"] as const).forEach((attribute) => {
          const current = element.getAttribute(attribute);
          if (!current) return;
          const source = saved[attribute] ?? current;
          saved[attribute] = source;
          const nextText = translate(source, language);
          if (current !== nextText) element.setAttribute(attribute, nextText);
        });
        attributeSources.current.set(element, saved);
      });
    };

    applyLanguage();
    const observer = new MutationObserver(applyLanguage);
    observer.observe(document.body, { childList: true, characterData: true, subtree: true });
    return () => observer.disconnect();
  }, [language]);

  return <LanguageContext.Provider value={{ language, setLanguage }}>{children}</LanguageContext.Provider>;
}

export function LanguageSelector({ variant = "dark" }: { variant?: "dark" | "light" }) {
  const languageContext = useContext(LanguageContext);
  const [isOpen, setIsOpen] = useState(false);

  if (!languageContext) return null;
  const { language, setLanguage } = languageContext;
  const selectLanguage = (nextLanguage: Language) => {
    setLanguage(nextLanguage);
    setIsOpen(false);
  };

  const isLight = variant === "light";
  return <div data-no-translate className="relative inline-block text-left">
    {isOpen && <div role="menu" aria-label="Choose language" className={`absolute left-0 z-20 mt-2 w-40 overflow-hidden rounded-lg border p-1 shadow-xl ${isLight ? "top-full border-slate-200 bg-white" : "bottom-full mb-2 border-slate-600 bg-slate-800"}`}>
      <button type="button" role="menuitemradio" aria-checked={language === "en"} onClick={() => selectLanguage("en")} className={`flex w-full items-center justify-between rounded-md px-3 py-2 text-sm font-medium transition ${language === "en" ? "bg-blue-600 text-white" : isLight ? "text-slate-700 hover:bg-slate-100" : "text-slate-100 hover:bg-slate-700"}`}><span>English (India)</span><span aria-hidden="true">{language === "en" ? "✓" : ""}</span></button>
      <button type="button" role="menuitemradio" aria-checked={language === "hi"} onClick={() => selectLanguage("hi")} className={`flex w-full items-center justify-between rounded-md px-3 py-2 text-sm font-medium transition ${language === "hi" ? "bg-blue-600 text-white" : isLight ? "text-slate-700 hover:bg-slate-100" : "text-slate-100 hover:bg-slate-700"}`}><span>Hindi (India)</span><span aria-hidden="true">{language === "hi" ? "✓" : ""}</span></button>
    </div>}
    <button type="button" aria-label="Choose language" aria-expanded={isOpen} onClick={() => setIsOpen((open) => !open)} className={`inline-flex items-center gap-2 rounded-md px-1 py-1 text-sm font-semibold transition ${isLight ? "text-slate-700 hover:text-blue-700" : "text-slate-200 hover:text-white"}`}><Globe2 size={21} strokeWidth={2.2} aria-hidden="true" /><span>{language === "en" ? "English (India)" : "Hindi (India)"}</span><ChevronDown size={15} strokeWidth={2.5} aria-hidden="true" /></button>
  </div>;
}

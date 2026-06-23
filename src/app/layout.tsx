import type { Metadata, Viewport } from "next"
import { Zain } from "next/font/google"
import Script from "next/script"
import "./globals.css"
import { AccentColorProvider } from "@/components/providers/accent-color-provider"
import { DEFAULT_ACCENT_COLOR } from "@/lib/accent-color"

// Self-hosted at build time via next/font — no runtime request, works
// under output: "export". Zain supports Arabic + Latin in one family so
// numerals (ltr-numerals spans) render in the same typeface as the text.
const zain = Zain({
  subsets: ["arabic", "latin"],
  weight: ["300", "400", "700", "800", "900"],
  variable: "--font-zain",
})

export const metadata: Metadata = {
  title: "مطبخنا",
  description:
    "وصفات عراقية بيتية أصيلة، بطريقة سهلة وواضحة لكل أفراد العائلة.",
  icons: {
    icon: "/logo.svg",
    shortcut: "/logo.svg",
    apple: "/logo.svg",
  },
}

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  themeColor: "#f5f5f7",
}


const ACCENT_INIT_SCRIPT = `
(function() {
  try {
    var DEFAULT = '${DEFAULT_ACCENT_COLOR}';
    var color = localStorage.getItem('accent_color') || DEFAULT;
    var r = parseInt(color.slice(1, 3), 16);
    var g = parseInt(color.slice(3, 5), 16);
    var b = parseInt(color.slice(5, 7), 16);
    var toLinear = function (c) {
      var s = c / 255;
      return s <= 0.03928 ? s / 12.92 : Math.pow((s + 0.055) / 1.055, 2.4);
    };
    var lum = 0.2126 * toLinear(r) + 0.7152 * toLinear(g) + 0.0722 * toLinear(b);
    var foreground = lum > 0.5 ? '#1d1d1f' : '#ffffff';
    var root = document.documentElement;
    root.style.setProperty('--accent-color', color);
    root.style.setProperty('--accent-foreground', foreground);
    root.style.setProperty('--accent-color-10', 'rgba(' + r + ',' + g + ',' + b + ',0.1)');
    root.style.setProperty('--accent-color-15', 'rgba(' + r + ',' + g + ',' + b + ',0.15)');
    root.style.setProperty('--accent-color-20', 'rgba(' + r + ',' + g + ',' + b + ',0.2)');
    root.style.setProperty('--accent-color-30', 'rgba(' + r + ',' + g + ',' + b + ',0.3)');
    root.style.setProperty('--accent-color-50', 'rgba(' + r + ',' + g + ',' + b + ',0.5)');
    root.style.setProperty('--accent-color-80', 'rgba(' + r + ',' + g + ',' + b + ',0.8)');
  } catch (e) {}
})();
`

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    // dir="rtl" + lang="ar" set once, here — never per-page. This is an
    // Arabic-only static site, not a multi-locale one. See CLAUDE.md §5.
    <html
      lang="ar"
      dir="rtl"
      className={`h-full antialiased ${zain.variable}`}
      suppressHydrationWarning
    >
      <head>
        <Script
          id="accent-init"
          strategy="beforeInteractive"
          dangerouslySetInnerHTML={{ __html: ACCENT_INIT_SCRIPT }}
        />
      </head>
      <body className="min-h-full flex flex-col bg-background text-foreground">
        <AccentColorProvider>{children}</AccentColorProvider>
      </body>
    </html>
  )
}

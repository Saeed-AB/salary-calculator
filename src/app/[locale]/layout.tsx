import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "../globals.css";
import { NextIntlClientProvider, useTranslations } from "next-intl";
import { ThemeProvider } from "next-themes";
import { getMessages } from "next-intl/server";
import { setRequestLocale } from "next-intl/server";
import { LocaleSwitcher } from "@/components/locale-switcher";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

type PageProps = { params: Promise<{ locale: string }> };

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { locale } = await params;
  const title = locale === "ar" ? "حاسبة الراتب" : "Salary Calculator";

  return {
    title: {
      default: title,
      template: `%s | ${title}`,
    },
    description:
      locale === "ar"
        ? "حساب الراتب مع ساعات العمل الإضافية والخصومات والتأمينات الاجتماعية"
        : "Calculate salary with overtime, deductions and GOSI",
    openGraph: {
      type: "website",
      title,
    },
    appleWebApp: { title },
    twitter: {
      title,
    },
  };
}

export default async function LocaleLayout({
  children,
  params,
}: Readonly<{
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}>) {
  const { locale } = await params;
  const messages = await getMessages();
  const direction = locale === "ar" ? "rtl" : "ltr";
  setRequestLocale(locale);

  return (
    <html lang={locale} dir={direction} suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <ThemeProvider attribute="class" enableSystem defaultTheme="system">
          <NextIntlClientProvider locale={locale} messages={messages}>
            <PageHeader />
            {children}
          </NextIntlClientProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}

function PageHeader() {
  const t = useTranslations();
  return (
    <header className="w-full border-b">
      <div className="container mx-auto max-w-5xl p-4 flex items-center justify-between">
        <h1 className="text-lg font-semibold">{t("app.title")}</h1>
        <LocaleSwitcher />
      </div>
    </header>
  );
}

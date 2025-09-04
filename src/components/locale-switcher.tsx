"use client";
import {useTranslations, useLocale} from "next-intl";
import {usePathname, useRouter} from "next/navigation";
import {useTransition} from "react";
import {Select, SelectTrigger, SelectContent, SelectItem, SelectValue} from "@/components/ui/select";

export function LocaleSwitcher() {
  const router = useRouter();
  const pathname = usePathname();
  const locale = useLocale();
  const t = useTranslations("app");
  const [isPending, startTransition] = useTransition();

  const changeLanguage = (lng: string) => {
    document.cookie = `NEXT_LOCALE=${lng};path=/`;
    startTransition(() => {
      router.replace(pathname.replace(`/${locale}`, `/${lng}`));
    });
    router.refresh();
  };

  return (
    <Select disabled={isPending} value={locale} onValueChange={(loc) => changeLanguage(loc)}>
      <SelectTrigger className="w-[120px]">
        <SelectValue placeholder={t("language")} />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="en">English</SelectItem>
        <SelectItem value="ar">العربية</SelectItem>
      </SelectContent>
    </Select>
  );
}



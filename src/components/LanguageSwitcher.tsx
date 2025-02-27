import { useRouter } from 'next/router';
import Link from 'next/link';

export default function LanguageSwitcher() {
  const router = useRouter();

  const { locales, locale: activeLocale } = router;

  const otherLocales = locales?.filter((locale) => locale !== activeLocale);

  return (
    <div className="flex space-x-4">
      {otherLocales?.map((locale) => {
        const { pathname, query, asPath } = router;
        return (
          <Link
            key={locale}
            href={{ pathname, query }}
            as={asPath}
            locale={locale}
            className="text-blue-600 hover:underline"
          >
            {locale === 'en' ? '🇬🇧 English' : '🇫🇷 Français'}
          </Link>
        );
      })}
    </div>
  );
}

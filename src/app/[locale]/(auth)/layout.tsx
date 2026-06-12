import { envConfigs } from '@/config';
import {
  BrandLogo,
  LocaleSelector,
  ThemeToggler,
} from '@/shared/blocks/common';

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="relative flex min-h-screen w-screen items-center justify-center bg-black dark overflow-hidden">
      {/* Background themed effect */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-linear-to-br from-purple-900/20 via-blue-900/20 to-black" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(120,119,198,0.1),transparent_50%)]" />
      </div>

      <div className="absolute top-4 left-4 z-10">
        <BrandLogo
          brand={{
            title: envConfigs.app_name,
            logo: {
              src: envConfigs.app_logo,
              alt: envConfigs.app_name,
            },
            url: '/',
            target: '_self',
            className: '',
          }}
        />
      </div>
      <div className="absolute top-4 right-4 z-10 flex items-center gap-4">
        <ThemeToggler />
        <LocaleSelector type="button" />
      </div>
      <div className="relative z-10 w-full px-4">{children}</div>
    </div>
  );
}

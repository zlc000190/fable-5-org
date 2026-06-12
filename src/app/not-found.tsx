import Image from 'next/image';
import Link from 'next/link';

import { envConfigs } from '@/config';
import { SmartIcon } from '@/shared/blocks/common/smart-icon';
import { Button } from '@/shared/components/ui/button';

export default function NotFoundPage() {
  return (
    <div className="relative flex h-screen flex-col items-center justify-center gap-4 bg-black text-white dark overflow-hidden">
      {/* Background themed effect */}
      <div className="absolute inset-0 z-0 text-white">
        <div className="absolute inset-0 bg-linear-to-br from-purple-900/20 via-blue-900/20 to-black" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(120,119,198,0.1),transparent_50%)]" />
      </div>

      <div className="relative z-10 flex flex-col items-center justify-center gap-4">
        <Image
          src={envConfigs.app_logo}
          alt={envConfigs.app_name}
          width={80}
          height={80}
          className="rounded-full shadow-2xl"
        />
        <h1 className="text-2xl font-normal opacity-90">Page not found</h1>
        <Button asChild className="mt-4 rounded-full px-8 bg-primary text-primary-foreground hover:opacity-90">
          <Link href="/">
            <SmartIcon name="ArrowLeft" className="size-4" />
            <span>Back to Home</span>
          </Link>
        </Button>
      </div>
    </div>
  );
}

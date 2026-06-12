'use client';

import { useEffect, useRef, useState } from 'react';
import { Fragment } from 'react/jsx-runtime';
import { Coins, LayoutDashboard, Loader2, LogOut, User } from 'lucide-react';
import { useTranslations } from 'next-intl';

import { authClient, signOut, useSession } from '@/core/auth/client';
import { Link, useRouter } from '@/core/i18n/navigation';
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from '@/shared/components/ui/avatar';
import { Button } from '@/shared/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/shared/components/ui/dropdown-menu';
import { useAppContext } from '@/shared/contexts/app';
import { cn } from '@/shared/lib/utils';
import { User as UserType } from '@/shared/models/user';
import { NavItem, UserNav } from '@/shared/types/blocks/common';

import { SmartIcon } from '../common/smart-icon';
import { SignModal } from './sign-modal';

function extractSessionUser(data: any): UserType | null {
  const u = data?.user ?? data?.data?.user ?? null;
  return u && typeof u === 'object' ? (u as UserType) : null;
}

export function SignUser({
  isScrolled,
  signButtonSize = 'sm',
  userNav,
}: {
  isScrolled?: boolean;
  signButtonSize?: 'default' | 'sm' | 'lg' | 'icon';
  userNav?: UserNav;
}) {
  const t = useTranslations('common.sign');
  const router = useRouter();

  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, []);

  // get app context values
  const {
    configs,
    fetchConfigs,
    setIsShowSignModal,
    isCheckSign,
    setIsCheckSign,
    user,
    setUser,
    fetchUserInfo,
    showOneTap,
  } = useAppContext();

  // get session
  const { data: session, isPending } = useSession();
  const sessionUser = extractSessionUser(session);
  const displayUser = (user as UserType | null) ?? sessionUser;

  // In dev (React StrictMode) effects can run twice; ensure we don't spam getSession().
  const didFallbackSyncRef = useRef(false);

  // one tap initialized
  const oneTapInitialized = useRef(false);

  useEffect(() => {
    fetchConfigs();
  }, []);

  // set is check sign
  useEffect(() => {
    setIsCheckSign(isPending);
  }, [isPending]);

  // show one tap if not initialized
  useEffect(() => {
    if (
      configs &&
      configs.google_client_id &&
      configs.google_one_tap_enabled === 'true' &&
      !session &&
      !isPending &&
      !oneTapInitialized.current
    ) {
      oneTapInitialized.current = true;
      showOneTap(configs);
    }
  }, [configs, session, isPending]);

  // set user
  useEffect(() => {
    const currentUserId = user?.id;
    const sessionUserId = (sessionUser as any)?.id;

    if (sessionUser && sessionUserId !== currentUserId) {
      setUser(sessionUser as UserType);
      fetchUserInfo();
    } else if (!sessionUser && currentUserId && !isPending) {
      // Only clear user when session is definitively resolved (not pending).
      // This prevents a race where fetchUserInfo() sets user but useSession
      // hasn't re-fetched yet, which would incorrectly clear the user.
      setUser(null);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sessionUser?.id, (sessionUser as any)?.email, user?.id, isPending]);

  // Fallback: if the session cookie is present but useSession lags, do a single refresh.
  useEffect(() => {
    if (typeof window === 'undefined') return;
    if (didFallbackSyncRef.current) return;
    // Only run when useSession is done but still no user.
    if (isPending) return;
    if (sessionUser || user) return;

    didFallbackSyncRef.current = true;
    void (async () => {
      try {
        const res: any = await authClient.getSession();
        const fresh = extractSessionUser(res?.data ?? res);
        if (fresh?.id) {
          setUser(fresh);
          fetchUserInfo();
        }
      } catch {
        // ignore
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isPending, sessionUser, user?.id]);

  return (
    <>
      {isCheckSign || !mounted ? (
        <div>
          <Loader2 className="size-4 animate-spin" />
        </div>
      ) : displayUser ? (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              className="relative h-10 w-10 rounded-full p-0"
            >
              <Avatar className="ring-2 ring-white/10 transition-all duration-300 hover:ring-primary/50">
                <AvatarImage
                  src={displayUser.image || ''}
                  alt={displayUser.name || ''}
                />
                <AvatarFallback className="bg-linear-to-br from-[#9c40ff] to-[#8fdfff] text-white font-bold uppercase">
                  {(displayUser.name || displayUser.email || 'U').charAt(0)}
                </AvatarFallback>
              </Avatar>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="dark bg-black/95 border-white/10 text-white backdrop-blur-xl min-w-[160px] p-0 overflow-hidden rounded-xl">
            {/* User Name */}
            <div className="px-4 py-3 text-center border-b border-white/10">
              <span className="text-sm font-medium opacity-90">{displayUser.name}</span>
            </div>

            {/* User Center / Activity */}
            <DropdownMenuItem asChild className="focus:bg-white/10 focus:text-white cursor-pointer px-4 py-3 justify-center border-b border-white/10 rounded-none">
              <Link href="/app/video-generator">
                <span className="text-sm">{t('user_center_title')}</span>
              </Link>
            </DropdownMenuItem>

            {/* Admin System (if admin) */}
            {displayUser.isAdmin && (
              <DropdownMenuItem asChild className="focus:bg-white/10 focus:text-white cursor-pointer px-4 py-3 justify-center border-b border-white/10 rounded-none">
                <Link href="/admin">
                  <span className="text-sm">{t('admin_title')}</span>
                </Link>
              </DropdownMenuItem>
            )}

            {/* Sign Out */}
            <DropdownMenuItem
              className="flex w-full cursor-pointer justify-center px-4 py-3 rounded-none focus:bg-white/10 focus:text-white"
              onClick={() =>
                signOut({
                  fetchOptions: {
                    onSuccess: () => {
                      router.push('/');
                    },
                  },
                })
              }
            >
              <span className="text-sm">{t('sign_out_title')}</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      ) : (
        <div className="flex w-full flex-col space-y-3 sm:flex-row sm:gap-3 sm:space-y-0 md:w-fit">
          <Button
            asChild
            size={signButtonSize}
            className={cn(
              'rounded-full px-6 bg-primary text-primary-foreground hover:opacity-90 font-semibold shadow-lg cursor-pointer transition-all',
              isScrolled && 'lg:hidden'
            )}
            onClick={() => setIsShowSignModal(true)}
          >
            <span>{t('sign_in_title')}</span>
          </Button>
          <SignModal />
        </div>
      )}
    </>
  );
}

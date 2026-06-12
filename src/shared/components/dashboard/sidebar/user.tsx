"use client";

import { useEffect } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/shared/components/ui/avatar";
import { ChevronsUpDown, LogOut } from "lucide-react";
import { Link } from "@/core/i18n/navigation";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/shared/components/ui/dropdown-menu";
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarTrigger,
  useSidebar,
} from "@/shared/components/ui/sidebar";
import Icon from "@/shared/components/icon";

import { Button } from "@/shared/components/ui/button";
import { signOut, useSession } from "@/core/auth/client";
import { useAppContext } from "@/shared/contexts/app";
import { useTranslations } from "next-intl";
import { Account } from "@/shared/types/blocks/base";
import { Fragment } from "react";

export default function SidebarUser({ account }: { account?: Account }) {
  const t = useTranslations('common');

  const { user, setUser, fetchUserInfo, setIsShowSignModal } = useAppContext();
  const { isMobile, open } = useSidebar();
  const { data: session } = useSession();

  // Sync session with AppContext on client side
  useEffect(() => {
    const sessionUser = session?.user;
    const currentUserId = user?.id;
    const sessionUserId = sessionUser?.id as string | undefined;

    if (sessionUser && sessionUserId !== currentUserId) {
      setUser(sessionUser as any);
      fetchUserInfo();
    } else if (!sessionUser && currentUserId) {
      setUser(null);
    }
  }, [session?.user?.id, user?.id, setUser, fetchUserInfo]);

  return (
    <>
      {user ? (
        <SidebarMenu className="gap-4">
          {!open && (
            <SidebarMenuItem>
              <SidebarMenuButton className="cursor-pointer" asChild>
                <SidebarTrigger />
              </SidebarMenuButton>
            </SidebarMenuItem>
          )}
          <SidebarMenuItem>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <SidebarMenuButton
                  size="lg"
                  className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
                >
                  <Avatar className="h-8 w-8 rounded-lg">
                    <AvatarImage src={user?.image || ''} alt={user?.name || ''} />
                    <AvatarFallback className="rounded-lg">CN</AvatarFallback>
                  </Avatar>
                  <div className="grid flex-1 text-left text-sm leading-tight">
                    <span className="truncate font-semibold">
                      {user.name}
                    </span>
                    <span className="truncate text-xs">{user.email}</span>
                  </div>
                  <ChevronsUpDown className="ml-auto size-4" />
                </SidebarMenuButton>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                className="w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-lg bg-background"
                side={isMobile ? "bottom" : "right"}
                align="end"
                sideOffset={4}
              >
                <DropdownMenuLabel className="p-0 font-normal">
                  <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                    <Avatar className="h-8 w-8 rounded-lg">
                      <AvatarImage
                        src={user?.image || ''}
                        alt={user?.name || ''}
                      />
                      <AvatarFallback className="rounded-lg">CN</AvatarFallback>
                    </Avatar>
                    <div className="grid flex-1 text-left text-sm leading-tight">
                      <span className="truncate font-semibold">
                        {user?.name}
                      </span>
                      <span className="truncate text-xs">{user?.email}</span>
                    </div>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuGroup>
                  {account?.items?.map((item, index) => (
                    <Fragment key={index}>
                      <DropdownMenuItem className="cursor-pointer">
                        <Link
                          href={item.url as any}
                          target={item.target}
                          className="w-full flex items-center gap-2"
                        >
                          {item.icon && <Icon name={item.icon} />}
                          {item.title}
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                    </Fragment>
                  ))}
                  <DropdownMenuItem
                    className="cursor-pointer"
                    onClick={() => signOut()}
                  >
                    <LogOut />
                    {t("user.sign_out")}
                  </DropdownMenuItem>
                </DropdownMenuGroup>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarMenuItem>
        </SidebarMenu>
      ) : (
        <>
          {open ? (
            <div className="flex justify-center items-center h-full px-4 py-4">
              <Button className="w-full" onClick={() => setIsShowSignModal(true)}>
                {t("user.sign_in")}
              </Button>
            </div>
          ) : (
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton className="cursor-pointer" asChild>
                  <SidebarTrigger />
                </SidebarMenuButton>
              </SidebarMenuItem>
              {/* <SidebarMenuItem>
                <SidebarMenuButton
                  className="cursor-pointer"
                    onClick={() => setShowSignModal(true)}
                  asChild
                >
                  <User />
                </SidebarMenuButton>
              </SidebarMenuItem> */}
            </SidebarMenu>
          )}
        </>
      )}
    </>
  );
}

import DashboardLayout from '@/shared/components/dashboard/layout'
import { ReactNode } from 'react'
import { Sidebar } from '@/shared/types/blocks/sidebar'
import { getUserInfo } from '@/shared/models/user'
import { redirect } from '@/core/i18n/navigation'
import { getTranslations } from 'next-intl/server'
import Feedback from '@/shared/blocks/feedback'

export default async function AppLayout({
  children,
  params,
}: {
  children: ReactNode
  params: Promise<{ locale: string }>
}) {
  const t = await getTranslations('common')
  const videoT = await getTranslations('video')
  const userInfo = await getUserInfo()
  const locale = (await params).locale

  if (!userInfo || !userInfo.email) {
    redirect({ href: '/sign-in', locale })
  }

  const projectName = process.env.NEXT_PUBLIC_APP_NAME || 'Hailuo AI'

  const sidebar: Sidebar = {
    brand: {
      title: projectName,
      logo: {
        src: '/logo.png',
        alt: projectName,
      },
      url: '/app/video-generator',
    },
    nav: {
      items: [
        {
          title: videoT('text_to_video.form.generate_button') || 'Video Generator',
          url: '/app/video-generator',
          icon: 'RiVideoLine',
        },
        {
          title: videoT('text_to_video.gallery.title') || 'My Videos',
          url: '/app/my-videos',
          icon: 'RiHistoryLine',
        },
        {
          title: t('user.my_orders'),
          url: '/app/my-orders',
          icon: 'RiOrderPlayLine',
          is_active: false,
        },
        {
          title: t('my_credits.title'),
          url: '/app/my-credits',
          icon: 'RiBankCardLine',
          is_active: false,
        },
        ...(userInfo?.email && process.env.ADMIN_EMAILS?.split(',')?.includes(userInfo.email)
          ? [
              {
                title: t('user.admin_system'),
                url: '/admin/users',
                icon: 'RiUserLine',
              },
            ]
          : []),
      ],
    },
    bottomNav: {
      items: [],
    },
    social: {
      items: [
        {
          title: t('nav.home'),
          url: '/',
          target: '_blank',
          icon: 'RiHomeLine',
        },
      ],
    },
    account: {
      items: [
        {
          title: t('nav.home'),
          url: '/',
          icon: 'RiHomeLine',
          target: '_blank',
        },
        {
          title: t('nav.pricing'),
          url: '/pricing',
          icon: 'RiMoneyDollarBoxLine',
          target: '_blank',
        },
      ],
    },
  }

  return (
    <DashboardLayout sidebar={sidebar}>
      {children}
      <Feedback />
    </DashboardLayout>
  )
}

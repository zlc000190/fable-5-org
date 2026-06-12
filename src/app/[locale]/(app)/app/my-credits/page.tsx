import { getCredits } from '@/shared/models/credit'
import { getUserInfo, getUserCredits } from '@/shared/models/user'
import { getTranslations } from 'next-intl/server'
import { redirect } from 'next/navigation'
import moment from 'moment'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/shared/components/ui/table"
import { Button } from "@/shared/components/ui/button"
import { Separator } from "@/shared/components/ui/separator"
import Link from 'next/link'
import { CoinsIcon } from 'lucide-react'

export default async function MyCreditsPage() {
  const t = await getTranslations('common')
  const user = await getUserInfo()

  if (!user?.id) {
    redirect('/sign-in')
  }

  const data = await getCredits({ userId: user.id, page: 1, limit: 100 })
  const userCredits = await getUserCredits(user.id)

  return (
    <div className="container mx-auto p-4 space-y-6">
      <div className="space-y-6">
        <div>
          <h3 className="text-lg font-medium">{t('my_credits.title')}</h3>
          <p className="text-sm text-muted-foreground mt-2">
            {t('my_credits.left_tip', { left_credits: userCredits.remainingCredits })}
          </p>
        </div>
        
        <div>
           <Link href="/pricing" target="_blank">
             <Button className="gap-2 bg-[#6366f1] hover:bg-[#5558dd] text-white border-0">
                <CoinsIcon className="w-4 h-4" />
                {t('my_credits.recharge')}
             </Button>
           </Link>
        </div>
        
        <Separator className="bg-white/10" />
        
        <div className="rounded-md">
          <Table>
            <TableHeader>
              <TableRow className="hover:bg-transparent border-b border-white/10">
                <TableHead className="text-muted-foreground font-medium pl-0 h-10">{t('my_credits.table.trans_no')}</TableHead>
                <TableHead className="text-muted-foreground font-medium h-10">{t('my_credits.table.trans_type')}</TableHead>
                <TableHead className="text-muted-foreground font-medium h-10">{t('my_credits.table.credits')}</TableHead>
                <TableHead className="text-muted-foreground font-medium h-10">{t('my_credits.table.updated_at')}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data && data.length > 0 ? (
                data.map((item) => (
                  <TableRow key={item.id} className="hover:bg-muted/5 border-b border-white/5 data-[state=selected]:bg-muted">
                    <TableCell className="font-medium font-mono text-xs text-muted-foreground pl-0 py-4">{item.transactionNo}</TableCell>
                    <TableCell className="py-4">{item.transactionType}</TableCell>
                    <TableCell className={`py-4 ${item.credits > 0 ? "text-green-500 font-bold" : ""}`}>
                      {item.credits > 0 ? `+${item.credits}` : item.credits}
                    </TableCell>
                    <TableCell className="text-muted-foreground py-4">
                      {moment(item.createdAt).format('YYYY-MM-DD HH:mm:ss')}
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow className="hover:bg-transparent border-b border-white/5">
                  <TableCell colSpan={4} className="h-24 text-center text-muted-foreground">
                    {t('my_credits.no_credits')}
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  )
}

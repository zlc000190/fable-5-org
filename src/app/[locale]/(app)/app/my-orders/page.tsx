import { getOrders } from '@/shared/models/order'
import { getUserInfo } from '@/shared/models/user'
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
import { Separator } from "@/shared/components/ui/separator"

export default async function MyOrdersPage() {
  const t = await getTranslations('common')
  const user = await getUserInfo()

  if (!user?.id) {
    redirect('/sign-in')
  }

  // Get orders by userId
  const orders = await getOrders({ userId: user.id, page: 1, limit: 100 })

  return (
    <div className="container mx-auto p-4 space-y-6">
      <div className="space-y-6">
        <div>
          <h3 className="text-lg font-medium">{t('my_orders.title')}</h3>
          <p className="text-sm text-muted-foreground mt-2">
            {t('my_orders.description')}
          </p>
        </div>
        
        <Separator className="bg-white/10" />
        
        <div className="rounded-md">
          <Table>
            <TableHeader>
              <TableRow className="hover:bg-transparent border-b border-white/10">
                <TableHead className="text-muted-foreground font-medium pl-0 h-10">{t('my_orders.table.order_no')}</TableHead>
                <TableHead className="text-muted-foreground font-medium h-10">{t('my_orders.table.product_name')}</TableHead>
                <TableHead className="text-muted-foreground font-medium h-10">{t('my_orders.table.amount')}</TableHead>
                <TableHead className="text-muted-foreground font-medium h-10">{t('my_orders.table.status')}</TableHead>
                <TableHead className="text-muted-foreground font-medium h-10">{t('my_orders.table.paid_at')}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {orders && orders.length > 0 ? (
                orders.map((item) => (
                  <TableRow key={item.id} className="hover:bg-muted/5 border-b border-white/5">
                    <TableCell className="font-medium font-mono text-xs text-muted-foreground pl-0 py-4">{item.orderNo}</TableCell>
                    <TableCell className="py-4">{item.productName || item.description || '-'}</TableCell>
                    <TableCell className="py-4">
                      {item.currency?.toUpperCase() === 'CNY' ? '¥' : '$'} {(item.amount / 100).toFixed(2)}
                    </TableCell>
                    <TableCell className="py-4">
                       <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                         item.status === 'paid' ? 'bg-green-500/10 text-green-400 border border-green-500/20' : 
                         item.status === 'pending' ? 'bg-yellow-500/10 text-yellow-400 border border-yellow-500/20' :
                         'bg-gray-500/10 text-gray-400 border border-gray-500/20'
                       }`}>
                         {item.status}
                       </span>
                    </TableCell>
                    <TableCell className="text-muted-foreground py-4">
                      {item.paidAt ? moment(item.paidAt).format('YYYY-MM-DD HH:mm:ss') : moment(item.createdAt).format('YYYY-MM-DD HH:mm:ss')}
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow className="hover:bg-transparent border-b border-white/5">
                  <TableCell colSpan={5} className="h-24 text-center text-muted-foreground">
                    {t('my_orders.no_orders')}
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

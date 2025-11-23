import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { formatPrice } from '@/lib/utils'

export interface InvoiceAsideProps {
  invoice: { id?: string | number, order_id?: string | number, amount?: number, invoice_text?: string | null } | null
  total: number
}

export const InvoiceAside: React.FC<InvoiceAsideProps> = ({ invoice, total }) => {
  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>Invoice</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-sm">Invoice ID: {String(invoice?.id ?? invoice?.order_id ?? '—')}</div>
          <div className="text-sm mt-2">Amount: {formatPrice(Number(invoice?.amount ?? total ?? 0))}</div>
          {invoice?.invoice_text && (
            <pre className="mt-3 whitespace-pre-wrap text-xs bg-slate-50 p-2 rounded">{invoice.invoice_text}</pre>
          )}
        </CardContent>
      </Card>
    </>
  )
}

export default InvoiceAside


import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { formatPrice } from '@/lib/utils'

export interface InvoiceItemsProps {
  items: unknown[]
  subtotal: number
  tax: number
  total: number
  getItemName: (it: unknown) => string
  getItemQty: (it: unknown) => number
  getItemUnit: (it: unknown) => number
}

export const InvoiceItems: React.FC<InvoiceItemsProps> = ({ items, subtotal, tax, total, getItemName, getItemQty, getItemUnit }) => {
  return (
    <Card className="mt-4">
      <CardHeader>
        <CardTitle>Items</CardTitle>
      </CardHeader>
      <CardContent>
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left text-xs text-muted-foreground">
              <th>Item</th>
              <th className="text-right">Qty</th>
              <th className="text-right">Unit</th>
              <th className="text-right">Total</th>
            </tr>
          </thead>
          <tbody>
            {items.map((it, i) => {
              const name = getItemName(it)
              const qty = getItemQty(it)
              const unit = getItemUnit(it)
              const line = qty * unit
              // attempt to create a stable-ish key
              const key = String(i)
              return (
                <tr key={key}>
                  <td className="py-2">{name}</td>
                  <td className="py-2 text-right">{qty}</td>
                  <td className="py-2 text-right">{formatPrice(unit)}</td>
                  <td className="py-2 text-right">{formatPrice(line)}</td>
                </tr>
              )
            })}
          </tbody>
        </table>

        <div className="mt-4 space-y-1 text-sm w-full md:w-1/2 ml-auto">
          <div className="flex justify-between">
            <div>Subtotal</div>
            <div>{formatPrice(Number(subtotal ?? 0))}</div>
          </div>
          <div className="flex justify-between">
            <div>Tax</div>
            <div>{formatPrice(Number(tax ?? 0))}</div>
          </div>
          <div className="flex justify-between font-semibold">
            <div>Total</div>
            <div>{formatPrice(Number(total ?? 0))}</div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

export default InvoiceItems


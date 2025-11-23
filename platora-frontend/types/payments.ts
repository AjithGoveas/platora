export type Payment = {
  id?: number | string
  order_id?: number | string
  amount?: number | string
  mode?: string | null
  paid_at?: string | null
  invoice_text?: string | null
}

export type Invoice = {
  id?: number | string
  order_id?: number | string
  amount?: number | string
  currency?: string | null
  generated_at?: string | null
  invoice_text?: string | null
  generated_by?: string | null
}


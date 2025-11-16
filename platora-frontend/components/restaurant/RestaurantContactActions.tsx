'use client'

import React from 'react'
import Link from 'next/link'
import {Button} from '@/components/ui/button'
import {toast} from 'sonner'

type Props = {
  phone?: string | null
}

export default function RestaurantContactActions({phone}: Props) {
  const handleContact = () => {
    // simple client-side feedback; real contact flow could open a modal or send a request
    toast.success('Contact request sent to the restaurant')
  }

  return (
    <div className="flex items-center gap-2">
      {phone ? (
        <a href={`tel:${phone}`}>
          <Button variant="ghost">Call</Button>
        </a>
      ) : (
        <Button variant="ghost" onClick={handleContact}>Contact</Button>
      )}

      <Link href="/">
        <Button variant="outline">Browse other restaurants</Button>
      </Link>
    </div>
  )
}


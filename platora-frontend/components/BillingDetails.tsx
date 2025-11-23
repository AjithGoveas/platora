import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { formatDate } from '@/lib/utils';

export interface BillingDetailsProps {
  customerName?: string | null;
  customerPhone?: string | null;
  paymentMode?: string | null;
  invoice?: { currency?: string | null; paid_at?: string | null } | null;
  restaurantName?: string | null;
  restaurantAddress?: string | null;
  deliveryStatus?: string | null;
  deliveryAgentName?: string | null;
  deliveryAgentPhone?: string | null;
}

export const BillingDetails: React.FC<BillingDetailsProps> = ({
  customerName,
  customerPhone,
  paymentMode,
  invoice,
  restaurantName,
  restaurantAddress,
  deliveryStatus,
  deliveryAgentName,
  deliveryAgentPhone,
}) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Billing & Details</CardTitle>
      </CardHeader>

      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <div className="font-medium">Billed to</div>
            <div className="text-sm text-muted-foreground">{customerName ?? 'Customer'}</div>
            {customerPhone && <div className="text-sm text-muted-foreground">Phone: {customerPhone}</div>}
          </div>

          <div>
            <div className="font-medium">Payment</div>
            <div className="text-sm text-muted-foreground">{paymentMode ?? '—'}</div>
            {invoice?.currency && (
              <div className="text-sm text-muted-foreground">Currency: {invoice.currency}</div>
            )}
            {invoice?.paid_at && (
              <div className="text-sm text-muted-foreground">Paid: {formatDate(invoice.paid_at)}</div>
            )}
          </div>
        </div>

        {restaurantName && (
          <div className="mt-4">
            <div className="font-medium">Restaurant</div>
            <div className="text-sm text-muted-foreground">{restaurantName}</div>
            {restaurantAddress && (
              <div className="text-sm text-muted-foreground">{restaurantAddress}</div>
            )}
          </div>
        )}

        {deliveryStatus && (
          <div className="mt-4 p-3 border rounded">
            <div className="font-medium">Delivery</div>
            <div className="text-sm text-muted-foreground">Status: {deliveryStatus}</div>
            {deliveryAgentName && <div>Agent: {deliveryAgentName}</div>}
            {deliveryAgentPhone && (
              <div className="text-sm text-muted-foreground">Phone: {deliveryAgentPhone}</div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default BillingDetails;

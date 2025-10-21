// components/menu-item-card.tsx
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { AspectRatio } from '@/components/ui/aspect-ratio';
import { Button } from '@/components/ui/button';
import { MenuItem } from '@/types/menu';
import Image from 'next/image';

type Props = {
    item: MenuItem;
    children?: React.ReactNode;
};

export default function MenuItemCard({ item, children }: Props) {
    return (
        <Card className={item.available ? '' : 'opacity-60'}>
            <CardHeader>
                <AspectRatio ratio={16/9} className="rounded-md overflow-hidden">
                    <Image
                        src={item.image}
                        alt={item.name}
                        fill
                        className="object-cover"
                    />
                </AspectRatio>
            </CardHeader>

            <CardContent className="space-y-1">
                <h3 className="text-lg font-semibold">{item.name}</h3>
                <p className="text-sm text-muted-foreground">₹{item.price}</p>
                {!item.available && (
                    <p className="text-xs text-destructive font-medium">Currently Unavailable</p>
                )}
            </CardContent>

            {children && (
                <CardFooter className="pt-4">
                    {children}
                </CardFooter>
            )}
        </Card>
    );
}

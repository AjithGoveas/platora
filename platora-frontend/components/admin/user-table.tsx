'use client';

import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {User} from "@/types/users";

type Props = {
    data: User[];
};

export function UserTable({ data }: Props) {
    return (
        <div className="border rounded-md overflow-x-auto">
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead className="border-r">ID</TableHead>
                        <TableHead className="border-r">Name</TableHead>
                        <TableHead className="border-r">Email</TableHead>
                        <TableHead className="border-r">Role</TableHead>
                        <TableHead className="text-center">Actions</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {data.map((user) => (
                        <TableRow key={user.id}>
                            <TableCell className="border-r">{user.id}</TableCell>
                            <TableCell className="border-r">{user.name}</TableCell>
                            <TableCell className="border-r">{user.email}</TableCell>
                            <TableCell className="border-r">
                                <Badge variant="outline">{user.role.toUpperCase()}</Badge>
                            </TableCell>
                            <TableCell className="text-center space-x-2">
                                <Button size="sm" variant="outline">Edit</Button>
                                <Button size="sm" variant="destructive">Delete</Button>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </div>
    );
}

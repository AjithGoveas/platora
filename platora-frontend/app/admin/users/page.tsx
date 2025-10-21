'use client';

import { users } from '@/lib/dummy-data';
import { UserTable } from '@/components/admin/user-table';

export default function UsersPage() {
    return (
        <div className="p-6 space-y-4">
            <h1 className="text-2xl font-semibold">Manage Users</h1>
            <UserTable data={users} />
        </div>
    );
}

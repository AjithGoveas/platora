import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';

export default function AdminDashboard() {
    return (
        <div className="min-h-screen mt-16 p-8">
            <header className="mb-12">
                <h1 className="text-5xl font-extrabold text-gray-800 tracking-tight">Admin Dashboard</h1>
                <p className="text-lg text-gray-600 mt-4">Manage the platform, users, and settings efficiently.</p>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {/* User Management Card */}
                <Card className="shadow-xl border border-gray-200">
                    <CardHeader>
                        <CardTitle className="text-xl font-semibold">User Management</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-gray-600">View, edit, and manage all platform users.</p>
                        {/*Link: /admin/users */}
                        <Link href="/admin">
                            <Button className="mt-4 w-full">Manage Users</Button>
                        </Link>
                    </CardContent>
                </Card>

                {/* Reports Card */}
                <Card className="shadow-xl border border-gray-200">
                    <CardHeader>
                        <CardTitle className="text-xl font-semibold">Reports</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-gray-600">Generate and view detailed platform reports.</p>
                        {/*Link: /admin/reports */}
                        <Link href="/admin">
                            <Button className="mt-4 w-full">View Reports</Button>
                        </Link>
                    </CardContent>
                </Card>

                {/* Platform Settings Card */}
                <Card className="shadow-xl border border-gray-200">
                    <CardHeader>
                        <CardTitle className="text-xl font-semibold">Platform Settings</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-gray-600">Update and configure platform-wide settings.</p>
                        {/*Link: /admin/settings */}
                        <Link href="/admin">
                            <Button className="mt-4 w-full">Go to Settings</Button>
                        </Link>
                    </CardContent>
                </Card>

                {/* Stats Overview Card */}
                <Card className="shadow-xl border border-gray-200">
                    <CardHeader>
                        <CardTitle className="text-xl font-semibold">Platform Stats</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-6">
                            <div>
                                <p className="text-sm text-gray-600">Active Users</p>
                                <Progress value={85} className="mt-2" />
                                <p className="text-xs text-gray-500 mt-1">85% of user activity goal</p>
                            </div>
                            <Separator />
                            <div>
                                <p className="text-sm text-gray-600">Monthly Revenue</p>
                                <Progress value={60} className="mt-2" />
                                <p className="text-xs text-gray-500 mt-1">60% of revenue target</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Support Requests Card */}
                <Card className="shadow-xl border border-gray-200">
                    <CardHeader>
                        <CardTitle className="text-xl font-semibold">Support Requests</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-gray-600">View and respond to user support requests.</p>
                        {/*Link: /admin/support */}
                        <Link href="/admin">
                            <Button className="mt-4 w-full">View Requests</Button>
                        </Link>
                    </CardContent>
                </Card>

                {/* Announcements Card */}
                <Card className="shadow-xl border border-gray-200">
                    <CardHeader>
                        <CardTitle className="text-xl font-semibold">Announcements</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-gray-600">Create and manage platform-wide announcements.</p>
                        {/*Link: /admin/announcement */}
                        <Link href="/admin">
                            <Button className="mt-4 w-full">Manage Announcements</Button>
                        </Link>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}

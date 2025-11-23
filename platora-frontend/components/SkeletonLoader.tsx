'use client';

import React from 'react';

type Props = {
    open: boolean;
    message?: string;
};

export default function SkeletonLoader({open, message = 'Processing payment…'}: Props) {
    if (!open) return null;
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
            <div className="fixed inset-0 bg-black/30"/>
            <div className="relative z-10 p-6 bg-white rounded-lg shadow-lg w-full max-w-md">
                <div className="flex flex-col items-center gap-4">
                    <div className="h-16 w-16 rounded-full animate-pulse bg-slate-200"/>
                    <div className="text-lg font-medium">{message}</div>
                    <div className="w-full">
                        <div className="h-2 bg-slate-200 rounded-full animate-pulse"/>
                    </div>
                </div>
            </div>
        </div>
    );
}


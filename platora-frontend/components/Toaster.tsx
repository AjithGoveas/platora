'use client';

import {Toaster as SonnerToaster} from 'sonner';

export default function Toaster() {
    return (
        <SonnerToaster
            position="top-center"
            duration={4000}
            closeButton={true}
            toastOptions={{
                style: {borderRadius: 8},
            }}
            richColors={true}
        />
    );
}

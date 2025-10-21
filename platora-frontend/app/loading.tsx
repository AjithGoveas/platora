import {IconLoader} from "@tabler/icons-react";

export default function GlobalLoading() {
    return (
        <div className="h-screen flex flex-col items-center justify-center gap-3">
            <IconLoader className="h-8 w-8 animate-spin text-primary" />
            <p className="text-sm text-muted-foreground">Loading, please wait...</p>
        </div>
    );
}
"use client";

import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { useRouter } from "next/navigation";
import { AuthContent } from "./AuthContent";

export function AuthModal({ initialMode }: { initialMode: "login" | "signup" }) {
    const router = useRouter();

    const handleOpenChange = (open: boolean) => {
        if (!open) {
            router.back();
        }
    };

    return (
        <Dialog open={true} onOpenChange={handleOpenChange}>
            <DialogContent className="sm:max-w-[420px] border-0 bg-white shadow-2xl overflow-hidden p-0">
                <DialogTitle className="sr-only">
                    {initialMode === "login" ? "Sign In" : "Sign Up"}
                </DialogTitle>
                <AuthContent initialMode={initialMode} isModal={true} onClose={() => router.back()} />
            </DialogContent>
        </Dialog>
    );
}

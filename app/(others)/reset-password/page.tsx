"use client";

import React, { useState, useEffect, Suspense } from "react";
import { Loader2 } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { ResetPasswordForm } from "@/components/Auth/ResetPasswordForm";

function ResetPasswordContent() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const token = searchParams.get("token");

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-slate-100 to-slate-50 flex items-center justify-center p-4">
            <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8 animate-in fade-in zoom-in duration-300">
                <ResetPasswordForm
                    token={token || undefined}
                    onBackToLogin={() => router.push("/?auth=login")}
                />
            </div>
        </div>
    );
}

export default function ResetPasswordPage() {
    return (
        <Suspense fallback={
            <div className="min-h-screen bg-gradient-to-br from-slate-50 via-slate-100 to-slate-50 flex items-center justify-center">
                <Loader2 className="w-8 h-8 animate-spin text-[#A12717]" />
            </div>
        }>
            <ResetPasswordContent />
        </Suspense>
    );
}

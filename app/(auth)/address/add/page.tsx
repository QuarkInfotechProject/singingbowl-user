"use client";

import React, { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { Loader2 } from "lucide-react";
import { addAddress } from "@/lib/apiItems";
import AddressForm from "../_component/AddressForm";

function AddAddressContent() {
  const searchParams = useSearchParams();
  const redirect = searchParams.get("redirect") || "/profile";

  const handleSubmit = async (payload: any) => {
    await addAddress(payload);
  };

  return (
    <AddressForm
      isEdit={false}
      redirect={redirect}
      onSubmit={handleSubmit}
    />
  );
}

export default function AddAddressPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-slate-50 to-blue-50 flex items-center justify-center">
          <Loader2 className="w-8 h-8 animate-spin text-slate-600" />
        </div>
      }
    >
      <AddAddressContent />
    </Suspense>
  );
}
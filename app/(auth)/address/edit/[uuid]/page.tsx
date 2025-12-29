"use client";

import React, { useEffect, useState, Suspense } from "react";
import { useRouter, useSearchParams, useParams } from "next/navigation";
import { Loader2 } from "lucide-react";
import { fetchAddressById, updateAddress } from "@/lib/apiItems";
import { toast } from "sonner";
import AddressForm from "../../_component/AddressForm";

function EditAddressContent() {
  const params = useParams();
  const searchParams = useSearchParams();
  const uuid = params.uuid as string;
  const redirect = searchParams.get("redirect") || "/profile";

  const [addressData, setAddressData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (uuid) {
      loadAddress();
    }
  }, [uuid]);

  const loadAddress = async () => {
    try {
      setLoading(true);
      const res = await fetchAddressById(uuid);
      const data = res?.data || res;
      setAddressData(data);
    } catch (error) {
      console.error("Failed to load address", error);
      toast.error("Failed to load address");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (payload: any) => {
    await updateAddress(payload);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    );
  }

  return (
    <AddressForm
      initialData={addressData}
      isEdit={true}
      addressUuid={uuid}
      redirect={redirect}
      onSubmit={handleSubmit}
    />
  );
}

export default function EditAddressPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center">
          <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
        </div>
      }
    >
      <EditAddressContent />
    </Suspense>
  );
}
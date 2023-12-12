"use client";

export const dynamic = "force-dynamic";
import axios from "axios";
import { redirect } from "next/navigation";
import { useEffect } from "react";

export default function Page({ params }: { params: { id: String } }) {
  useEffect(() => {
    axios.get("/api/link/" + params.id).then((res) => {
      if (res.data?.success) {
        redirect(res.data?.link?.resolved_url);
      } else {
        console.log(res.data.error);
      }
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="w-full h-full flex items-center justify-center p-24">
      Redirecting...
    </div>
  );
}

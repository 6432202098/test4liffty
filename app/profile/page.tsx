"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function ProfilePage() {
  const [profile, setProfile] = useState<any>(null);
  const router = useRouter();

  useEffect(() => {
    const savedProfile = localStorage.getItem("liffProfile");
    if (!savedProfile) {
      router.push("/");
    } else {
      setProfile(JSON.parse(savedProfile));
    }
  }, [router]);

  if (!profile)
    return (
      <div className="flex items-center justify-center h-screen">
        <p className="text-gray-600 text-lg">กำลังโหลดข้อมูล...</p>
      </div>
    );

  return (
    <div className="flex flex-col items-center justify-center h-screen p-6 bg-green-50">
      <div className="bg-white shadow-md rounded-lg p-6 w-full max-w-sm text-center">
        <h1 className="text-xl font-bold mb-4 text-green-700">
          โปรไฟล์สมาชิก
        </h1>
        <p className="text-gray-700 mb-2">
          <b>ชื่อ:</b> {profile.name || profile.displayName}
        </p>
        <p className="text-gray-700 mb-2">
          <b>เบอร์โทร:</b> {profile.phone || "-"}
        </p>
        <p className="text-gray-700 mb-2">
          <b>เลขบัตรประชาชน:</b> {profile.citizenId || "-"}
        </p>
        <p className="text-gray-700 mb-4">
          <b>อีเมล:</b> {profile.email || "-"}
        </p>

        <button
          className="bg-red-500 text-white py-2 rounded w-full font-semibold hover:bg-red-600"
          onClick={() => {
            // @ts-ignore
            window.liff.logout();
            localStorage.removeItem("liffProfile");
            router.push("/");
          }}
        >
          Logout
        </button>
      </div>
    </div>
  );
}
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function ProfilePage() {
  const [profile, setProfile] = useState<any>(null);
  const [showFullId, setShowFullId] = useState(false);
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

  const maskedId = profile.citizenId
    ? showFullId
      ? profile.citizenId
      : `${profile.citizenId.slice(0, 2)}•••••••••••`
    : "-";

  return (
    <div className="flex flex-col items-center justify-center h-screen p-6 bg-green-50">
      <div className="bg-white shadow-md rounded-lg p-6 w-full max-w-sm text-center">
        {profile.pictureUrl && (
          <img
            src={profile.pictureUrl}
            alt="Profile"
            className="w-24 h-24 rounded-full mx-auto mb-4"
          />
        )}
        <h1 className="text-xl font-bold mb-2 text-green-700">
          {profile.displayName}
        </h1>

        <p className="text-gray-700 mb-2">
          <b>ชื่อ:</b> {profile.name}
        </p>
        <p className="text-gray-700 mb-2">
          <b>เบอร์โทร:</b> {profile.phone}
        </p>
        <p className="text-gray-700 mb-2">
          <b>บัตรประชาชน:</b> {maskedId}{" "}
          {profile.citizenId && (
            <button
              onClick={() => setShowFullId((v) => !v)}
              className="text-blue-600 underline ml-1 text-sm"
            >
              {showFullId ? "ซ่อน" : "ดูเต็ม"}
            </button>
          )}
        </p>
        <p className="text-gray-700 mb-4">
          <b>อีเมล:</b> {profile.email || "-"}
        </p>

        <button
          className="bg-red-500 text-white py-2 rounded w-full font-semibold hover:bg-red-600"
          onClick={() => {
            // @ts-ignore
            window.liff.logout();
            router.push("/");
            window.location.reload();
          }}
        >
          Logout จากระบบ LINE
        </button>
      </div>
    </div>
  );
}
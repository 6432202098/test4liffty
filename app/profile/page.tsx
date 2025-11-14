"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

interface UserData {
  name?: string;
  phone?: string;
  citizenId?: string;
  email?: string;
}

export default function ProfilePage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [liffProfile, setLiffProfile] = useState<any>(null);
  const [userData, setUserData] = useState<UserData | null>(null);
  const [showFullId, setShowFullId] = useState(false);

  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://static.line-scdn.net/liff/edge/2/sdk.js";
    script.async = true;

    script.onload = async () => {
      // @ts-ignore
      const liff = window.liff;

      try {
        await liff.init({ liffId: process.env.NEXT_PUBLIC_LIFF_ID as string });

        if (!liff.isLoggedIn()) {
          liff.login({ redirectUri: window.location.href });
          return;
        }

        // ดึงโปรไฟล์จาก LIFF
        const profile = await liff.getProfile();
        setLiffProfile(profile);

        // ดึงข้อมูลสมาชิกจากฐานข้อมูล
        const res = await fetch(`/api/get-user?userId=${profile.userId}`);
        const data = await res.json();
        setUserData(data);

        setLoading(false);
      } catch (err) {
        console.error("Profile LIFF error:", err);
      }
    };

    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, [router]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen text-gray-600">
        กำลังโหลดโปรไฟล์...
      </div>
    );
  }

  if (!liffProfile || !userData) {
    return (
      <div className="flex flex-col items-center justify-center h-screen gap-4">
        <p className="text-gray-600">เกิดข้อผิดพลาด ไม่พบข้อมูลผู้ใช้</p>
        <button
          className="bg-red-500 text-white px-4 py-2 rounded"
          onClick={() => router.push("/")}
        >
          กลับหน้าแรก
        </button>
      </div>
    );
  }

  // เซนเซอร์เลขบัตร
  const maskedCitizenId = userData.citizenId
    ? `${userData.citizenId.slice(0, 2)}-${"•".repeat(
        userData.citizenId.length - 2
      )}`
    : "";

  return (
    <div className="h-screen flex items-center justify-center px-6 bg-gradient-to-b from-green-100 to-white">
      <div className="bg-white shadow-lg rounded-2xl p-6 w-full max-w-xs text-center">
        <img
          src={liffProfile.pictureUrl}
          alt="Profile"
          className="w-24 h-24 rounded-full mx-auto mb-4 shadow"
        />

        <h1 className="text-2xl font-bold">{liffProfile.displayName}</h1>
        <p className="text-gray-500 text-sm mb-6">สมาชิกของร้านคุณ</p>

        <div className="text-left space-y-2">
          <p><strong>ชื่อ:</strong> {userData.name}</p>
          <p><strong>เบอร์โทร:</strong> {userData.phone}</p>

          <p>
            <strong>เลขบัตร:</strong>{" "}
            {showFullId ? userData.citizenId : maskedCitizenId}
          </p>

          <button
            className="text-blue-600 underline text-sm"
            onClick={() => setShowFullId(!showFullId)}
          >
            {showFullId ? "ซ่อนเลขบัตร" : "แสดงเต็ม"}
          </button>

          <p><strong>อีเมล:</strong> {userData.email || "—"}</p>
        </div>

        <button
          className="mt-6 w-full bg-red-500 text-white py-2 rounded font-semibold"
          onClick={() => {
            // @ts-ignore
            window.liff.logout();
            window.location.href = "/";
          }}
        >
          ออกจากระบบ LINE
        </button>
      </div>
    </div>
  );
}
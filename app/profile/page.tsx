"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

interface UserData {
  lineUserId?: string;
  name?: string;
  phone?: string;
  citizenId?: string;
  email?: string;
  pictureUrl?: string;
}

export default function ProfilePage() {
  const [loading, setLoading] = useState(true);
  const [userData, setUserData] = useState<UserData | null>(null);
  const [showCitizen, setShowCitizen] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://static.line-scdn.net/liff/edge/2/sdk.js";
    script.async = true;

    script.onload = async () => {
      // @ts-ignore
      const liff = window.liff;

      try {
        await liff.init({ liffId: process.env.NEXT_PUBLIC_LIFF_ID });

        if (!liff.isLoggedIn()) {
          liff.login({ redirectUri: window.location.href });
        } else {
          const profile = await liff.getProfile();
          const lineUserId: string = profile.userId;

          const res = await fetch(`/api/get-user?userId=${lineUserId}`);
          const data = await res.json();

          setUserData({
            lineUserId,
            name: data?.name || "",
            phone: data?.phone || "",
            citizenId: data?.citizen_id || "",
            email: data?.email || "",
            pictureUrl: profile.pictureUrl,
          });
        }
      } catch (err) {
        console.error("LIFF init error:", err);
      } finally {
        setLoading(false);
      }
    };

    document.body.appendChild(script);

    // ✅ useEffect return ต้องเป็น void
    return () => {
      if (document.body.contains(script)) {
        document.body.removeChild(script);
      }
    };
  }, [router]);

  if (loading) return <p className="p-4 text-center">กำลังโหลดโปรไฟล์...</p>;
  if (!userData) return null;

  return (
    <div className="p-4 max-w-md mx-auto text-center">
      {userData.pictureUrl && (
        <img
          src={userData.pictureUrl}
          alt="Profile"
          className="w-24 h-24 rounded-full mx-auto mb-4"
        />
      )}
      <h1 className="text-xl font-bold mb-2">{userData.name}</h1>
      <p>เบอร์โทร: {userData.phone}</p>
      <p>
        หมายเลขบัตรประชาชน:{" "}
        {showCitizen
          ? userData.citizenId
          : userData.citizenId
          ? `${userData.citizenId.slice(0, 2)}***********`
          : ""}
        <button
          className="ml-2 text-blue-500"
          onClick={() => setShowCitizen(!showCitizen)}
        >
          {showCitizen ? "ปิด" : "แสดง"}
        </button>
      </p>
      {userData.email && <p>อีเมล: {userData.email}</p>}

      <button
        className="mt-4 bg-red-500 text-white px-4 py-2 rounded w-full"
        onClick={() => {
          // logout LIFF
          // @ts-ignore
          window.liff.logout();
          window.location.href = "/";
        }}
      >
        Logout
      </button>
    </div>
  );
}
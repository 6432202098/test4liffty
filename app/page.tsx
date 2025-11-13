"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

interface UserData {
  name?: string;
  phone?: string;
  citizenId?: string;
  email?: string;
  userId?: string;
  displayName?: string;
}

export default function HomePage() {
  const [loading, setLoading] = useState(true);
  const [userData, setUserData] = useState<UserData | null>(null);
  const router = useRouter();

  useEffect(() => {
    const savedProfile = localStorage.getItem("liffProfile");
    if (savedProfile) {
      const profile = JSON.parse(savedProfile);
      setUserData(profile);
      setLoading(false);
      // ถ้าข้อมูลครบแล้ว ให้ไปหน้า Profile
      if (profile.name && profile.phone && profile.citizenId) {
        router.push("/profile");
      }
      return;
    }

    // โหลด LIFF SDK
    const script = document.createElement("script");
    script.src = "https://static.line-scdn.net/liff/edge/2/sdk.js";
    script.async = true;

    script.onload = () => {
      // @ts-ignore
      const liff = window.liff;
      liff
        .init({ liffId: "2008486286-mM6W3zQD" })
        .then(async () => {
          if (!liff.isLoggedIn()) {
            liff.login({ redirectUri: window.location.href });
          } else {
            const profile = await liff.getProfile();
            const data: UserData = {
              userId: profile.userId,
              displayName: profile.displayName,
            };
            localStorage.setItem("liffProfile", JSON.stringify(data));
            setUserData(data);
          }
        })
        .catch((err: unknown) => {
          console.error("LIFF init error:", err);
          if (err instanceof Error) alert(err.message);
        })
        .finally(() => setLoading(false));
    };

    document.body.appendChild(script);
    return () => {
      document.body.removeChild(script);
    };
  }, [router]);

  if (loading)
    return (
      <div className="flex items-center justify-center h-screen">
        <p className="text-gray-600 text-lg">กำลังโหลด LIFF...</p>
      </div>
    );

  // ถ้าล็อคอินแล้วแต่ยังไม่กรอกข้อมูล
  if (userData && (!userData.name || !userData.phone || !userData.citizenId)) {
    return (
      <div className="flex flex-col items-center justify-center h-screen p-6 bg-green-50">
        <div className="bg-white shadow-md rounded-lg p-6 w-full max-w-sm text-center">
          <h1 className="text-xl font-bold mb-4 text-green-700">
            กรอกข้อมูลลูกค้า
          </h1>
          <form
            onSubmit={async (e) => {
              e.preventDefault();
              const form = e.target as HTMLFormElement;
              const data = {
                ...userData,
                name: (form.elements.namedItem("name") as HTMLInputElement)
                  .value,
                phone: (form.elements.namedItem("phone") as HTMLInputElement)
                  .value,
                citizenId: (
                  form.elements.namedItem("citizenId") as HTMLInputElement
                ).value,
                email: (form.elements.namedItem("email") as HTMLInputElement)
                  .value,
              };
              localStorage.setItem("liffProfile", JSON.stringify(data));
              router.push("/profile");
            }}
          >
            <input
              name="name"
              placeholder="ชื่อ-นามสกุล"
              defaultValue={userData?.name || ""}
              className="border border-gray-300 rounded p-2 w-full mb-2 text-sm"
              required
            />
            <input
              name="phone"
              placeholder="เบอร์โทร"
              defaultValue={userData?.phone || ""}
              className="border border-gray-300 rounded p-2 w-full mb-2 text-sm"
              required
            />
            <input
              name="citizenId"
              placeholder="หมายเลขบัตรประชาชน"
              defaultValue={userData?.citizenId || ""}
              className="border border-gray-300 rounded p-2 w-full mb-2 text-sm"
              required
            />
            <input
              name="email"
              placeholder="อีเมล (ไม่บังคับ)"
              defaultValue={userData?.email || ""}
              className="border border-gray-300 rounded p-2 w-full mb-4 text-sm"
            />

            <button
              type="submit"
              className="bg-green-600 text-white py-2 rounded w-full font-semibold hover:bg-green-700"
            >
              บันทึกข้อมูล
            </button>
          </form>

          <button
            className="mt-4 bg-red-500 text-white py-2 rounded w-full font-semibold hover:bg-red-600"
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

  return (
    <div className="flex items-center justify-center h-screen">
      <p className="text-gray-600 text-lg">กำลังโหลดข้อมูล...</p>
    </div>
  );
}
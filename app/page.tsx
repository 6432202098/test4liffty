"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

interface UserData {
  name?: string;
  phone?: string;
  citizenId?: string;
  email?: string;
}

export default function HomePage() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userData, setUserData] = useState<UserData | null>(null);
  const router = useRouter();

  useEffect(() => {
    // โหลด LIFF SDK ผ่าน CDN
    const script = document.createElement("script");
    script.src = "https://static.line-scdn.net/liff/edge/2/sdk.js";
    script.async = true;

    script.onload = () => {
      // @ts-ignore
      const liff = window.liff;

      liff.init({ liffId: "2008486286-rBk2lqm4" })
        .then(() => {
          if (!liff.isLoggedIn()) {
            liff.login();
          } else {
            setIsLoggedIn(true);
            liff.getProfile().then(async (profile: any) => {
              console.log(profile.userId, profile.displayName);

              // เช็คข้อมูลลูกค้าในฐานข้อมูล (API call)
              const res = await fetch(`/api/get-user?userId=${profile.userId}`);
              const data: UserData = await res.json();

              setUserData(data);

              // ถ้าข้อมูลครบ → redirect ไปหน้า profile
              if (data.name && data.phone && data.citizenId) {
                router.push("/profile");
              }
            });
          }
        })
        .catch((err: any) => console.error("LIFF init error:", err));
    };

    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, [router]);

  if (!isLoggedIn) return <p>กำลังเข้าสู่ระบบ LIFF...</p>;

  if (userData && (!userData.name || !userData.phone || !userData.citizenId)) {
    return (
      <div className="p-4 max-w-md mx-auto">
        <h1 className="text-xl font-bold mb-4">กรอกข้อมูลลูกค้า</h1>
        <form
          onSubmit={async (e) => {
            e.preventDefault();
            const form = e.target as any;
            const data = {
              name: form.name.value,
              phone: form.phone.value,
              citizenId: form.citizenId.value,
              email: form.email.value,
            };
            // save data via API
            await fetch("/api/save-user", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify(data),
            });
            router.push("/profile");
          }}
        >
          <input
            name="name"
            placeholder="ชื่อ-นามสกุล"
            defaultValue={userData?.name || ""}
            className="border p-2 w-full mb-2"
            required
          />
          <input
            name="phone"
            placeholder="เบอร์โทร"
            defaultValue={userData?.phone || ""}
            className="border p-2 w-full mb-2"
            required
          />
          <input
            name="citizenId"
            placeholder="หมายเลขบัตรประชาชน"
            defaultValue={userData?.citizenId || ""}
            className="border p-2 w-full mb-2"
            required
          />
          <input
            name="email"
            placeholder="อีเมล (ไม่บังคับ)"
            defaultValue={userData?.email || ""}
            className="border p-2 w-full mb-2"
          />
          <button
            type="submit"
            className="bg-green-500 text-white px-4 py-2 rounded"
          >
            บันทึกข้อมูล
          </button>
        </form>
      </div>
    );
  }

  return <p>กำลังโหลดข้อมูล...</p>;
}
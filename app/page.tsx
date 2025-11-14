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

export default function HomePage() {
  const [loading, setLoading] = useState(true);
  const [userData, setUserData] = useState<UserData | null>(null);
  const router = useRouter();

  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://static.line-scdn.net/liff/edge/2/sdk.js";
    script.async = true;

    script.onload = () => {
      // @ts-ignore
      const liff = window.liff;

      liff.init({ liffId: process.env.NEXT_PUBLIC_LIFF_ID })
        .then(async () => {
          if (!liff.isLoggedIn()) {
            liff.login({ redirectUri: window.location.href });
          } else {
            const profile = await liff.getProfile();
            const lineUserId: string = profile.userId;

            const res = await fetch(`/api/get-user?userId=${lineUserId}`);
            const data = await res.json();

            if (data && data.name && data.phone && data.citizen_id) {
              router.push("/profile");
            } else {
              setUserData({
                lineUserId,
                name: data?.name || "",
                phone: data?.phone || "",
                citizenId: data?.citizen_id || "",
                email: data?.email || "",
                pictureUrl: profile.pictureUrl,
              });
            }
            setLoading(false);
          }
        })
        .catch((err: unknown) => {
          console.error("LIFF init error:", err);
          setLoading(false);
        });
    };

    document.body.appendChild(script);
    return () => { document.body.removeChild(script); };
  }, [router]);

  if (loading) return <p className="p-4 text-center">กำลังโหลด LIFF...</p>;

  if (userData && (!userData.name || !userData.phone || !userData.citizenId)) {
    return (
      <div className="p-4 max-w-md mx-auto text-center">
        <h1 className="text-xl font-bold mb-4">กรอกข้อมูลลูกค้า</h1>
        <form
          onSubmit={async (e) => {
            e.preventDefault();
            const form = e.target as any;
            const data = {
              line_user_id: userData.lineUserId,
              name: form.name.value,
              phone: form.phone.value,
              citizenId: form.citizenId.value,
              email: form.email.value,
              pictureUrl: userData.pictureUrl,
            };
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
            defaultValue={userData?.name}
            className="border p-2 w-full mb-2"
            required
          />
          <input
            name="phone"
            placeholder="เบอร์โทร"
            defaultValue={userData?.phone}
            className="border p-2 w-full mb-2"
            required
          />
          <input
            name="citizenId"
            placeholder="หมายเลขบัตรประชาชน"
            defaultValue={userData?.citizenId}
            className="border p-2 w-full mb-2"
            required
          />
          <input
            name="email"
            placeholder="อีเมล (ไม่บังคับ)"
            defaultValue={userData?.email}
            className="border p-2 w-full mb-2"
          />
          <button
            type="submit"
            className="bg-green-500 text-white px-4 py-2 rounded w-full"
          >
            บันทึกข้อมูล
          </button>
        </form>

        <button
          className="mt-4 bg-red-500 text-white px-4 py-2 rounded w-full"
          onClick={() => {
            // logout LIFF
            // @ts-ignore
            window.liff.logout();
            window.location.reload();
          }}
        >
          Logout
        </button>
      </div>
    );
  }

  return <p className="p-4 text-center">กำลังโหลดข้อมูล...</p>;
}
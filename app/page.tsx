"use client";

import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/dist/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

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
  const formRef = useRef<HTMLDivElement>(null);

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
            return;
          }

          const profile = await liff.getProfile();
          const lineUserId: string = profile.userId;

          const savedUser = localStorage.getItem(`user_${lineUserId}`);
          if (savedUser) {
            router.push("/profile");
            return;
          }

          const res = await fetch(`/api/get-user?userId=${lineUserId}`);
          const data = await res.json();

          if (data && data.name && data.phone && data.citizen_id) {
            localStorage.setItem(`user_${lineUserId}`, "saved");
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
        })
        .catch((err: unknown) => {
          console.error("LIFF init error:", err);
          setLoading(false);
        });
    };

    document.body.appendChild(script);
    return () => {
      document.body.removeChild(script);
    };
  }, [router]);

  // GSAP scroll animation
  useEffect(() => {
    if (formRef.current) {
      gsap.from(formRef.current.querySelectorAll(".fade-up"), {
        y: 50,
        opacity: 0,
        duration: 1,
        stagger: 0.2,
        ease: "power3.out",
        scrollTrigger: {
          trigger: formRef.current,
          start: "top 80%",
        },
      });
    }
  }, [userData]);

  if (loading)
    return (
      <p className="p-4 text-center text-[#7a955f] font-semibold">
        กำลังโหลด LIFF...
      </p>
    );

  if (userData && (!userData.name || !userData.phone || !userData.citizenId)) {
    return (
      <div
        ref={formRef}
        className="p-6 max-w-md mx-auto bg-white rounded-3xl shadow-lg text-gray-900"
        style={{
          cursor: "url('data:image/svg+xml;utf8,<svg fill=%237a955f height=24 width=24 xmlns=http://www.w3.org/2000/svg><circle cx=12 cy=12 r=12/></svg>') 12 12, auto",
        }}
      >
        <h1 className="text-2xl font-bold mb-6 text-center fade-up text-[#7a955f]">
          กรอกข้อมูลลูกค้า
        </h1>
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

            if (userData.lineUserId) {
              localStorage.setItem(`user_${userData.lineUserId}`, "saved");
            }

            router.push("/profile");
          }}
        >
          {/** Inputs */}
          {["name", "phone", "citizenId", "email"].map((field, idx) => (
            <input
              key={idx}
              name={field}
              placeholder={
                field === "name"
                  ? "ชื่อ-นามสกุล"
                  : field === "phone"
                  ? "เบอร์โทร"
                  : field === "citizenId"
                  ? "หมายเลขบัตรประชาชน"
                  : "อีเมล (ไม่บังคับ)"
              }
              defaultValue={(userData as any)?.[field]}
              className={`fade-up border rounded-xl p-3 w-full mb-4 focus:outline-none focus:ring-2 focus:ring-[#7a955f] focus:shadow-lg
                ${field === "email" ? "bg-[#E0E0E0]" : "bg-white"} text-gray-900 placeholder-gray-500`}
              required={field !== "email"}
            />
          ))}
          {/** Submit Button */}
          <button
            type="submit"
            className="fade-up bg-gradient-to-r from-[#7a955f] to-[#a4c17c] hover:from-[#6f8e4f] hover:to-[#91b76b] transition-all duration-300 text-white px-4 py-3 rounded-xl w-full font-semibold shadow-lg"
          >
            บันทึกข้อมูล
          </button>
        </form>
      </div>
    );
  }

  return (
    <p className="p-4 text-center text-[#7a955f] font-semibold">
      กำลังโหลดข้อมูล...
    </p>
  );
}
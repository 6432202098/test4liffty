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

export default function ProfilePage() {
  const [loading, setLoading] = useState(true);
  const [userData, setUserData] = useState<UserData | null>(null);
  const [showCitizen, setShowCitizen] = useState(false);
  const router = useRouter();
  const containerRef = useRef<HTMLDivElement>(null);

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

    return () => {
      if (document.body.contains(script)) {
        document.body.removeChild(script);
      }
    };
  }, [router]);

  // GSAP animation for profile items
  useEffect(() => {
    if (containerRef.current) {
      gsap.from(containerRef.current.querySelectorAll(".fade-up"), {
        y: 30,
        opacity: 0,
        duration: 1,
        stagger: 0.2,
        ease: "power3.out",
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top 90%",
        },
      });
    }
  }, [userData]);

  if (loading)
    return (
      <p className="p-4 text-center text-[#7a955f] font-semibold">
        กำลังโหลดโปรไฟล์...
      </p>
    );
  if (!userData) return null;

  return (
    <div
      ref={containerRef}
      className="p-6 max-w-md mx-auto bg-white rounded-3xl shadow-lg text-gray-900"
      style={{
        cursor: "url('data:image/svg+xml;utf8,<svg fill=%237a955f height=24 width=24 xmlns=http://www.w3.org/2000/svg><circle cx=12 cy=12 r=12/></svg>') 12 12, auto",
      }}
    >
      {userData.pictureUrl && (
        <img
          src={userData.pictureUrl}
          alt="Profile"
          className="w-24 h-24 rounded-full mx-auto mb-4 fade-up"
        />
      )}
      <h1 className="text-2xl font-bold mb-2 text-center fade-up text-[#7a955f]">
        {userData.name}
      </h1>
      <p className="fade-up">เบอร์โทร: {userData.phone}</p>
      <p className="fade-up">
        หมายเลขบัตรประชาชน:{" "}
        {showCitizen
          ? userData.citizenId
          : userData.citizenId
          ? `${userData.citizenId.slice(0, 2)}***********`
          : ""}
        <button
          className="ml-2 text-[#7a955f] font-semibold"
          onClick={() => setShowCitizen(!showCitizen)}
        >
          {showCitizen ? "ปิด" : "แสดง"}
        </button>
      </p>
      {userData.email && <p className="fade-up">อีเมล: {userData.email}</p>}

      <button
        className="mt-6 fade-up bg-gradient-to-r from-[#7a955f] to-[#a4c17c] hover:from-[#6f8e4f] hover:to-[#91b76b] transition-all duration-300 text-white px-4 py-3 rounded-xl w-full font-semibold shadow-lg"
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
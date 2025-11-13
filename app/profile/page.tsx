"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { gsap } from "gsap";

interface UserData {
  name: string;
  phone: string;
  citizenId: string;
  email?: string;
}

export default function ProfilePage() {
  const [userData, setUserData] = useState<UserData | null>(null);
  const router = useRouter();

  // ฟังก์ชันปิดเลขบัตร 9 หลัก
  const maskCitizenId = (id: string) => {
    return `${id.slice(0, 2)}*********`;
  };

  useEffect(() => {
    async function fetchData() {
      // ดึงข้อมูลลูกค้าจาก API
      const res = await fetch("/api/get-user-me"); // API คืนข้อมูล user ปัจจุบัน
      if (res.ok) {
        const data: UserData = await res.json();
        setUserData(data);

        // GSAP animation
        gsap.from(".profile-item", {
          opacity: 0,
          y: 20,
          duration: 0.5,
          stagger: 0.2,
        });
      } else {
        // ถ้าไม่มีข้อมูล หรือยังไม่ล็อกอิน → กลับหน้าแรก
        router.push("/");
      }
    }

    fetchData();
  }, [router]);

  if (!userData) return <p className="p-4">กำลังโหลดข้อมูลโปรไฟล์...</p>;

  return (
    <div className="max-w-md mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6 text-center">ข้อมูลลูกค้า</h1>

      <div className="profile-item border rounded p-4 mb-4 shadow-md">
        <h2 className="font-semibold text-gray-700">ชื่อ-นามสกุล</h2>
        <p className="text-lg">{userData.name}</p>
      </div>

      <div className="profile-item border rounded p-4 mb-4 shadow-md">
        <h2 className="font-semibold text-gray-700">เบอร์โทร</h2>
        <p className="text-lg">{userData.phone}</p>
      </div>

      <div className="profile-item border rounded p-4 mb-4 shadow-md">
        <h2 className="font-semibold text-gray-700">หมายเลขบัตรประชาชน</h2>
        <p className="text-lg">{maskCitizenId(userData.citizenId)}</p>
      </div>

      {userData.email && (
        <div className="profile-item border rounded p-4 mb-4 shadow-md">
          <h2 className="font-semibold text-gray-700">อีเมล</h2>
          <p className="text-lg">{userData.email}</p>
        </div>
      )}
    </div>
  );
}
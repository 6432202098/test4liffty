'use client';

import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export default function Page() {
  const formRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = formRef.current;
    gsap.fromTo(
      el,
      { opacity: 0, y: 40 },
      {
        opacity: 1,
        y: 0,
        duration: 1.2,
        scrollTrigger: {
          trigger: el,
          start: 'top 80%',
        },
      }
    );
  }, []);

  return (
    <div className="min-h-screen bg-linear-to-b from-green-50 to-white flex flex-col items-center justify-center px-6 py-10">
      <div
        ref={formRef}
        className="w-full max-w-md bg-white rounded-2xl shadow-lg p-6"
      >
        <h1 className="text-2xl font-bold text-center text-green-700 mb-6">
          สมัครสมาชิกด้วย LINE 💚
        </h1>

        <form className="flex flex-col gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-600">
              ชื่อ - นามสกุล
            </label>
            <input
              type="text"
              className="w-full mt-1 px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-400 outline-none"
              placeholder="กรอกชื่อเต็มของคุณ"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-600">
              เบอร์โทร
            </label>
            <input
              type="text"
              className="w-full mt-1 px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-400 outline-none"
              placeholder="เช่น 0812345678"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-600">
              หมายเลขบัตรประชาชน
            </label>
            <input
              type="password"
              className="w-full mt-1 px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-400 outline-none"
              placeholder="13 หลัก"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-600">
              อีเมล (ไม่บังคับ)
            </label>
            <input
              type="email"
              className="w-full mt-1 px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-400 outline-none"
              placeholder="example@email.com"
            />
          </div>

          <button
            type="submit"
            className="mt-5 bg-green-600 text-white py-3 rounded-xl text-lg font-semibold hover:bg-green-700 transition-all"
          >
            บันทึกข้อมูล
          </button>
        </form>
      </div>
    </div>
  );
}

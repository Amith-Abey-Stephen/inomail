"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Mail } from "lucide-react";
import { motion, useMotionValue, useSpring } from "framer-motion";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const springX = useSpring(mouseX, { stiffness: 50, damping: 20 });
  const springY = useSpring(mouseY, { stiffness: 50, damping: 20 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      mouseX.set(e.clientX);
      mouseY.set(e.clientY);
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [mouseX, mouseY]);

  return (
    <div className="min-h-screen flex flex-col bg-background relative overflow-hidden">
      {/* Dynamic Background Blobs */}
      <motion.div 
        style={{
          x: springX,
          y: springY,
          translateX: "-50%",
          translateY: "-50%",
        }}
        className="absolute top-0 left-0 w-[600px] h-[600px] rounded-full bg-indigo-500/10 blur-[120px] pointer-events-none z-0" 
      />
      <motion.div 
        style={{
          x: springX,
          y: springY,
          translateX: "-30%",
          translateY: "-30%",
        }}
        className="absolute bottom-0 right-0 w-[500px] h-[500px] rounded-full bg-purple-500/10 blur-[120px] pointer-events-none z-0" 
      />
      
      {/* Static corner blobs for depth */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-indigo-500/20 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[10%] right-[-5%] w-[30%] h-[50%] rounded-full bg-purple-500/10 blur-[120px] pointer-events-none" />

      {/* Simplified Auth Navigation */}
      <header className="fixed top-0 w-full z-50 py-6">
        <div className="container mx-auto px-8 md:px-12">
          <Link href="/" className="flex items-center gap-2 group w-fit transition-opacity hover:opacity-80">
            <div className="bg-primary/20 p-2 rounded-xl group-hover:bg-primary/30 transition-colors">
              <Mail className="w-6 h-6 text-indigo-400" />
            </div>
            <span className="font-bold text-2xl tracking-tight text-white">InoMail</span>
          </Link>
        </div>
      </header>

      <main className="flex-1 flex items-start justify-center pt-32 pb-12 px-4 relative z-10">
        {children}
      </main>
    </div>
  );
}

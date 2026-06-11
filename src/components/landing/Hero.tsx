import { motion, useScroll, useTransform } from "motion/react";
import { useRef } from "react";
import { ImageWithFallback } from "../figma/ImageWithFallback";

export function Hero() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"]
  });

  const textY = useTransform(scrollYProgress, [0, 1], ["0%", "50%"]);
  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);

  // Devices animation
  const scale = useTransform(scrollYProgress, [0, 0.5], [1, 1.2]);
  const ipadX = useTransform(scrollYProgress, [0, 0.5], ["0%", "-10%"]);
  const iphoneX = useTransform(scrollYProgress, [0, 0.5], ["0%", "20%"]);
  const iphoneY = useTransform(scrollYProgress, [0, 0.5], ["0%", "10%"]);

  return (
    <section ref={containerRef} className="relative h-[200vh] w-full">
      <div className="sticky top-0 h-screen w-full flex flex-col items-center justify-center pt-20 px-6">
        <motion.div 
          className="max-w-4xl mx-auto text-center z-10 mt-16 md:mt-24"
          style={{ y: textY, opacity }}
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
        >
          <h1 className="text-5xl md:text-8xl font-semibold tracking-tighter mb-4 md:mb-6 bg-gradient-to-br from-white via-white/90 to-white/40 bg-clip-text text-transparent pb-2 leading-tight">
            Logistics, <br /> Perfected by AI.
          </h1>
          <p className="text-xl text-white/50 font-medium max-w-2xl mx-auto">
            The ultimate Food Logistics & Fleet Tracking platform. Built for precision, designed for scale.
          </p>
        </motion.div>

        {/* Mockup Container */}
        <motion.div 
          className="mt-12 md:mt-16 w-full max-w-5xl max-md:h-[320px] md:aspect-video mx-auto z-20 flex justify-center relative"
          style={{ scale, perspective: "2000px" }}
        >
        {/* iPad Mockup */}
        <motion.div 
          className="absolute max-md:h-[100%] max-md:aspect-[4/3] md:w-[80%] md:h-[120%] bg-[#1A1A1A] rounded-[2rem] border border-white/10 shadow-2xl overflow-hidden p-[10px]"
          style={{ x: ipadX, rotateX: 10, rotateY: -10, rotateZ: 5 }}
        >
          <div className="w-full h-full bg-black rounded-[1.5rem] overflow-hidden relative border border-white/5">
            {/* iPad Dashboard UI */}
            <div className="absolute inset-0 bg-[#0A0A0A] p-6 flex flex-col gap-4">
              <header className="flex justify-between items-center mb-4">
                 <div className="w-32 h-6 bg-white/10 rounded-full" />
                 <div className="w-10 h-10 bg-white/10 rounded-full" />
              </header>
              <div className="grid grid-cols-3 gap-4 flex-1">
                 <div className="col-span-2 bg-[#141414] rounded-2xl p-4 border border-white/5 relative overflow-hidden">
                   <div className="absolute inset-0 opacity-40">
                     <ImageWithFallback src="https://images.unsplash.com/photo-1744726665148-3bee1ee86cbd?q=80&w=1080" alt="Dark map" className="w-full h-full object-cover" />
                   </div>
                   {/* Overlay widgets */}
                   <div className="relative z-10 w-48 h-20 bg-black/60 backdrop-blur-md rounded-xl border border-white/10 p-3">
                     <div className="text-xs text-white/50">Fleet Status</div>
                     <div className="text-xl font-medium text-[#34C759]">98% Active</div>
                   </div>
                 </div>
                 <div className="flex flex-col gap-4">
                   <div className="flex-1 bg-[#141414] rounded-2xl border border-white/5 p-4">
                     <div className="w-20 h-4 bg-white/10 rounded-full mb-4" />
                     <div className="w-full h-2 bg-[#FF3B30] rounded-full opacity-80" />
                   </div>
                   <div className="flex-1 bg-[#141414] rounded-2xl border border-white/5 p-4">
                     <div className="w-24 h-4 bg-white/10 rounded-full mb-4" />
                     <div className="flex gap-2">
                       <div className="w-8 h-8 rounded-full bg-[#007AFF]" />
                       <div className="w-8 h-8 rounded-full bg-[#34C759]" />
                     </div>
                   </div>
                 </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* iPhone Mockup */}
        <motion.div 
          className="absolute right-[2%] md:right-[5%] bottom-[0%] md:bottom-[-20%] max-md:h-[90%] max-md:aspect-[1/2.1] md:w-[30%] md:aspect-[1/2] bg-[#1A1A1A] rounded-[2rem] md:rounded-[2.5rem] border border-white/10 shadow-2xl p-[6px] md:p-[8px]"
          style={{ x: iphoneX, y: iphoneY, rotateX: 10, rotateY: 15, rotateZ: -5 }}
        >
          <div className="w-full h-full bg-black rounded-[2rem] overflow-hidden relative border border-white/5">
            <div className="absolute top-2 left-1/2 -translate-x-1/2 w-24 h-6 bg-black rounded-full z-20" /> {/* Dynamic Island */}
            {/* iPhone UI */}
            <div className="absolute inset-0 bg-[#0A0A0A] p-4 flex flex-col gap-3 pt-12">
               <div className="w-full h-32 bg-[#141414] rounded-2xl border border-white/5 relative overflow-hidden">
                  <ImageWithFallback src="https://images.unsplash.com/photo-1651928977880-ffb2d963b6b4?q=80&w=600" alt="Semi truck" className="w-full h-full object-cover opacity-60" />
                  <div className="absolute bottom-3 left-3 bg-black/50 backdrop-blur-md px-3 py-1 rounded-full text-xs text-white border border-white/10">
                    TRK-90210
                  </div>
               </div>
               <div className="flex gap-3">
                 <div className="flex-1 h-20 bg-gradient-to-br from-[#007AFF]/20 to-transparent rounded-2xl border border-[#007AFF]/30 p-3">
                   <div className="text-[10px] text-[#007AFF] uppercase font-bold">ETA</div>
                   <div className="text-lg text-white">14:30</div>
                 </div>
                 <div className="flex-1 h-20 bg-[#141414] rounded-2xl border border-white/5 p-3">
                   <div className="text-[10px] text-[#FF3B30] uppercase font-bold">Temp</div>
                   <div className="text-lg text-white">-2°C</div>
                 </div>
               </div>
               <div className="flex-1 bg-[#141414] rounded-2xl border border-white/5 p-4">
                  <div className="space-y-3">
                    {[1, 2, 3].map(i => (
                      <div key={i} className="w-full h-10 bg-white/5 rounded-xl" />
                    ))}
                  </div>
               </div>
            </div>
          </div>
        </motion.div>
      </motion.div>
      </div>
    </section>
  );
}

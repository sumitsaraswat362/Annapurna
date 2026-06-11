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
  const macX = useTransform(scrollYProgress, [0, 0.5], ["0%", "-15%"]);
  const ipadX = useTransform(scrollYProgress, [0, 0.5], ["0%", "5%"]);
  const iphoneX = useTransform(scrollYProgress, [0, 0.5], ["0%", "20%"]);
  const iphoneY = useTransform(scrollYProgress, [0, 0.5], ["0%", "10%"]);

  return (
    <section ref={containerRef} className="relative h-[200vh] w-full">
      <div className="sticky top-0 h-screen w-full flex flex-col items-center justify-center pt-32 px-6">
        <motion.div 
          className="max-w-4xl mx-auto text-center z-10 mt-32 md:mt-40"
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
          className="mt-12 md:mt-16 w-full max-w-6xl max-md:h-[320px] md:aspect-[21/9] mx-auto z-20 flex justify-center relative"
          style={{ scale, perspective: "2000px" }}
        >
          {/* MacBook Mockup */}
          <motion.div 
            className="absolute left-0 md:left-[5%] top-0 md:top-[10%] w-[90%] md:w-[65%] aspect-[16/9] rounded-[1rem] md:rounded-[1.5rem] shadow-[0_30px_60px_rgba(0,0,0,0.6)] overflow-hidden border border-white/10 bg-[#1A1A1A]"
            style={{ x: macX, rotateX: 5, rotateY: 10, rotateZ: -2 }}
          >
            <img src="/images/macbook_ui.png" alt="MacBook Fleet Dashboard UI" className="w-full h-full object-cover" />
          </motion.div>

          {/* iPad Mockup */}
          <motion.div 
            className="absolute right-[10%] md:right-[20%] bottom-[-5%] md:bottom-[0%] w-[50%] md:w-[40%] aspect-[4/3] rounded-[1.5rem] md:rounded-[2rem] shadow-[0_30px_60px_rgba(0,0,0,0.8)] overflow-hidden border border-white/15 bg-[#1A1A1A]"
            style={{ x: ipadX, rotateX: 8, rotateY: 0, rotateZ: 2 }}
          >
            <img src="/images/ipad_ui.png" alt="iPad Fleet Dashboard UI" className="w-full h-full object-cover" />
          </motion.div>

          {/* iPhone Mockup */}
          <motion.div 
            className="absolute right-[0%] md:right-[5%] bottom-[-15%] md:bottom-[-10%] w-[25%] md:w-[15%] aspect-[9/16] rounded-[2rem] md:rounded-[2.5rem] shadow-[0_30px_60px_rgba(0,0,0,0.9)] overflow-hidden border border-white/20 bg-[#1A1A1A]"
            style={{ x: iphoneX, y: iphoneY, rotateX: 10, rotateY: -10, rotateZ: -4 }}
          >
            <img src="/images/iphone_ui.png" alt="iPhone Fleet App UI" className="w-full h-full object-cover" />
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}

import { motion, useScroll, useTransform } from "motion/react";
import { useRef } from "react";

export function Hero() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"]
  });

  const textY = useTransform(scrollYProgress, [0, 0.25], ["0%", "50%"]);
  const textOpacity = useTransform(scrollYProgress, [0, 0.2], [1, 0]);

  // Devices animation — fade out VERY early so they're gone long before section ends
  const scale = useTransform(scrollYProgress, [0, 0.35], [1, 1.15]);
  const macX = useTransform(scrollYProgress, [0, 0.35], ["0%", "-10%"]);
  const ipadX = useTransform(scrollYProgress, [0, 0.35], ["0%", "8%"]);
  const iphoneX = useTransform(scrollYProgress, [0, 0.35], ["0%", "15%"]);
  const iphoneY = useTransform(scrollYProgress, [0, 0.35], ["0%", "5%"]);
  // Fade out completely between 20% and 35% scroll progress
  // With 300vh section, that's 60vh-105vh of scrolling — devices gone by 105vh
  // Next section starts at 300vh — huge 195vh buffer of empty space
  const mockupOpacity = useTransform(scrollYProgress, [0.2, 0.35], [1, 0]);

  return (
    <section ref={containerRef} className="relative h-[300vh] w-full" style={{ zIndex: 10 }}>
      <div className="sticky top-0 h-screen w-full flex flex-col items-center justify-center pt-32 px-6" style={{ overflow: "visible" }}>
        <motion.div 
          className="max-w-4xl mx-auto text-center mt-32 md:mt-40"
          style={{ y: textY, opacity: textOpacity, zIndex: 10 }}
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

        {/* Mockup Container — images have real PNG transparency, no blend modes */}
        <motion.div 
          className="mt-12 md:mt-16 w-full max-w-6xl max-md:h-[320px] md:aspect-[21/9] mx-auto flex justify-center relative"
          style={{ scale, perspective: "2000px", opacity: mockupOpacity, zIndex: 20 }}
        >
          {/* MacBook Mockup */}
          <motion.div 
            className="absolute left-0 md:left-0 top-[5%] md:top-[10%] w-[100%] md:w-[85%] aspect-[16/9]"
            style={{ x: macX }}
          >
            <img src="/images/macbook_hardware.png" alt="MacBook Fleet Dashboard" className="w-full h-full object-contain" />
          </motion.div>

          {/* iPad Mockup */}
          <motion.div 
            className="absolute right-[5%] md:right-[5%] bottom-[5%] md:bottom-[0%] w-[60%] md:w-[55%] aspect-[4/3]"
            style={{ x: ipadX }}
          >
            <img src="/images/ipad_hardware.png" alt="iPad Fleet Dashboard" className="w-full h-full object-contain" />
          </motion.div>

          {/* iPhone Mockup */}
          <motion.div 
            className="absolute right-[0%] md:right-[0%] bottom-[10%] md:bottom-[0%] w-[35%] md:w-[25%] aspect-[9/16]"
            style={{ x: iphoneX, y: iphoneY }}
          >
            <img src="/images/iphone_hardware.png" alt="iPhone Fleet App" className="w-full h-full object-contain" />
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}

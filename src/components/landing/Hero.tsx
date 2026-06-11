import { motion, useScroll, useTransform } from "motion/react";
import { useRef } from "react";

export function Hero() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"]
  });

  const textY = useTransform(scrollYProgress, [0, 0.3], ["0%", "50%"]);
  const textOpacity = useTransform(scrollYProgress, [0, 0.25], [1, 0]);

  // Devices animation
  const scale = useTransform(scrollYProgress, [0, 0.5], [1, 1.3]);
  const macX = useTransform(scrollYProgress, [0, 0.5], ["0%", "-15%"]);
  const ipadX = useTransform(scrollYProgress, [0, 0.5], ["0%", "10%"]);
  const iphoneX = useTransform(scrollYProgress, [0, 0.5], ["0%", "20%"]);
  const iphoneY = useTransform(scrollYProgress, [0, 0.5], ["0%", "10%"]);
  // Fade devices out well before the section ends so they never get clipped
  const mockupOpacity = useTransform(scrollYProgress, [0.3, 0.5], [1, 0]);

  return (
    <section ref={containerRef} className="relative h-[300vh] w-full">
      <div className="sticky top-0 h-screen w-full flex flex-col items-center justify-center pt-32 px-6 overflow-visible">
        <motion.div 
          className="max-w-4xl mx-auto text-center z-10 mt-32 md:mt-40"
          style={{ y: textY, opacity: textOpacity }}
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

        {/* Mockup Container - NO mix-blend-screen, images now have real transparency */}
        <motion.div 
          className="mt-12 md:mt-16 w-full max-w-6xl max-md:h-[320px] md:aspect-[21/9] mx-auto z-20 flex justify-center relative"
          style={{ scale, perspective: "2000px", opacity: mockupOpacity }}
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

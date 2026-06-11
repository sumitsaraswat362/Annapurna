import { motion, useScroll, useTransform } from "motion/react";
import { useRef } from "react";

export function Hero() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"]
  });

  // Text fades out first
  const textY = useTransform(scrollYProgress, [0, 0.2], ["0%", "40%"]);
  const textOpacity = useTransform(scrollYProgress, [0, 0.15], [1, 0]);

  // === DEVICE EXIT ANIMATIONS ===
  // Each device slides out in its own direction + fades out.
  // Once gone, they stay gone (useTransform clamps at final value).
  const scale = useTransform(scrollYProgress, [0, 0.35], [1.2, 1.4]);

  // MacBook → slides OUT to the LEFT
  const macX = useTransform(scrollYProgress, [0, 0.45], ["0%", "-20%"]);
  const macOpacity = useTransform(scrollYProgress, [0.1, 0.4], [1, 0]);

  // iPad → slides OUT to the TOP
  const ipadY = useTransform(scrollYProgress, [0, 0.45], ["0%", "-20%"]);
  const ipadOpacity = useTransform(scrollYProgress, [0.1, 0.4], [1, 0]);

  // iPhone → slides OUT to the RIGHT
  const iphoneX = useTransform(scrollYProgress, [0, 0.45], ["0%", "20%"]);
  const iphoneOpacity = useTransform(scrollYProgress, [0.1, 0.4], [1, 0]);

  return (
    <section ref={containerRef} className="relative h-[250vh] w-full overflow-x-clip" style={{ zIndex: 10 }}>
      <div className="sticky top-0 h-screen w-full flex flex-col items-center justify-center pt-32 px-6" style={{ overflow: "visible" }}>
        {/* Hero Text */}
        <motion.div 
          className="max-w-4xl mx-auto text-center mt-32 md:mt-40"
          style={{ y: textY, opacity: textOpacity, zIndex: 10 }}
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
        >
          <h1 className="text-5xl md:text-8xl font-semibold tracking-tighter mb-4 md:mb-6 bg-gradient-to-br from-white via-white/90 to-white/40 bg-clip-text text-transparent pb-2 leading-tight">
            Logistics <br /> Perfected by AI.
          </h1>
          <p className="text-xl text-white/50 font-medium max-w-2xl mx-auto">
            The ultimate Food Logistics & Fleet Tracking platform. Built for precision, designed for scale.
          </p>
        </motion.div>

        {/* Device Mockups — transparent PNGs, no blend modes */}
        <motion.div 
          className="mt-12 md:mt-24 w-full max-w-[1400px] max-md:h-[380px] md:aspect-[21/9] mx-auto flex justify-center relative" 
          style={{ zIndex: 20, scale, transformOrigin: "top center" }}
        >
          
          {/* MacBook — exits LEFT */}
          <motion.div 
            className="absolute left-0 md:left-0 top-[5%] md:top-[10%] w-[100%] md:w-[85%] aspect-[16/9]"
            style={{ x: macX, opacity: macOpacity }}
          >
            <img src="/images/macbook_hardware.png" alt="MacBook Fleet Dashboard" className="w-full h-full object-contain" />
          </motion.div>

          {/* iPad — exits UP */}
          <motion.div 
            className="absolute right-[5%] md:right-[5%] bottom-[5%] md:bottom-[0%] w-[60%] md:w-[55%] aspect-[4/3]"
            style={{ y: ipadY, opacity: ipadOpacity }}
          >
            <img src="/images/ipad_hardware.png" alt="iPad Fleet Dashboard" className="w-full h-full object-contain" />
          </motion.div>

          {/* iPhone — exits RIGHT */}
          <motion.div 
            className="absolute right-[0%] md:right-[0%] bottom-[10%] md:bottom-[0%] w-[35%] md:w-[25%] aspect-[9/16]"
            style={{ x: iphoneX, opacity: iphoneOpacity }}
          >
            <img src="/images/iphone_hardware.png" alt="iPhone Fleet App" className="w-full h-full object-contain" />
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}

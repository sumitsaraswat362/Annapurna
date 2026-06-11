import { motion } from "motion/react";
import { MouseEvent, useState } from "react";
import { ImageWithFallback } from "../figma/ImageWithFallback";
import { Globe, ShieldAlert, Cpu, Leaf } from "lucide-react";

export function BentoGrid() {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e: MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setMousePos({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    });
  };

  const containerVariants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] as const } }
  };

  return (
    <section className="py-32 px-6 max-w-7xl mx-auto" id="features">
      <div className="text-center mb-16">
        <h2 className="text-4xl md:text-5xl font-semibold tracking-tight text-white mb-4">
          Everything you need. <br/> <span className="text-white/40">Nothing you don't.</span>
        </h2>
      </div>

      <motion.div 
        className="grid grid-cols-1 md:grid-cols-3 gap-6 relative"
        onMouseMove={handleMouseMove}
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
        style={
          {
            "--mouse-x": `${mousePos.x}px`,
            "--mouse-y": `${mousePos.y}px`,
          } as React.CSSProperties
        }
      >
        {/* Spotlight Effect overlay for the whole grid - simplified for React */}
        
        {/* Box 1: Wholesaler Bidding */}
        <motion.div 
          variants={itemVariants}
          className="col-span-1 md:col-span-2 row-span-2 bg-[#141414] rounded-[2rem] p-8 border border-white/5 relative overflow-hidden group min-h-[400px]"
        >
          <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
               style={{
                 background: "radial-gradient(800px circle at var(--mouse-x) var(--mouse-y), rgba(255,255,255,0.06), transparent 40%)"
               }} 
          />
          <div className="relative z-10 flex flex-col h-full justify-between">
            <div className="max-w-sm">
              <div className="w-12 h-12 bg-white/5 rounded-xl flex items-center justify-center mb-6 border border-white/10">
                <Globe className="text-white w-6 h-6" />
              </div>
              <h3 className="text-2xl font-semibold text-white mb-2">Wholesaler Bidding</h3>
              <p className="text-white/50">Connect with local wholesalers. Automated bidding ensures you get the best price for your excess inventory before it spoils.</p>
            </div>
            
            <div className="mt-8 flex gap-4">
              <div className="bg-white/5 p-4 rounded-2xl border border-white/10 backdrop-blur-sm flex-1">
                <div className="text-xs text-white/40 mb-1">Current Bid</div>
                <div className="text-xl font-medium text-[#34C759]">$4,250.00</div>
              </div>
              <div className="bg-white/5 p-4 rounded-2xl border border-white/10 backdrop-blur-sm flex-1">
                <div className="text-xs text-white/40 mb-1">Time Left</div>
                <div className="text-xl font-medium text-white">04:12:00</div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Box 2: Emergency SOS */}
        <motion.div 
          variants={itemVariants}
          className="col-span-1 bg-[#141414] rounded-[2rem] p-8 border border-white/5 relative overflow-hidden group min-h-[300px]"
        >
           <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
               style={{
                 background: "radial-gradient(600px circle at var(--mouse-x) var(--mouse-y), rgba(255,59,48,0.08), transparent 40%)"
               }} 
          />
          <div className="relative z-10">
            <div className="w-12 h-12 bg-[#FF3B30]/10 rounded-xl flex items-center justify-center mb-6 border border-[#FF3B30]/20">
              <ShieldAlert className="text-[#FF3B30] w-6 h-6" />
            </div>
            <h3 className="text-xl font-semibold text-white mb-2">Emergency SOS</h3>
            <p className="text-white/50 text-sm">Instant dispatch of backup refrigeration units if your primary system fails mid-transit.</p>
          </div>
        </motion.div>

        {/* Box 3: AI Optimization */}
        <motion.div 
          variants={itemVariants}
          className="col-span-1 bg-[#141414] rounded-[2rem] p-8 border border-white/5 relative overflow-hidden group min-h-[300px]"
        >
           <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
               style={{
                 background: "radial-gradient(600px circle at var(--mouse-x) var(--mouse-y), rgba(0,122,255,0.08), transparent 40%)"
               }} 
          />
          <div className="relative z-10">
            <div className="w-12 h-12 bg-[#007AFF]/10 rounded-xl flex items-center justify-center mb-6 border border-[#007AFF]/20">
              <Cpu className="text-[#007AFF] w-6 h-6" />
            </div>
            <h3 className="text-xl font-semibold text-white mb-2">AI Routing</h3>
            <p className="text-white/50 text-sm">Dynamic rerouting based on traffic, weather, and facility wait times.</p>
          </div>
        </motion.div>

        {/* Box 4: Eco Mode */}
        <motion.div 
          variants={itemVariants}
          className="col-span-1 md:col-span-3 bg-[#141414] rounded-[2rem] border border-white/5 relative overflow-hidden group flex flex-col md:flex-row items-center"
        >
          <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
               style={{
                 background: "radial-gradient(1000px circle at var(--mouse-x) var(--mouse-y), rgba(52,199,89,0.06), transparent 40%)"
               }} 
          />
          <div className="p-8 md:w-1/2 relative z-10">
            <div className="w-12 h-12 bg-[#34C759]/10 rounded-xl flex items-center justify-center mb-6 border border-[#34C759]/20">
              <Leaf className="text-[#34C759] w-6 h-6" />
            </div>
            <h3 className="text-2xl font-semibold text-white mb-2">Eco-Efficiency</h3>
            <p className="text-white/50">Reduce carbon footprint by optimizing engine idling and temperature compressor cycles automatically.</p>
          </div>
          <div className="md:w-1/2 h-full w-full min-h-[300px] relative">
             <ImageWithFallback 
                src="https://images.unsplash.com/photo-1587293852726-70cdb56c2866?q=80&w=800" 
                alt="Fresh Produce" 
                className="w-full h-full object-cover opacity-50 absolute inset-0 mix-blend-overlay"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-[#141414] to-transparent" />
          </div>
        </motion.div>

      </motion.div>
    </section>
  );
}

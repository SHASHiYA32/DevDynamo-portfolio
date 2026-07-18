"use client";
import { useState, useEffect } from "react";
import {
  motion,
  AnimatePresence,
  useScroll,
  useMotionValueEvent,
} from "framer-motion";
import { MessageCircleQuestion } from "lucide-react";
import AIChatModal from "@/app/ai-chat/page";

export default function AIChatButton() {
  const [isVisible, setIsVisible] = useState(true);
  const { scrollY } = useScroll();
  const [isAIChatOpen, setIsAIChatOpen] = useState(false);

  useMotionValueEvent(scrollY, "change", (latest) => {
    const previous = scrollY.getPrevious() ?? 0;
    if (latest > previous && latest > 100) {
      setIsVisible(false);
    } else {
      setIsVisible(true);
    }
  });

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.button
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0, opacity: 0 }}
          onClick={() => setIsAIChatOpen(true)}
          className="fixed bottom-6 right-6 z-50 flex items-center gap-2  text-white px-5 py-3 rounded-full bg-linear-to-r from-blue-700 to-green-700 shadow-lg shadow-teal-900/20 border border-white/10 backdrop-blur-sm"
        >
          <MessageCircleQuestion className="w-5 h-5" />
          <span className="font-medium text-sm">Need Help?</span>
        </motion.button>
      )}
      <AIChatModal
        isOpen={isAIChatOpen}
        onClose={() => setIsAIChatOpen(false)}
      />
    </AnimatePresence>
  );
}

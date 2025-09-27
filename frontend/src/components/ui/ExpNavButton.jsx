import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";

const buttonVariants = {
  initial: { gap: 0, paddingLeft: "0.5rem", paddingRight: "0.5rem" },
  animate: (isSelected) => ({
    gap: isSelected ? "0.5rem" : 0,
    paddingLeft: isSelected ? "1rem" : "0.5rem",
    paddingRight: isSelected ? "1rem" : "0.5rem",
  }),
};

const spanVariants = {
  initial: { width: 0, opacity: 0 },
  animate: { width: "auto", opacity: 1 },
  exit: { width: 0, opacity: 0 },
};

const transition = { delay: 0.1, type: "spring", bounce: 0, duration: 0.6 };

export function ExpNavButton({ to, label, Icon }) {
  const [selected, setSelected] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (ref.current && !ref.current.contains(event.target)) {
        setSelected(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("touchstart", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("touchstart", handleClickOutside);
    };
  }, []);

  return (
    <motion.div ref={ref}>
      <motion.button
        variants={buttonVariants}
        initial={false}
        animate="animate"
        custom={selected}
        onClick={() => setSelected(!selected)}
        transition={transition}
        className="flex items-center rounded-xl bg-gradient-to-r from-blue-500 to-indigo-500 text-white px-2 py-2 text-sm font-medium shadow-md hover:from-blue-600 hover:to-indigo-600"
      >
        <Icon size={20} />
        <AnimatePresence initial={false}>
          {selected && (
            <motion.span
              variants={spanVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              transition={transition}
              className="overflow-hidden ml-2"
            >
              <Link to={to}>{label}</Link>
            </motion.span>
          )}
        </AnimatePresence>
      </motion.button>
    </motion.div>
  );
  
}
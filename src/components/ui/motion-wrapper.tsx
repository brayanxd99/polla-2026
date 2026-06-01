"use client"

import { motion, HTMLMotionProps } from "framer-motion"

export function MotionDiv({ children, ...props }: HTMLMotionProps<"div">) {
  return <motion.div {...props}>{children}</motion.div>
}

export function MotionTbody({ children, ...props }: HTMLMotionProps<"tbody">) {
  return <motion.tbody {...props}>{children}</motion.tbody>
}

export function MotionTr({ children, ...props }: HTMLMotionProps<"tr">) {
  return <motion.tr {...props}>{children}</motion.tr>
}

export const staggerContainer = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
}

export const fadeUpVariant = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { type: "spring" as const, stiffness: 300, damping: 24 } }
}

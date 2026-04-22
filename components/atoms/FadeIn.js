import { motion } from 'framer-motion'

export default function FadeIn({ variants, className, children, infinity, style }) {
  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once: !infinity }}
      variants={variants}
      className={className}
      style={style}
      transition={{ staggerChildren: 0.5 }}
    >
      {children}
    </motion.div>
  )
}

import { motion } from 'framer-motion'

export const Card = ({ 
  children, 
  className = '', 
  hover = true,
  gradient = false,
  ...props 
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={hover ? { y: -8, boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)' } : {}}
      className={`
        ${gradient 
          ? 'bg-gradient-to-br from-white via-blue-50/30 to-purple-50/30' 
          : 'bg-white'
        }
        rounded-3xl shadow-lg overflow-hidden
        transition-all duration-300
        ${className}
      `}
      {...props}
    >
      {children}
    </motion.div>
  )
}

export default Card

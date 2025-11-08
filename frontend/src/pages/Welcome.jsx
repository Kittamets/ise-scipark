import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Car, ArrowRight, Sparkles, Shield, Clock, DollarSign } from 'lucide-react'
import Button from '../components/ui/Button'

const Welcome = () => {
  const navigate = useNavigate()

  const features = [
    {
      icon: Clock,
      title: 'จองง่าย รวดเร็ว',
      description: 'จองที่จอดได้ภายในไม่กี่วินาที'
    },
    {
      icon: Shield,
      title: 'ปลอดภัย มั่นใจ',
      description: 'ระบบรักษาความปลอดภัยระดับสูง'
    },
    {
      icon: DollarSign,
      title: 'ประหยัด คุ้มค่า',
      description: 'ราคายุติธรรม พร้อมโปรโมชันมากมาย'
    }
  ]

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-orange-400 via-orange-500 to-orange-600 flex items-center justify-center px-4 py-8 sm:py-12 overflow-hidden">
      <div className="relative z-10 max-w-5xl w-full mx-auto">
        {/* Main Content */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-8 sm:mb-12"
        >
          {/* App Icon */}
          <motion.div
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ 
              type: "spring",
              stiffness: 200,
              damping: 15,
              delay: 0.2
            }}
            className="inline-flex items-center justify-center w-24 h-24 sm:w-28 sm:h-28 lg:w-32 lg:h-32 bg-white rounded-2xl sm:rounded-3xl shadow-2xl mb-6 sm:mb-8"
          >
            <Car className="w-12 h-12 sm:w-14 sm:h-14 lg:w-16 lg:h-16 text-orange-600" />
          </motion.div>

          {/* Main Title */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-3 sm:mb-4 drop-shadow-lg px-4 leading-tight max-w-4xl mx-auto"
          >
            พร้อมที่จะเริ่มต้น
            <br />
            แล้วหรือยัง?
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="text-base sm:text-lg lg:text-xl xl:text-2xl text-white/90 mb-6 sm:mb-8 font-medium px-4 max-w-2xl mx-auto"
          >
            เริ่มต้นใช้งานฟรีวันนี้
          </motion.p>

          {/* CTA Button - Updated */}
          <div className="mb-10 sm:mb-12 w-full flex justify-center px-4">
            <motion.button
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              transition={{ delay: 0.8 }}
              onClick={() => navigate('/login')}
              className="bg-white text-orange-600 hover:bg-orange-50 font-bold text-base sm:text-lg px-8 sm:px-10 py-3.5 sm:py-4 rounded-2xl shadow-2xl hover:shadow-orange-900/30 transition-all duration-300 flex items-center justify-center gap-2.5 w-full max-w-xs"
            >
              <span>ลงทะเบียนเลย</span>
              <ArrowRight className="w-5 h-5" />
            </motion.button>
          </div>

          {/* Feature Cards */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1 }}
            className="grid grid-cols-1 sm:grid-cols-3 gap-4 lg:gap-6 max-w-5xl mx-auto"
          >
            {features.map((feature, index) => {
              const Icon = feature.icon
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 1.2 + index * 0.1 }}
                  whileHover={{ scale: 1.05, y: -5 }}
                  className="bg-white/10 backdrop-blur-sm border-2 border-white/20 rounded-2xl p-5 lg:p-6 hover:bg-white/20 transition-all duration-300"
                >
                  <div className="w-12 h-12 lg:w-14 lg:h-14 bg-white/20 rounded-xl flex items-center justify-center mx-auto mb-3">
                    <Icon className="w-6 h-6 lg:w-7 lg:h-7 text-white" />
                  </div>
                  <h3 className="text-white font-bold text-base lg:text-lg mb-2 text-center">
                    {feature.title}
                  </h3>
                  <p className="text-white/80 text-sm lg:text-base text-center leading-relaxed">
                    {feature.description}
                  </p>
                </motion.div>
              )
            })}
          </motion.div>
        </motion.div>

        {/* Footer */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5 }}
          className="text-center px-4"
        >
          <p className="text-white/90 text-sm lg:text-base">
            มีบัญชีอยู่แล้ว?{' '}
            <button
              onClick={() => navigate('/login')}
              className="font-bold underline hover:text-white transition-colors decoration-2 underline-offset-2"
            >
              เข้าสู่ระบบ
            </button>
          </p>
        </motion.div>

      </div>

      {/* Decorative Elements */}
      <div className="absolute top-10 left-5 sm:left-10 w-16 h-16 sm:w-20 sm:h-20 bg-white/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 right-5 sm:right-10 w-24 h-24 sm:w-32 sm:h-32 bg-white/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-1/2 right-10 sm:right-20 w-12 h-12 sm:w-16 sm:h-16 bg-yellow-300/20 rounded-full blur-2xl pointer-events-none" />
    </div>
  )
}

export default Welcome

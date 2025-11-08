import { useState, useEffect } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { MapPin, Clock, QrCode, AlertCircle, Car, CheckCircle, LogOut, Timer } from 'lucide-react'
import { useAuthStore } from '../stores/authStore'
import { useBookingStore } from '../stores/bookingStore'
import { bookingAPI } from '../utils/apiService'
import Button from '../components/ui/Button'
import Card from '../components/ui/Card'
import Modal from '../components/ui/Modal'
import QRCodeDisplay from '../components/QRCodeDisplay'
import toast from 'react-hot-toast'

const ActiveBooking = () => {
  const navigate = useNavigate()
  const { activeBooking, clearActiveBooking, updateBooking } = useBookingStore()
  const [timeElapsed, setTimeElapsed] = useState('00:00:00')
  const [showCancelModal, setShowCancelModal] = useState(false)
  const [showQRModal, setShowQRModal] = useState(false)
  const [loading, setLoading] = useState(false)
  const [showFinishModal, setShowFinishModal] = useState(false)

  // Timer for elapsed time from startTime
  useEffect(() => {
    if (!activeBooking) return

    const interval = setInterval(() => {
      const start = new Date(activeBooking.startTime)
      const now = new Date()
      const diff = now - start

      const hours = Math.floor(diff / (1000 * 60 * 60))
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))
      const seconds = Math.floor((diff % (1000 * 60)) / 1000)

      setTimeElapsed(
        `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`
      )
    }, 1000)

    return () => clearInterval(interval)
  }, [activeBooking])

  const calculateCost = () => {
    if (!activeBooking) return 0
    
    const start = new Date(activeBooking.startTime)
    const now = new Date()
    const hoursElapsed = (now - start) / (1000 * 60 * 60)
    
    // First hour is free
    const chargeableHours = Math.max(0, Math.ceil(hoursElapsed) - 1)
    return chargeableHours * (activeBooking.price || 20)
  }

  const handleFinishParking = () => {
    setShowFinishModal(true)
  }

  const confirmFinishParking = () => {
    const cost = calculateCost()
    if (cost > 0) {
      navigate('/app/payment', { state: { booking: activeBooking, cost } })
    } else {
      // Free (less than 1 hour)
      toast.success('ขอบคุณที่ใช้บริการ! (ชั่วโมงแรกฟรี)')
      clearActiveBooking()
      navigate('/app')
    }
  }

  const handleCancelBooking = async () => {
    setLoading(true)
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      clearActiveBooking()
      toast.success('ยกเลิกการจองเรียบร้อย')
      navigate('/app')
      
    } catch (error) {
      console.error('Cancel error:', error)
      toast.error('เกิดข้อผิดพลาด')
    } finally {
      setLoading(false)
      setShowCancelModal(false)
    }
  }

  if (!activeBooking) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="max-w-lg w-full mx-auto"
        >
          <Card className="text-center p-6 sm:p-8 lg:p-12 shadow-2xl border-2 border-gray-100">
            {/* Car Icon with Animation */}
            <motion.div
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ 
                type: "spring",
                stiffness: 260,
                damping: 20,
                delay: 0.1 
              }}
              className="inline-flex items-center justify-center w-32 h-32 lg:w-40 lg:h-40 bg-gradient-to-br from-red-400 via-red-500 to-pink-500 rounded-3xl mb-8 shadow-xl"
            >
              <Car className="w-16 h-16 lg:w-20 lg:h-20 text-white" />
            </motion.div>

            {/* Title */}
            <motion.h2
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-4 px-4"
            >
              ไม่มีการจอง
            </motion.h2>

            {/* Description */}
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="text-base sm:text-lg text-gray-600 mb-8 leading-relaxed px-4"
            >
              คุณไม่มีการจองที่จอดรถในขณะนี้
            </motion.p>

            {/* CTA Button */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
            >
              <Link to="/app" className="block">
                <motion.button
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  className="w-full max-w-sm mx-auto block text-base lg:text-lg font-bold py-4 px-6 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 hover:from-indigo-700 hover:via-purple-700 hover:to-pink-700 text-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
                >
                  ไปจองที่จอด
                </motion.button>
              </Link>
            </motion.div>
          </Card>
        </motion.div>
      </div>
    )
  }

  const cost = calculateCost()

  return (
    <div className="min-h-screen pb-20 lg:pb-8">
      <div className="max-w-3xl mx-auto px-6 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <Card>
            {/* Header Image */}
            <div className="relative h-64 bg-gradient-to-br from-blue-200 to-purple-300 flex items-center justify-center">
              <div className="text-9xl">🏛️</div>
              <div className="absolute top-4 right-4 bg-green-500 text-white px-4 py-2 rounded-full font-bold flex items-center gap-2 shadow-lg">
                <span className="w-2 h-2 bg-white rounded-full animate-pulse"></span>
                กำลังใช้งาน
              </div>
            </div>

            {/* Content */}
            <div className="p-8 space-y-6">
              {/* Spot Info */}
              <div className="flex items-start justify-between">
                <div>
                  <h1 className="text-4xl font-bold mb-2">ที่จอด {activeBooking.spotName || 'A-10'}</h1>
                  <div className="flex items-center gap-2 text-gray-600 mb-2">
                    <MapPin className="w-5 h-5" />
                    <span>{activeBooking.floor || 'ชั้น 1 - ภาควิชาเคมี'}</span>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm text-gray-600 mb-1">เวลาที่จอด</p>
                  <div className="flex items-center gap-2 text-3xl font-bold text-primary-600">
                    <Clock className="w-8 h-8" />
                    {timeElapsed}
                  </div>
                </div>
              </div>

              {/* Cost Info */}
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-2xl p-6 text-center border-2 border-orange-200">
                  <p className="text-gray-600 mb-2">ค่าจอด/ชั่วโมง</p>
                  <p className="text-4xl font-bold text-orange-600">{activeBooking.price || 20} ฿</p>
                </div>
                <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-2xl p-6 text-center border-2 border-green-200">
                  <p className="text-gray-600 mb-2">คิดเป็นเงิน</p>
                  <p className="text-4xl font-bold text-green-600">{cost} ฿</p>
                </div>
              </div>

              {/* Free Hour Info */}
              {cost === 0 && (
                <div className="bg-blue-50 border-2 border-blue-200 rounded-2xl p-4">
                  <p className="text-blue-800 text-center font-semibold">
                    🎉 ชั่วโมงแรกฟรี! คุณยังไม่มีค่าใช้จ่าย
                  </p>
                </div>
              )}

              {/* QR Code Section */}
              <div className="bg-yellow-50 border-2 border-yellow-200 rounded-2xl p-6 text-center">
                <div className="flex items-start gap-3 text-left mb-4">
                  <AlertCircle className="w-6 h-6 text-yellow-600 flex-shrink-0 mt-1" />
                  <p className="text-yellow-800">
                    เมื่อเข้าจอดแล้ว กรุณาแสดง QR Code ณ จุดจอดเพื่อยืนยันว่าคุณอยู่ในระบบ
                  </p>
                </div>
                <Button
                  variant="primary"
                  size="lg"
                  onClick={() => setShowQRModal(true)}
                  icon={QrCode}
                  className="w-full"
                >
                  แสดง QR Code
                </Button>
              </div>

              {/* Booking Details */}
              <div className="bg-gray-50 rounded-2xl p-6 space-y-3">
                <h3 className="font-bold text-lg mb-4">รายละเอียดการจอง</h3>
                <div className="flex justify-between">
                  <span className="text-gray-600">เลขที่การจอง</span>
                  <span className="font-mono font-bold">#{activeBooking.bookingId || activeBooking.id}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">เวลาเริ่มจอด</span>
                  <span className="font-bold">
                    {new Date(activeBooking.startTime).toLocaleTimeString('th-TH', {
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">วันที่</span>
                  <span className="font-bold">
                    {new Date(activeBooking.startTime).toLocaleDateString('th-TH', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="space-y-3">
                <Button
                  variant="primary"
                  size="lg"
                  onClick={handleFinishParking}
                  disabled={loading}
                  className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700"
                >
                  <CheckCircle className="w-5 h-5 mr-2" />
                  เสร็จสิ้นการจอด
                </Button>
                
                <Button
                  variant="danger"
                  size="lg"
                  onClick={() => setShowCancelModal(true)}
                  className="w-full"
                  disabled={loading}
                >
                  ยกเลิกการจอง
                </Button>
              </div>

              {/* Help */}
              <div className="text-center">
                <Link to="/app/help" className="text-primary-600 hover:underline text-sm">
                  ต้องการความช่วยเหลือ?
                </Link>
              </div>
            </div>
          </Card>
        </motion.div>
      </div>

      {/* QR Code Modal */}
      <Modal
        isOpen={showQRModal}
        onClose={() => setShowQRModal(false)}
        title="QR Code สำหรับเข้าจอด"
      >
        {activeBooking?.qrCode?.qrCodeURL ? (
          <QRCodeDisplay 
            booking={activeBooking}
            qrCodeURL={activeBooking.qrCode.qrCodeURL}
            onClose={() => setShowQRModal(false)}
          />
        ) : (
          <div className="text-center space-y-4">
            <div className="bg-white p-8 rounded-3xl inline-block border-4 border-primary-500">
              <div className="w-64 h-64 bg-gray-100 rounded-2xl flex items-center justify-center">
                {/* Mock QR Code - Fallback */}
                <div className="grid grid-cols-8 gap-1">
                  {Array.from({ length: 64 }).map((_, i) => (
                    <div
                      key={i}
                      className={`w-3 h-3 ${Math.random() > 0.5 ? 'bg-black' : 'bg-white'}`}
                    />
                  ))}
                </div>
              </div>
            </div>
            
            <div className="bg-gray-50 rounded-2xl p-4">
              <p className="font-mono text-lg font-bold mb-2">#{activeBooking._id?.slice(-6) || 'N/A'}</p>
              <p className="text-sm text-gray-600">แสกน QR Code นี้ที่จุดจอดรถ</p>
            </div>

            <Button
              variant="secondary"
              size="lg"
              onClick={() => setShowQRModal(false)}
              className="w-full"
            >
              ปิด
            </Button>
          </div>
        )}
      </Modal>

      {/* Finish Parking Modal */}
      <Modal
        isOpen={showFinishModal}
        onClose={() => setShowFinishModal(false)}
        title="เสร็จสิ้นการจอด"
      >
        <div className="space-y-4">
          <div className="bg-green-50 border-2 border-green-200 rounded-2xl p-6 text-center">
            <CheckCircle className="w-16 h-16 text-green-600 mx-auto mb-4" />
            <h4 className="text-2xl font-bold text-green-800 mb-2">
              ค่าจอดรถทั้งหมด
            </h4>
            <p className="text-5xl font-bold text-green-600 mb-2">
              {calculateCost()} ฿
            </p>
            <p className="text-sm text-gray-600">
              เวลาจอด: {timeElapsed}
            </p>
          </div>

          <div className="flex gap-3">
            <Button
              variant="secondary"
              size="lg"
              className="flex-1"
              onClick={() => setShowFinishModal(false)}
            >
              ยกเลิก
            </Button>
            <Button
              variant="primary"
              size="lg"
              className="flex-1 bg-gradient-to-r from-green-600 to-emerald-600"
              onClick={confirmFinishParking}
            >
              {calculateCost() === 0 ? 'เสร็จสิ้น' : 'ไปชำระเงิน'}
            </Button>
          </div>
        </div>
      </Modal>

      {/* Cancel Confirmation Modal */}
      <Modal
        isOpen={showCancelModal}
        onClose={() => setShowCancelModal(false)}
        title="ยืนยันการยกเลิก"
      >
        <div className="space-y-4">
          <div className="bg-red-50 border-2 border-red-200 rounded-2xl p-4">
            <div className="flex items-start gap-3">
              <AlertCircle className="w-6 h-6 text-red-500 flex-shrink-0" />
              <div>
                <h4 className="font-bold text-red-800 mb-2">คุณแน่ใจหรือไม่?</h4>
                <p className="text-red-700">
                  การยกเลิกจะส่งผลให้คุณสูญเสียที่จอดนี้ และอาจต้องรอคิวใหม่
                </p>
              </div>
            </div>
          </div>

          <div className="flex gap-3">
            <Button
              variant="secondary"
              size="lg"
              className="flex-1"
              onClick={() => setShowCancelModal(false)}
              disabled={loading}
            >
              เก็บไว้
            </Button>
            <Button
              variant="danger"
              size="lg"
              className="flex-1"
              onClick={handleCancelBooking}
              loading={loading}
            >
              ยืนยันยกเลิก
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  )
}

export default ActiveBooking

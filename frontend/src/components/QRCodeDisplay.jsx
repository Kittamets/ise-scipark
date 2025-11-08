import { QRCodeSVG } from 'qrcode.react'
import { motion } from 'framer-motion'
import { Download, Share2 } from 'lucide-react'
import Button from './ui/Button'
import toast from 'react-hot-toast'

/**
 * QR Code Display Component
 * Shows QR code for booking check-in
 */
const QRCodeDisplay = ({ booking, qrCodeURL, onClose }) => {
  const handleDownload = () => {
    try {
      // Create download link
      const link = document.createElement('a')
      link.href = qrCodeURL
      link.download = `booking-${booking._id}-qr.png`
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      
      toast.success('ดาวน์โหลด QR Code สำเร็จ')
    } catch (error) {
      console.error('Download error:', error)
      toast.error('ไม่สามารถดาวน์โหลดได้')
    }
  }

  const handleShare = async () => {
    try {
      if (navigator.share) {
        // Convert data URL to blob
        const response = await fetch(qrCodeURL)
        const blob = await response.blob()
        const file = new File([blob], `booking-qr-${booking._id}.png`, { type: 'image/png' })

        await navigator.share({
          title: 'SciPark Booking QR Code',
          text: `QR Code สำหรับการจอง #${booking._id}`,
          files: [file]
        })
        
        toast.success('แชร์สำเร็จ')
      } else {
        // Fallback: Copy to clipboard
        toast.info('กรุณาใช้ปุ่มดาวน์โหลดแทน')
      }
    } catch (error) {
      if (error.name !== 'AbortError') {
        console.error('Share error:', error)
        toast.error('ไม่สามารถแชร์ได้')
      }
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      className="space-y-6"
    >
      {/* QR Code Display */}
      <div className="bg-white p-8 rounded-3xl inline-block border-4 border-primary-500 shadow-2xl mx-auto">
        {qrCodeURL ? (
          <img 
            src={qrCodeURL} 
            alt="Booking QR Code"
            className="w-64 h-64 sm:w-80 sm:h-80"
          />
        ) : (
          <div className="w-64 h-64 sm:w-80 sm:h-80 bg-gray-100 rounded-2xl flex items-center justify-center">
            <div className="text-center text-gray-500">
              <p className="text-sm">ไม่สามารถโหลด QR Code</p>
            </div>
          </div>
        )}
      </div>

      {/* Booking Info */}
      <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-6 border-2 border-blue-200">
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <span className="text-gray-700 font-medium">เลขที่การจอง</span>
            <span className="font-mono font-bold text-lg">#{booking._id?.slice(-6) || 'N/A'}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-gray-700 font-medium">ช่องจอด</span>
            <span className="font-bold">{booking.spotName || booking.spot?.spotNumber || 'N/A'}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-gray-700 font-medium">โซน</span>
            <span className="font-bold">{booking.zoneName || 'N/A'}</span>
          </div>
        </div>
      </div>

      {/* Instructions */}
      <div className="bg-yellow-50 border-2 border-yellow-200 rounded-2xl p-4">
        <div className="text-yellow-800 space-y-2">
          <p className="font-bold">📱 วิธีใช้งาน QR Code:</p>
          <ol className="text-sm space-y-1 ml-4 list-decimal">
            <li>แสดง QR Code นี้ที่จุดจอดรถ</li>
            <li>สแกน QR Code ด้วยเครื่องอ่าน หรือ</li>
            <li>ให้เจ้าหน้าที่ตรวจสอบ</li>
            <li>รอการยืนยันการ Check-in</li>
          </ol>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="grid grid-cols-2 gap-3">
        <Button
          variant="secondary"
          size="lg"
          icon={Download}
          onClick={handleDownload}
          className="w-full"
        >
          ดาวน์โหลด
        </Button>
        
        {navigator.share && (
          <Button
            variant="secondary"
            size="lg"
            icon={Share2}
            onClick={handleShare}
            className="w-full"
          >
            แชร์
          </Button>
        )}
      </div>

      {/* Close Button */}
      <Button
        variant="primary"
        size="lg"
        onClick={onClose}
        className="w-full"
      >
        ปิด
      </Button>

      {/* Warning */}
      <p className="text-center text-xs text-gray-500">
        QR Code นี้ใช้ได้จนถึงเวลาสิ้นสุดการจองเท่านั้น
      </p>
    </motion.div>
  )
}

export default QRCodeDisplay

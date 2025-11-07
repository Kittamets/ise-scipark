import { useState, useEffect } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { MapPin, Clock, AlertCircle, Info, ArrowLeft } from 'lucide-react'
import { useBookingStore } from '../stores/bookingStore'
import { useAuthStore } from '../stores/authStore'
import Button from '../components/ui/Button'
import Card from '../components/ui/Card'
import Badge from '../components/ui/Badge'
import Modal from '../components/ui/Modal'
import toast from 'react-hot-toast'

const ParkingDetail = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const { user } = useAuthStore()
  const { activeBooking, setActiveBooking } = useBookingStore()
  const [parkingSpot, setParkingSpot] = useState(null)
  const [selectedFloor, setSelectedFloor] = useState(null)
  const [showConfirmModal, setShowConfirmModal] = useState(false)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    fetchParkingSpot()
  }, [id])

  const fetchParkingSpot = () => {
    // Mock data - replace with actual API call
    const mockSpots = {
      '1': { 
        id: 1, 
        name: 'หน้าตึกวิทย์ 1', 
        zone: 'A',
        available: 12, 
        total: 25, 
        pricePerHour: 20, 
        image: '🏛️',
        description: 'ที่จอดรถหน้าตึกวิทยาศาสตร์ 1 สะดวกสบาย ใกล้ห้องเรียน',
        floors: [
          { name: 'ชั้น 1 - ภาควิชาเคมี', available: 3 },
          { name: 'ชั้น 2 - ภาควิชาชีวเคมี', available: 2 },
          { name: 'ชั้น 3 - ภาควิชานิเทศศาสตร์', available: 4 },
          { name: 'ชั้น 4 - ภาควิชาชีววิทยา', available: 2 },
          { name: 'ชั้น 5 - ภาควิชาเคมี', available: 1 }
        ],
        facilities: ['ลิฟต์', 'ห้องน้ำ', 'รปภ. 24 ชม.', 'กล้อง CCTV'],
        rules: [
          'ต้องเข้าจอดภายใน 30 นาทีหลังจองจอง',
          'ห้ามจอดเกิน 24 ชั่วโมง',
          'กรุณาปิดไฟรถทุกครั้ง',
          'รักษาความสะอาดและความเรียบร้อย'
        ]
      },
      '2': {
        id: 2,
        name: 'ลานจอด A',
        zone: 'A',
        available: 18,
        total: 30,
        pricePerHour: 20,
        image: '🅰️',
        description: 'ลานจอดกลางแจ้ง โล่งสบาย',
        facilities: ['รปภ. 24 ชม.', 'กล้อง CCTV', 'ไฟส่องสว่าง'],
        rules: [
          'ต้องเข้าจอดภายใน 30 นาทีหลังจองจอง',
          'ห้ามจอดเกิน 24 ชั่วโมง'
        ]
      }
      // Add more spots as needed
    }

    setParkingSpot(mockSpots[id] || mockSpots['1'])
    if (mockSpots[id]?.floors) {
      setSelectedFloor(mockSpots[id].floors[0])
    }
  }

  const handleBooking = async () => {
    if (activeBooking) {
      toast.error('คุณมีการจองอยู่แล้ว กรุณายกเลิกก่อนทำรายการใหม่')
      return
    }

    setShowConfirmModal(true)
  }

  const confirmBooking = async () => {
    setLoading(true)
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500))
      
      // Create booking
      const booking = {
        id: Date.now(),
        spotId: parkingSpot.id,
        spotName: parkingSpot.name,
        floor: selectedFloor?.name || 'N/A',
        startTime: new Date(),
        price: parkingSpot.pricePerHour,
        status: 'active'
      }
      
      setActiveBooking(booking)
      toast.success('จองสำเร็จ! 🎉')
      
      setTimeout(() => {
        navigate('/app/booking')
      }, 1000)
      
    } catch (error) {
      console.error('Booking error:', error)
      toast.error('เกิดข้อผิดพลาด กรุณาลองใหม่อีกครั้ง')
    } finally {
      setLoading(false)
      setShowConfirmModal(false)
    }
  }

  if (!parkingSpot) {
    return <div className="p-6">Loading...</div>
  }

  const discount = user?.rank === 'Diamond' ? 10 : user?.rank === 'Predator' ? 15 : 0
  const finalPrice = parkingSpot.pricePerHour - (parkingSpot.pricePerHour * discount / 100)

  return (
    <div className="min-h-screen pb-20 lg:pb-8">
      <div className="max-w-4xl mx-auto px-6 py-8">
        {/* Back Button */}
        <Link to="/app">
          <motion.button
            whileHover={{ x: -5 }}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6 font-medium"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>กลับ</span>
          </motion.button>
        </Link>

        <Card>
          {/* Image Header */}
          <div className="relative h-80 bg-gradient-to-br from-orange-200 to-orange-300 flex items-center justify-center">
            <div className="text-9xl">{parkingSpot.image}</div>
            <div className="absolute top-4 right-4">
              {parkingSpot.available > 0 ? (
                <Badge variant="success" size="lg">
                  ว่าง {parkingSpot.available} ที่
                </Badge>
              ) : (
                <Badge variant="danger" size="lg">
                  เต็ม
                </Badge>
              )}
            </div>
          </div>

          {/* Content */}
          <div className="p-8 space-y-8">
            {/* Title & Description */}
            <div>
              <h1 className="text-4xl font-bold mb-2">{parkingSpot.name}</h1>
              <div className="flex items-center gap-2 text-gray-600 mb-4">
                <MapPin className="w-5 h-5" />
                <span>โซน {parkingSpot.zone}</span>
              </div>
              <p className="text-gray-600 text-lg">{parkingSpot.description}</p>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center p-4 bg-gray-50 rounded-2xl">
                <p className="text-sm text-gray-600 mb-1">ที่ว่าง</p>
                <p className="text-3xl font-bold text-green-600">{parkingSpot.available}</p>
              </div>
              <div className="text-center p-4 bg-gray-50 rounded-2xl">
                <p className="text-sm text-gray-600 mb-1">ทั้งหมด</p>
                <p className="text-3xl font-bold text-gray-900">{parkingSpot.total}</p>
              </div>
              <div className="text-center p-4 bg-gray-50 rounded-2xl">
                <p className="text-sm text-gray-600 mb-1">Rank คุณ</p>
                <p className="text-2xl font-bold text-purple-600">{user?.rank || 'Iron'}</p>
              </div>
              <div className="text-center p-4 bg-gray-50 rounded-2xl">
                <p className="text-sm text-gray-600 mb-1">ส่วนลด</p>
                <p className="text-3xl font-bold text-orange-600">{discount}%</p>
              </div>
            </div>

            {/* Floors Selection (if available) */}
            {parkingSpot.floors && (
              <div>
                <h3 className="text-xl font-bold mb-4">เลือกชั้นที่ต้องการ</h3>
                <div className="space-y-3">
                  {parkingSpot.floors.map((floor, index) => (
                    <motion.button
                      key={index}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => setSelectedFloor(floor)}
                      className={`
                        w-full p-4 rounded-2xl border-2 text-left transition-all
                        ${selectedFloor?.name === floor.name
                          ? 'border-primary-500 bg-primary-50'
                          : 'border-gray-200 hover:border-primary-300'
                        }
                        ${floor.available === 0 ? 'opacity-50 cursor-not-allowed' : ''}
                      `}
                      disabled={floor.available === 0}
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-semibold text-lg">{floor.name}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-sm text-gray-600">ว่าง</p>
                          <p className={`text-2xl font-bold ${floor.available > 0 ? 'text-green-600' : 'text-red-600'}`}>
                            {floor.available}
                          </p>
                        </div>
                      </div>
                    </motion.button>
                  ))}
                </div>
              </div>
            )}

            {/* Price Box */}
            <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-3xl p-6 border-2 border-orange-200">
              <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <Info className="w-5 h-5" />
                ค่าธรรมเนียมการจอง
              </h3>
              
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-gray-700">ราคาปกติ</span>
                  <span className="text-xl font-bold text-gray-900">
                    {parkingSpot.pricePerHour} ฿/ชม.
                  </span>
                </div>
                
                {discount > 0 && (
                  <div className="flex justify-between items-center">
                    <span className="text-gray-700">ส่วนลด ({user?.rank})</span>
                    <span className="text-xl font-bold text-green-600">
                      -{discount}%
                    </span>
                  </div>
                )}
                
                <div className="border-t-2 border-orange-200 pt-3">
                  <div className="flex justify-between items-center">
                    <span className="text-lg font-semibold">ราคาสุทธิ</span>
                    <span className="text-3xl font-bold text-orange-600">
                      {finalPrice} ฿/ชม.
                    </span>
                  </div>
                </div>
              </div>

              <div className="mt-4 p-4 bg-blue-50 rounded-xl border border-blue-200">
                <p className="text-sm text-blue-800 flex items-start gap-2">
                  <Clock className="w-4 h-4 mt-0.5 flex-shrink-0" />
                  <span>ชั่วโมงแรกฟรี! เริ่มคิดค่าบริการหลังจากจอดครบ 1 ชั่วโมง</span>
                </p>
              </div>
            </div>

            {/* Facilities */}
            {parkingSpot.facilities && (
              <div>
                <h3 className="text-xl font-bold mb-4">สิ่งอำนวยความสะดวก</h3>
                <div className="flex flex-wrap gap-2">
                  {parkingSpot.facilities.map((facility, index) => (
                    <Badge key={index} variant="default" size="md">
                      ✓ {facility}
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            {/* Rules */}
            {parkingSpot.rules && (
              <div>
                <h3 className="text-xl font-bold mb-4">กฎและข้อตกลง</h3>
                <ul className="space-y-2">
                  {parkingSpot.rules.map((rule, index) => (
                    <li key={index} className="flex items-start gap-3 text-gray-700">
                      <span className="text-primary-600 mt-1">•</span>
                      <span>{rule}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Warning */}
            <div className="bg-red-50 border-2 border-red-200 rounded-2xl p-4">
              <div className="flex items-start gap-3">
                <AlertCircle className="w-6 h-6 text-red-500 flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-bold text-red-800 mb-1">สำคัญ!</h4>
                  <p className="text-red-700">
                    หากไม่เข้าจอดภายใน 30 นาที จะยกเลิกการจองโดยอัตโนมัติ
                  </p>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-4">
              <Button
                variant="secondary"
                size="lg"
                className="flex-1"
                onClick={() => navigate('/app')}
              >
                ดูที่จอดอื่น
              </Button>
              <Button
                variant="primary"
                size="lg"
                className="flex-1"
                onClick={handleBooking}
                disabled={parkingSpot.available === 0 || !!activeBooking}
              >
                {parkingSpot.available === 0 ? 'เต็มแล้ว' : activeBooking ? 'มีการจองอยู่แล้ว' : 'ยืนยันการจอง'}
              </Button>
            </div>
          </div>
        </Card>
      </div>

      {/* Confirm Modal */}
      <Modal
        isOpen={showConfirmModal}
        onClose={() => setShowConfirmModal(false)}
        title="ยืนยันการจอง"
      >
        <div className="space-y-4">
          <div className="bg-gray-50 rounded-2xl p-4 space-y-3">
            <div className="flex justify-between">
              <span className="text-gray-600">ที่จอด</span>
              <span className="font-bold">{parkingSpot.name}</span>
            </div>
            {selectedFloor && (
              <div className="flex justify-between">
                <span className="text-gray-600">ชั้น</span>
                <span className="font-bold">{selectedFloor.name}</span>
              </div>
            )}
            <div className="flex justify-between">
              <span className="text-gray-600">ราคา</span>
              <span className="font-bold text-orange-600">{finalPrice} ฿/ชม.</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">ส่วนลด</span>
              <span className="font-bold text-green-600">{discount}%</span>
            </div>
          </div>

          <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-3">
            <p className="text-sm text-yellow-800">
              ⏱️ กรุณาเข้าจอดภายใน 30 นาที มิฉะนั้นจะยกเลิกการจองอัตโนมัติ
            </p>
          </div>

          <div className="flex gap-3">
            <Button
              variant="secondary"
              size="lg"
              className="flex-1"
              onClick={() => setShowConfirmModal(false)}
              disabled={loading}
            >
              ยกเลิก
            </Button>
            <Button
              variant="primary"
              size="lg"
              className="flex-1"
              onClick={confirmBooking}
              loading={loading}
            >
              ยืนยัน
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  )
}

export default ParkingDetail

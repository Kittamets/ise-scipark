import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Car, MapPin, Trophy, AlertCircle, Clock, Users } from 'lucide-react'
import { useAuthStore } from '../stores/authStore'
import { useBookingStore } from '../stores/bookingStore'
import { parkingAPI, bookingAPI } from '../utils/apiService'
import Card from '../components/ui/Card'
import Badge from '../components/ui/Badge'
import { LoadingSpinner } from '../components/ui/Loading'

const Home = () => {
  const { user } = useAuthStore()
  const { activeBooking } = useBookingStore()
  const [parkingSpots, setParkingSpots] = useState([])
  const [loading, setLoading] = useState(true)
  const [stats, setStats] = useState({
    totalSpots: 0,
    availableSpots: 0,
    occupiedSpots: 0
  })

  useEffect(() => {
    fetchParkingSpots()
    checkActiveBooking()
  }, [])

  const fetchParkingSpots = async () => {
    try {
      // Mock data for now - replace with actual API call
      const mockSpots = [
        { 
          id: 1, 
          name: 'หน้าตึกวิทย์ 1', 
          zone: 'A',
          available: 12, 
          total: 25, 
          pricePerHour: 20, 
          image: '🏛️',
          floors: ['ชั้น 1', 'ชั้น 2', 'ชั้น 3', 'ชั้น 4', 'ชั้น 5']
        },
        { 
          id: 2, 
          name: 'ลานจอด A', 
          zone: 'A',
          available: 18, 
          total: 30, 
          pricePerHour: 20, 
          image: '🅰️'
        },
        { 
          id: 3, 
          name: 'ลานจอด B', 
          zone: 'B',
          available: 8, 
          total: 25, 
          pricePerHour: 20, 
          image: '🅱️'
        },
        { 
          id: 4, 
          name: 'ลานจอด C', 
          zone: 'C',
          available: 3, 
          total: 20, 
          pricePerHour: 20, 
          image: '©️'
        },
        { 
          id: 5, 
          name: 'อาคารเรียนรวม', 
          zone: 'D',
          available: 0, 
          total: 15, 
          pricePerHour: 20, 
          image: '🏢'
        },
      ]
      
      setParkingSpots(mockSpots)
      
      // Calculate stats
      const total = mockSpots.reduce((sum, spot) => sum + spot.total, 0)
      const available = mockSpots.reduce((sum, spot) => sum + spot.available, 0)
      
      setStats({
        totalSpots: total,
        availableSpots: available,
        occupiedSpots: total - available
      })
      
    } catch (error) {
      console.error('Error fetching parking spots:', error)
    } finally {
      setLoading(false)
    }
  }

  const checkActiveBooking = async () => {
    try {
      // Check if user has active booking
      // const response = await bookingAPI.getActiveBooking()
      // if (response.data.booking) {
      //   setActiveBooking(response.data.booking)
      // }
    } catch (error) {
      console.error('Error checking booking:', error)
    }
  }

  const getAvailabilityColor = (available, total) => {
    const percentage = (available / total) * 100
    if (percentage > 50) return 'text-green-600'
    if (percentage > 20) return 'text-yellow-600'
    return 'text-red-600'
  }

  const getAvailabilityBadge = (available) => {
    if (available === 0) return <Badge variant="danger" size="sm">เต็ม</Badge>
    if (available <= 5) return <Badge variant="warning" size="sm">ใกล้เต็ม</Badge>
    return <Badge variant="success" size="sm">ว่าง</Badge>
  }

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <LoadingSpinner size="lg" text="กำลังโหลดข้อมูล..." />
      </div>
    )
  }

  return (
    <div className="min-h-screen pb-20 lg:pb-8">
      {/* Hero Section with Stats */}
      <div className="bg-gradient-to-r from-primary-600 via-secondary-600 to-accent-600 text-white">
        <div className="max-w-7xl mx-auto px-6 py-12">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <h1 className="text-5xl font-bold mb-4">สวัสดี, {user?.name || user?.username}! 👋</h1>
            <p className="text-xl opacity-90 mb-8">ยินดีต้อนรับสู่ SciPark Smart Parking</p>
          </motion.div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-white/20 backdrop-blur-lg rounded-3xl p-6"
            >
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 bg-white/30 rounded-2xl flex items-center justify-center">
                  <Car className="w-8 h-8" />
                </div>
                <div>
                  <p className="text-sm opacity-90">ที่จอดว่าง</p>
                  <p className="text-4xl font-bold">{stats.availableSpots}</p>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-white/20 backdrop-blur-lg rounded-3xl p-6"
            >
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 bg-white/30 rounded-2xl flex items-center justify-center">
                  <Trophy className="w-8 h-8" />
                </div>
                <div>
                  <p className="text-sm opacity-90">Rank ของคุณ</p>
                  <p className="text-3xl font-bold">{user?.rank || 'Iron'}</p>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-white/20 backdrop-blur-lg rounded-3xl p-6"
            >
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 bg-white/30 rounded-2xl flex items-center justify-center">
                  <Users className="w-8 h-8" />
                </div>
                <div>
                  <p className="text-sm opacity-90">จุดจอดทั้งหมด</p>
                  <p className="text-4xl font-bold">{stats.totalSpots}</p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Active Booking Alert */}
        {activeBooking && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <Link to="/app/booking">
              <div className="bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-2xl p-6 flex items-start gap-4 hover:shadow-2xl transition-all duration-300 cursor-pointer">
                <AlertCircle className="w-8 h-8 flex-shrink-0 mt-1" />
                <div className="flex-1">
                  <h3 className="text-xl font-bold mb-2">คุณมีการจองอยู่!</h3>
                  <p className="text-lg opacity-90">
                    ที่จอด: {activeBooking.spotName} • เวลาที่เหลือ: {activeBooking.timeLeft}
                  </p>
                  <p className="text-sm opacity-75 mt-2">คลิกเพื่อดูรายละเอียด →</p>
                </div>
              </div>
            </Link>
          </motion.div>
        )}

        {/* Section Title */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-3xl font-bold mb-2">ที่จอดรถทั้งหมด</h2>
            <p className="text-gray-600">เลือกที่จอดที่คุณต้องการจอง</p>
          </div>
          <div className="flex items-center gap-2">
            <Clock className="w-5 h-5 text-gray-400" />
            <span className="text-sm text-gray-600">อัพเดตเมื่อสักครู่</span>
          </div>
        </div>

        {/* Parking Spots Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {parkingSpots.map((spot, index) => (
            <motion.div
              key={spot.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Link to={`/app/parking/${spot.id}`}>
                <Card hover={true} className="group cursor-pointer">
                  {/* Image/Icon */}
                  <div className={`
                    h-48 flex items-center justify-center text-8xl
                    ${spot.available === 0 
                      ? 'bg-gradient-to-br from-gray-200 to-gray-300' 
                      : 'bg-gradient-to-br from-orange-100 to-orange-200'
                    }
                  `}>
                    {spot.image}
                  </div>

                  {/* Content */}
                  <div className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h3 className="text-2xl font-bold mb-1 group-hover:text-primary-600 transition-colors">
                          {spot.name}
                        </h3>
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <MapPin className="w-4 h-4" />
                          <span>โซน {spot.zone}</span>
                        </div>
                      </div>
                      {getAvailabilityBadge(spot.available)}
                    </div>

                    {/* Availability */}
                    <div className="flex items-center justify-between mb-4">
                      <span className="text-gray-600">ที่ว่าง</span>
                      <span className={`text-3xl font-bold ${getAvailabilityColor(spot.available, spot.total)}`}>
                        {spot.available}/{spot.total}
                      </span>
                    </div>

                    {/* Progress Bar */}
                    <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden mb-4">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${(spot.available / spot.total) * 100}%` }}
                        transition={{ delay: index * 0.1 + 0.3, duration: 0.5 }}
                        className={`h-full ${
                          spot.available === 0 
                            ? 'bg-red-500' 
                            : spot.available <= 5 
                              ? 'bg-yellow-500' 
                              : 'bg-green-500'
                        }`}
                      />
                    </div>

                    {/* Price */}
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600">ค่าบริการ</span>
                      <span className="text-2xl font-bold text-orange-600">
                        {spot.pricePerHour} ฿<span className="text-sm text-gray-600">/ชม.</span>
                      </span>
                    </div>

                    {/* Floors (if available) */}
                    {spot.floors && (
                      <div className="mt-4 pt-4 border-t border-gray-100">
                        <p className="text-xs text-gray-500 mb-2">ชั้นที่มีที่จอด:</p>
                        <div className="flex flex-wrap gap-1">
                          {spot.floors.slice(0, 3).map((floor, i) => (
                            <span key={i} className="text-xs bg-gray-100 px-2 py-1 rounded-full text-gray-600">
                              {floor}
                            </span>
                          ))}
                          {spot.floors.length > 3 && (
                            <span className="text-xs bg-gray-100 px-2 py-1 rounded-full text-gray-600">
                              +{spot.floors.length - 3}
                            </span>
                          )}
                        </div>
                      </div>
                    )}

                    {/* Book Button */}
                    {spot.available > 0 && !activeBooking && (
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className="w-full mt-4 py-3 bg-gradient-to-r from-primary-600 to-secondary-600 text-white font-bold rounded-xl hover:shadow-lg transition-all duration-300"
                      >
                        จองเลย
                      </motion.button>
                    )}

                    {spot.available === 0 && (
                      <button
                        disabled
                        className="w-full mt-4 py-3 bg-gray-200 text-gray-500 font-bold rounded-xl cursor-not-allowed"
                      >
                        เต็มแล้ว
                      </button>
                    )}
                  </div>
                </Card>
              </Link>
            </motion.div>
          ))}
        </div>

        {/* Quick Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-6"
        >
          <Link to="/app/privileges">
            <div className="bg-gradient-to-br from-purple-500 to-pink-500 text-white rounded-3xl p-8 hover:shadow-2xl transition-all duration-300 cursor-pointer">
              <Trophy className="w-12 h-12 mb-4" />
              <h3 className="text-2xl font-bold mb-2">อัพเกรด Membership</h3>
              <p className="text-lg opacity-90 mb-4">รับส่วนลดและสิทธิพิเศษมากมาย</p>
              <span className="text-sm font-semibold">ดูแพ็คเกจ →</span>
            </div>
          </Link>

          <Link to="/app/profile">
            <div className="bg-gradient-to-br from-blue-500 to-cyan-500 text-white rounded-3xl p-8 hover:shadow-2xl transition-all duration-300 cursor-pointer">
              <Car className="w-12 h-12 mb-4" />
              <h3 className="text-2xl font-bold mb-2">จัดการยานพาหนะ</h3>
              <p className="text-lg opacity-90 mb-4">เพิ่มหรือแก้ไขข้อมูลรถของคุณ</p>
              <span className="text-sm font-semibold">จัดการเลย →</span>
            </div>
          </Link>
        </motion.div>
      </div>
    </div>
  )
}

export default Home

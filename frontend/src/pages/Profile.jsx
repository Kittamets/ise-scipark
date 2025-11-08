import { useState } from 'react'
import { motion } from 'framer-motion'
import { User, Mail, Phone, Car, Calendar, Lock, LogOut, Edit2, Trash2, Plus, CreditCard } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { useAuthStore } from '../stores/authStore'
import Button from '../components/ui/Button'
import Card from '../components/ui/Card'
import Badge from '../components/ui/Badge'
import Input from '../components/ui/Input'
import Modal from '../components/ui/Modal'
import toast from 'react-hot-toast'

const Profile = () => {
  const navigate = useNavigate()
  const { user, logout, updateUser } = useAuthStore()
  const [isEditing, setIsEditing] = useState(false)
  const [showPasswordModal, setShowPasswordModal] = useState(false)
  const [showVehicleModal, setShowVehicleModal] = useState(false)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [loading, setLoading] = useState(false)
  const [vehicleToDelete, setVehicleToDelete] = useState(null)

  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || ''
  })

  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  })

  const [vehicleData, setVehicleData] = useState({
    licensePlate: '',
    brand: '',
    model: '',
    color: ''
  })

  // Mock vehicles data
  const [vehicles, setVehicles] = useState([
    {
      id: 1,
      licensePlate: 'กก 1234 กรุงเทพ',
      brand: 'Toyota',
      model: 'Camry',
      color: 'ดำ',
      addedDate: '2024-01-15'
    }
  ])

  // Mock booking history
  const bookingHistory = [
    { id: '#BK001', spot: 'A-10', date: '2024-03-15', duration: '2 ชม.', cost: '40 ฿', status: 'completed' },
    { id: '#BK002', spot: 'B-05', date: '2024-03-10', duration: '1.5 ชม.', cost: '30 ฿', status: 'completed' },
    { id: '#BK003', spot: 'C-12', date: '2024-03-05', duration: '3 ชม.', cost: '60 ฿', status: 'completed' },
  ]

  const handleSaveProfile = async () => {
    setLoading(true)
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      updateUser(formData)
      toast.success('บันทึกข้อมูลสำเร็จ')
      setIsEditing(false)
      
    } catch (error) {
      console.error('Update error:', error)
      toast.error('เกิดข้อผิดพลาด')
    } finally {
      setLoading(false)
    }
  }

  const handleChangePassword = async () => {
    if (!passwordData.currentPassword || !passwordData.newPassword) {
      toast.error('กรุณากรอกข้อมูลให้ครบ')
      return
    }

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast.error('รหัสผ่านใหม่ไม่ตรงกัน')
      return
    }

    if (passwordData.newPassword.length < 6) {
      toast.error('รหัสผ่านต้องมีอย่างน้อย 6 ตัวอักษร')
      return
    }

    setLoading(true)
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500))
      
      toast.success('เปลี่ยนรหัสผ่านสำเร็จ')
      setShowPasswordModal(false)
      setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' })
      
    } catch (error) {
      console.error('Password change error:', error)
      toast.error('รหัสผ่านเดิมไม่ถูกต้อง')
    } finally {
      setLoading(false)
    }
  }

  const handleAddVehicle = async () => {
    if (!vehicleData.licensePlate || !vehicleData.brand) {
      toast.error('กรุณากรอกข้อมูลให้ครบ')
      return
    }

    setLoading(true)
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      const newVehicle = {
        id: vehicles.length + 1,
        ...vehicleData,
        addedDate: new Date().toISOString().split('T')[0]
      }
      
      setVehicles([...vehicles, newVehicle])
      toast.success('เพิ่มยานพาหนะสำเร็จ')
      setShowVehicleModal(false)
      setVehicleData({ licensePlate: '', brand: '', model: '', color: '' })
      
    } catch (error) {
      console.error('Add vehicle error:', error)
      toast.error('เกิดข้อผิดพลาด')
    } finally {
      setLoading(false)
    }
  }

  const handleDeleteVehicle = async () => {
    setLoading(true)
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      setVehicles(vehicles.filter(v => v.id !== vehicleToDelete))
      toast.success('ลบยานพาหนะสำเร็จ')
      setShowDeleteModal(false)
      setVehicleToDelete(null)
      
    } catch (error) {
      console.error('Delete vehicle error:', error)
      toast.error('เกิดข้อผิดพลาด')
    } finally {
      setLoading(false)
    }
  }

  const handleLogout = () => {
    logout()
    navigate('/login')
    toast.success('ออกจากระบบสำเร็จ')
  }

  const getRankColor = (rank) => {
    if (rank === 'Iron') return 'gray'
    if (rank === 'Diamond') return 'blue'
    if (rank === 'Predator') return 'purple'
    return 'gray'
  }

  return (
    <div className="min-h-screen pb-20 lg:pb-8">
      <div className="max-w-6xl mx-auto px-6 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-5xl font-bold mb-2">โปรไฟล์ของฉัน</h1>
          <p className="text-xl text-gray-600">จัดการข้อมูลส่วนตัวและการตั้งค่า</p>
        </motion.div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left Column - Profile Info */}
          <div className="lg:col-span-2 space-y-6">
            {/* Profile Card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <Card>
                <div className="p-8">
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-2xl font-bold">ข้อมูลส่วนตัว</h2>
                    {!isEditing ? (
                      <Button
                        variant="secondary"
                        icon={Edit2}
                        onClick={() => setIsEditing(true)}
                      >
                        แก้ไข
                      </Button>
                    ) : (
                      <div className="flex gap-2">
                        <Button
                          variant="secondary"
                          onClick={() => {
                            setIsEditing(false)
                            setFormData({
                              name: user?.name || '',
                              email: user?.email || '',
                              phone: user?.phone || ''
                            })
                          }}
                        >
                          ยกเลิก
                        </Button>
                        <Button
                          variant="primary"
                          onClick={handleSaveProfile}
                          loading={loading}
                        >
                          บันทึก
                        </Button>
                      </div>
                    )}
                  </div>

                  <div className="space-y-4">
                    <Input
                      label="ชื่อ-นามสกุล"
                      icon={User}
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      disabled={!isEditing}
                    />
                    <Input
                      label="อีเมล"
                      type="email"
                      icon={Mail}
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      disabled={!isEditing}
                    />
                    <Input
                      label="เบอร์โทร"
                      type="tel"
                      icon={Phone}
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      disabled={!isEditing}
                    />
                  </div>
                </div>
              </Card>
            </motion.div>

            {/* Vehicles Card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              <Card>
                <div className="p-8">
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-2xl font-bold">ยานพาหนะของฉัน</h2>
                    <Button
                      variant="primary"
                      icon={Plus}
                      onClick={() => setShowVehicleModal(true)}
                    >
                      เพิ่มยานพาหนะ
                    </Button>
                  </div>

                  <div className="space-y-3">
                    {vehicles.map((vehicle) => (
                      <div
                        key={vehicle.id}
                        className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl hover:bg-gray-100 transition-colors"
                      >
                        <div className="flex items-center gap-4">
                          <div className="bg-primary-100 p-3 rounded-xl">
                            <Car className="w-6 h-6 text-primary-600" />
                          </div>
                          <div>
                            <p className="font-bold text-lg">{vehicle.licensePlate}</p>
                            <p className="text-sm text-gray-600">
                              {vehicle.brand} {vehicle.model} • {vehicle.color}
                            </p>
                          </div>
                        </div>
                        <Button
                          variant="danger"
                          size="sm"
                          icon={Trash2}
                          onClick={() => {
                            setVehicleToDelete(vehicle.id)
                            setShowDeleteModal(true)
                          }}
                        >
                          ลบ
                        </Button>
                      </div>
                    ))}

                    {vehicles.length === 0 && (
                      <div className="text-center py-12">
                        <Car className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                        <p className="text-gray-500">ยังไม่มียานพาหนะ</p>
                      </div>
                    )}
                  </div>
                </div>
              </Card>
            </motion.div>

            {/* Booking History */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <Card>
                <div className="p-8">
                  <h2 className="text-2xl font-bold mb-6">ประวัติการจอง</h2>
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-4 py-3 text-left font-bold">รหัส</th>
                          <th className="px-4 py-3 text-left font-bold">ที่จอด</th>
                          <th className="px-4 py-3 text-left font-bold">วันที่</th>
                          <th className="px-4 py-3 text-left font-bold">ระยะเวลา</th>
                          <th className="px-4 py-3 text-left font-bold">ค่าใช้จ่าย</th>
                          <th className="px-4 py-3 text-left font-bold">สถานะ</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y">
                        {bookingHistory.map((booking) => (
                          <tr key={booking.id} className="hover:bg-gray-50">
                            <td className="px-4 py-3 font-mono text-sm">{booking.id}</td>
                            <td className="px-4 py-3 font-bold">{booking.spot}</td>
                            <td className="px-4 py-3">{booking.date}</td>
                            <td className="px-4 py-3">{booking.duration}</td>
                            <td className="px-4 py-3 font-bold text-green-600">{booking.cost}</td>
                            <td className="px-4 py-3">
                              <Badge variant="success" size="sm">เสร็จสิ้น</Badge>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </Card>
            </motion.div>
          </div>

          {/* Right Column - Stats & Actions */}
          <div className="space-y-6">
            {/* Member Card */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
            >
              <Card className="bg-gradient-to-br from-primary-500 to-purple-600 text-white">
                <div className="p-6 text-center">
                  <div className="w-24 h-24 bg-white rounded-full mx-auto mb-4 flex items-center justify-center text-5xl">
                    👤
                  </div>
                  <h3 className="text-2xl font-bold mb-2">{user?.name || 'User'}</h3>
                  <Badge variant={getRankColor(user?.rank || 'Iron')} size="lg" className="mb-4">
                    {user?.rank || 'Iron'}
                  </Badge>
                  <div className="bg-white/20 rounded-2xl p-4">
                    <p className="text-sm mb-1">แต้มสะสม</p>
                    <p className="text-4xl font-bold">{user?.points || 0}</p>
                  </div>
                </div>
              </Card>
            </motion.div>

            {/* Stats Card */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
            >
              <Card>
                <div className="p-6 space-y-4">
                  <h3 className="font-bold text-lg mb-4">สถิติของฉัน</h3>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">จำนวนครั้งที่จอด</span>
                    <span className="text-2xl font-bold">27</span>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">ค่าใช้จ่ายทั้งหมด</span>
                    <span className="text-2xl font-bold text-green-600">1,240 ฿</span>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">ประหยัดไปแล้ว</span>
                    <span className="text-2xl font-bold text-blue-600">186 ฿</span>
                  </div>

                  <div className="pt-4 border-t">
                    <div className="flex items-center gap-2 text-sm text-gray-600 mb-2">
                      <Calendar className="w-4 h-4" />
                      <span>สมาชิกตั้งแต่</span>
                    </div>
                    <p className="font-bold">15 มกราคม 2024</p>
                  </div>
                </div>
              </Card>
            </motion.div>

            {/* Settings Card */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
            >
              <Card>
                <div className="p-6 space-y-3">
                  <h3 className="font-bold text-lg mb-4">การตั้งค่า</h3>
                  
                  <Button
                    variant="secondary"
                    size="lg"
                    icon={CreditCard}
                    className="w-full justify-start"
                    onClick={() => navigate('/app/payment-methods')}
                  >
                    ช่องทางการชำระเงิน
                  </Button>
                  
                  <Button
                    variant="secondary"
                    size="lg"
                    icon={Lock}
                    className="w-full justify-start"
                    onClick={() => setShowPasswordModal(true)}
                  >
                    เปลี่ยนรหัสผ่าน
                  </Button>
                  
                  <Button
                    variant="danger"
                    size="lg"
                    icon={LogOut}
                    className="w-full justify-start"
                    onClick={handleLogout}
                  >
                    ออกจากระบบ
                  </Button>
                </div>
              </Card>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Change Password Modal */}
      <Modal
        isOpen={showPasswordModal}
        onClose={() => setShowPasswordModal(false)}
        title="เปลี่ยนรหัสผ่าน"
      >
        <div className="space-y-4">
          <Input
            label="รหัสผ่านเดิม"
            type="password"
            icon={Lock}
            value={passwordData.currentPassword}
            onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
          />
          <Input
            label="รหัสผ่านใหม่"
            type="password"
            icon={Lock}
            value={passwordData.newPassword}
            onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
          />
          <Input
            label="ยืนยันรหัสผ่านใหม่"
            type="password"
            icon={Lock}
            value={passwordData.confirmPassword}
            onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
          />

          <div className="flex gap-3">
            <Button
              variant="secondary"
              size="lg"
              className="flex-1"
              onClick={() => setShowPasswordModal(false)}
              disabled={loading}
            >
              ยกเลิก
            </Button>
            <Button
              variant="primary"
              size="lg"
              className="flex-1"
              onClick={handleChangePassword}
              loading={loading}
            >
              เปลี่ยนรหัสผ่าน
            </Button>
          </div>
        </div>
      </Modal>

      {/* Add Vehicle Modal */}
      <Modal
        isOpen={showVehicleModal}
        onClose={() => setShowVehicleModal(false)}
        title="เพิ่มยานพาหนะ"
      >
        <div className="space-y-4">
          <Input
            label="ทะเบียนรถ"
            placeholder="เช่น กก 1234 กรุงเทพ"
            icon={Car}
            value={vehicleData.licensePlate}
            onChange={(e) => setVehicleData({ ...vehicleData, licensePlate: e.target.value })}
          />
          <Input
            label="ยี่ห้อ"
            placeholder="เช่น Toyota"
            value={vehicleData.brand}
            onChange={(e) => setVehicleData({ ...vehicleData, brand: e.target.value })}
          />
          <Input
            label="รุ่น"
            placeholder="เช่น Camry"
            value={vehicleData.model}
            onChange={(e) => setVehicleData({ ...vehicleData, model: e.target.value })}
          />
          <Input
            label="สี"
            placeholder="เช่น ดำ"
            value={vehicleData.color}
            onChange={(e) => setVehicleData({ ...vehicleData, color: e.target.value })}
          />

          <div className="flex gap-3">
            <Button
              variant="secondary"
              size="lg"
              className="flex-1"
              onClick={() => setShowVehicleModal(false)}
              disabled={loading}
            >
              ยกเลิก
            </Button>
            <Button
              variant="primary"
              size="lg"
              className="flex-1"
              onClick={handleAddVehicle}
              loading={loading}
            >
              เพิ่ม
            </Button>
          </div>
        </div>
      </Modal>

      {/* Delete Vehicle Confirmation Modal */}
      <Modal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        title="ยืนยันการลบ"
      >
        <div className="space-y-4">
          <p className="text-center text-gray-600">
            คุณแน่ใจหรือไม่ว่าต้องการลบยานพาหนะนี้?
          </p>

          <div className="flex gap-3">
            <Button
              variant="secondary"
              size="lg"
              className="flex-1"
              onClick={() => setShowDeleteModal(false)}
              disabled={loading}
            >
              ยกเลิก
            </Button>
            <Button
              variant="danger"
              size="lg"
              className="flex-1"
              onClick={handleDeleteVehicle}
              loading={loading}
            >
              ยืนยันลบ
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  )
}

export default Profile

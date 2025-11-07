import { useState } from 'react'
import { motion } from 'framer-motion'
import { Crown, Star, Zap, Shield, Gift, Check, Sparkles } from 'lucide-react'
import { useAuthStore } from '../stores/authStore'
import Button from '../components/ui/Button'
import Card from '../components/ui/Card'
import Badge from '../components/ui/Badge'
import Modal from '../components/ui/Modal'
import Input from '../components/ui/Input'
import toast from 'react-hot-toast'

const Privileges = () => {
  const { user, updateUser } = useAuthStore()
  const [showRedeemModal, setShowRedeemModal] = useState(false)
  const [showUpgradeModal, setShowUpgradeModal] = useState(false)
  const [selectedPlan, setSelectedPlan] = useState(null)
  const [redeemCode, setRedeemCode] = useState('')
  const [loading, setLoading] = useState(false)

  const tiers = [
    {
      id: 'iron',
      name: 'Iron',
      icon: Shield,
      color: 'gray',
      gradient: 'from-gray-400 to-gray-600',
      price: 0,
      priceText: 'ฟรี',
      discount: 0,
      features: [
        'จองได้ทุกโซน',
        'ประวัติการจอง 7 วัน',
        'แจ้งเตือนพื้นฐาน',
        'รองรับ 1 ยานพาหนะ',
      ],
      current: user?.rank === 'Iron'
    },
    {
      id: 'diamond',
      name: 'Diamond',
      icon: Star,
      color: 'blue',
      gradient: 'from-blue-400 to-blue-600',
      price: 199,
      priceText: '199 ฿/เดือน',
      discount: 10,
      features: [
        'ส่วนลด 10% ทุกการจอด',
        'จองล่วงหน้า 7 วัน',
        'ประวัติการจอดไม่จำกัด',
        'แจ้งเตือนแบบ Real-time',
        'รองรับ 3 ยานพาหนะ',
        'จองช่องพิเศษ',
      ],
      current: user?.rank === 'Diamond',
      popular: true
    },
    {
      id: 'predator',
      name: 'Predator',
      icon: Crown,
      color: 'purple',
      gradient: 'from-purple-400 via-pink-500 to-orange-500',
      price: 399,
      priceText: '399 ฿/เดือน',
      discount: 15,
      features: [
        'ส่วนลด 15% ทุกการจอด',
        'จองล่วงหน้า 30 วัน',
        'ประวัติการจอดไม่จำกัด',
        'แจ้งเตือนแบบ Real-time',
        'รองรับยานพาหนะไม่จำกัด',
        'จองช่องพิเศษ & VIP',
        'ที่จอดแบบจองตลอด',
        'บริการช่วยเหลือ 24/7',
        'โอนสิทธิ์การจองได้',
      ],
      current: user?.rank === 'Predator'
    }
  ]

  const handleUpgrade = (plan) => {
    setSelectedPlan(plan)
    setShowUpgradeModal(true)
  }

  const confirmUpgrade = async () => {
    setLoading(true)
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500))
      
      // Update user rank
      updateUser({ 
        rank: selectedPlan.name,
        subscriptionExpiry: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) // 30 days from now
      })
      
      toast.success(`🎉 ยินดีด้วย! คุณได้รับสิทธิ์ ${selectedPlan.name} แล้ว`)
      setShowUpgradeModal(false)
      setSelectedPlan(null)
      
    } catch (error) {
      console.error('Upgrade error:', error)
      toast.error('เกิดข้อผิดพลาด กรุณาลองใหม่')
    } finally {
      setLoading(false)
    }
  }

  const handleRedeemCode = async () => {
    if (!redeemCode.trim()) {
      toast.error('กรุณากรอกโค้ด')
      return
    }

    setLoading(true)
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500))
      
      // Mock code validation
      if (redeemCode.toUpperCase() === 'SCIPARK2024') {
        updateUser({ 
          rank: 'Diamond',
          subscriptionExpiry: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
        })
        toast.success('🎉 แลกโค้ดสำเร็จ! คุณได้รับ Diamond Tier 1 เดือน')
        setShowRedeemModal(false)
        setRedeemCode('')
      } else {
        toast.error('โค้ดไม่ถูกต้องหรือหมดอายุแล้ว')
      }
      
    } catch (error) {
      console.error('Redeem error:', error)
      toast.error('เกิดข้อผิดพลาด')
    } finally {
      setLoading(false)
    }
  }

  const getRankColor = (rankName) => {
    if (rankName === 'Iron') return 'gray'
    if (rankName === 'Diamond') return 'blue'
    if (rankName === 'Predator') return 'purple'
    return 'gray'
  }

  return (
    <div className="min-h-screen pb-20 lg:pb-8">
      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <div className="flex items-center justify-center gap-3 mb-4">
            <Sparkles className="w-10 h-10 text-yellow-500" />
            <h1 className="text-5xl font-bold bg-gradient-to-r from-primary-600 to-purple-600 bg-clip-text text-transparent">
              Membership Tiers
            </h1>
            <Sparkles className="w-10 h-10 text-yellow-500" />
          </div>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            เลือกแผนที่เหมาะกับคุณ เพื่อรับสิทธิพิเศษและส่วนลดมากมาย
          </p>

          {/* Current Tier Display */}
          <div className="mt-8 inline-block">
            <div className="bg-white border-4 border-primary-200 rounded-3xl px-8 py-4 shadow-lg">
              <p className="text-sm text-gray-600 mb-2">สมาชิกปัจจุบันของคุณ</p>
              <div className="flex items-center gap-3">
                <Badge variant={getRankColor(user?.rank || 'Iron')} size="lg">
                  {user?.rank || 'Iron'}
                </Badge>
                <span className="text-2xl font-bold text-gray-800">
                  {user?.points || 0} แต้ม
                </span>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Pricing Cards */}
        <div className="grid md:grid-cols-3 gap-8 mb-12">
          {tiers.map((tier, index) => {
            const Icon = tier.icon
            return (
              <motion.div
                key={tier.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card 
                  hover={!tier.current}
                  className={`relative ${tier.current ? 'ring-4 ring-primary-500 shadow-2xl' : ''} ${tier.popular ? 'scale-105 shadow-2xl' : ''}`}
                >
                  {/* Popular Badge */}
                  {tier.popular && (
                    <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-gradient-to-r from-yellow-400 to-orange-500 text-white px-6 py-2 rounded-full font-bold text-sm shadow-lg">
                      🔥 แนะนำ
                    </div>
                  )}

                  {/* Current Badge */}
                  {tier.current && (
                    <div className="absolute -top-4 right-4 bg-green-500 text-white px-4 py-2 rounded-full font-bold text-sm shadow-lg flex items-center gap-2">
                      <Check className="w-4 h-4" />
                      กำลังใช้งาน
                    </div>
                  )}

                  <div className="p-8">
                    {/* Icon & Name */}
                    <div className="text-center mb-6">
                      <div className={`inline-block bg-gradient-to-br ${tier.gradient} p-4 rounded-3xl mb-4 shadow-lg`}>
                        <Icon className="w-12 h-12 text-white" />
                      </div>
                      <h3 className="text-3xl font-bold mb-2">{tier.name}</h3>
                      <div className="text-4xl font-bold mb-1">
                        {tier.id === 'iron' ? (
                          <span className="text-gray-600">ฟรี</span>
                        ) : (
                          <span className={`bg-gradient-to-r ${tier.gradient} bg-clip-text text-transparent`}>
                            {tier.price} ฿
                          </span>
                        )}
                      </div>
                      <p className="text-gray-500 text-sm">{tier.priceText}</p>
                    </div>

                    {/* Discount Badge */}
                    {tier.discount > 0 && (
                      <div className={`text-center mb-6 bg-gradient-to-r ${tier.gradient} text-white py-3 rounded-2xl font-bold text-lg`}>
                        ส่วนลด {tier.discount}% ทุกการจอด!
                      </div>
                    )}

                    {/* Features */}
                    <div className="space-y-3 mb-8">
                      {tier.features.map((feature, i) => (
                        <div key={i} className="flex items-start gap-3">
                          <Check className={`w-5 h-5 flex-shrink-0 mt-0.5 ${tier.current ? 'text-primary-600' : 'text-gray-400'}`} />
                          <span className="text-gray-700">{feature}</span>
                        </div>
                      ))}
                    </div>

                    {/* CTA Button */}
                    {tier.current ? (
                      <Button
                        variant="secondary"
                        size="lg"
                        className="w-full"
                        disabled
                      >
                        กำลังใช้งาน
                      </Button>
                    ) : tier.id === 'iron' ? (
                      <Button
                        variant="secondary"
                        size="lg"
                        className="w-full"
                        disabled
                      >
                        แผนพื้นฐาน
                      </Button>
                    ) : (
                      <Button
                        variant="primary"
                        size="lg"
                        className={`w-full bg-gradient-to-r ${tier.gradient}`}
                        onClick={() => handleUpgrade(tier)}
                      >
                        อัพเกรดเลย
                      </Button>
                    )}
                  </div>
                </Card>
              </motion.div>
            )
          })}
        </div>

        {/* Redeem Code Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Card className="bg-gradient-to-r from-yellow-50 to-orange-50 border-2 border-yellow-200">
            <div className="p-8 text-center">
              <Gift className="w-16 h-16 text-orange-500 mx-auto mb-4" />
              <h3 className="text-3xl font-bold mb-2">มีโค้ดพิเศษ?</h3>
              <p className="text-gray-600 mb-6 max-w-md mx-auto">
                แลกโค้ดเพื่อรับสิทธิพิเศษ หรือส่วนลดฟรี!
              </p>
              <Button
                variant="primary"
                size="lg"
                icon={Gift}
                onClick={() => setShowRedeemModal(true)}
                className="bg-gradient-to-r from-yellow-500 to-orange-500"
              >
                แลกโค้ดตอนนี้
              </Button>
              <p className="text-xs text-gray-500 mt-4">
                ตัวอย่างโค้ด: SCIPARK2024 (Diamond 1 เดือน)
              </p>
            </div>
          </Card>
        </motion.div>

        {/* Benefits Comparison */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mt-12"
        >
          <h2 className="text-3xl font-bold text-center mb-8">เปรียบเทียบสิทธิพิเศษ</h2>
          <Card>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-4 text-left font-bold">คุณสมบัติ</th>
                    <th className="px-6 py-4 text-center font-bold">Iron</th>
                    <th className="px-6 py-4 text-center font-bold">Diamond</th>
                    <th className="px-6 py-4 text-center font-bold">Predator</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  <tr>
                    <td className="px-6 py-4">ส่วนลดค่าจอด</td>
                    <td className="px-6 py-4 text-center">-</td>
                    <td className="px-6 py-4 text-center font-bold text-blue-600">10%</td>
                    <td className="px-6 py-4 text-center font-bold text-purple-600">15%</td>
                  </tr>
                  <tr>
                    <td className="px-6 py-4">จองล่วงหน้า</td>
                    <td className="px-6 py-4 text-center">วันเดียว</td>
                    <td className="px-6 py-4 text-center">7 วัน</td>
                    <td className="px-6 py-4 text-center">30 วัน</td>
                  </tr>
                  <tr>
                    <td className="px-6 py-4">จำนวนยานพาหนะ</td>
                    <td className="px-6 py-4 text-center">1</td>
                    <td className="px-6 py-4 text-center">3</td>
                    <td className="px-6 py-4 text-center">ไม่จำกัด</td>
                  </tr>
                  <tr>
                    <td className="px-6 py-4">ประวัติการจอด</td>
                    <td className="px-6 py-4 text-center">7 วัน</td>
                    <td className="px-6 py-4 text-center">ไม่จำกัด</td>
                    <td className="px-6 py-4 text-center">ไม่จำกัด</td>
                  </tr>
                  <tr>
                    <td className="px-6 py-4">ที่จองตลอด</td>
                    <td className="px-6 py-4 text-center">-</td>
                    <td className="px-6 py-4 text-center">-</td>
                    <td className="px-6 py-4 text-center"><Check className="w-5 h-5 text-green-600 mx-auto" /></td>
                  </tr>
                  <tr>
                    <td className="px-6 py-4">บริการช่วยเหลือ</td>
                    <td className="px-6 py-4 text-center">อีเมล</td>
                    <td className="px-6 py-4 text-center">อีเมล + แชท</td>
                    <td className="px-6 py-4 text-center">24/7</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </Card>
        </motion.div>
      </div>

      {/* Redeem Code Modal */}
      <Modal
        isOpen={showRedeemModal}
        onClose={() => setShowRedeemModal(false)}
        title="แลกโค้ดพิเศษ"
      >
        <div className="space-y-6">
          <div className="text-center">
            <Gift className="w-20 h-20 text-orange-500 mx-auto mb-4" />
            <p className="text-gray-600">กรอกโค้ดของคุณเพื่อรับสิทธิพิเศษ</p>
          </div>

          <Input
            type="text"
            placeholder="ใส่โค้ดที่นี่ (เช่น SCIPARK2024)"
            value={redeemCode}
            onChange={(e) => setRedeemCode(e.target.value.toUpperCase())}
            className="text-center text-lg font-mono"
          />

          <div className="bg-blue-50 border-2 border-blue-200 rounded-2xl p-4">
            <p className="text-sm text-blue-800">
              💡 <strong>เคล็ดลับ:</strong> โค้ดสามารถหาได้จาก
              กิจกรรมพิเศษ, โปรโมชั่น หรือของรางวัล
            </p>
          </div>

          <div className="flex gap-3">
            <Button
              variant="secondary"
              size="lg"
              className="flex-1"
              onClick={() => setShowRedeemModal(false)}
              disabled={loading}
            >
              ยกเลิก
            </Button>
            <Button
              variant="primary"
              size="lg"
              className="flex-1"
              onClick={handleRedeemCode}
              loading={loading}
            >
              แลกโค้ด
            </Button>
          </div>
        </div>
      </Modal>

      {/* Upgrade Confirmation Modal */}
      <Modal
        isOpen={showUpgradeModal}
        onClose={() => setShowUpgradeModal(false)}
        title="ยืนยันการอัพเกรด"
      >
        {selectedPlan && (
          <div className="space-y-6">
            <div className={`text-center bg-gradient-to-r ${selectedPlan.gradient} text-white p-6 rounded-3xl`}>
              {selectedPlan.icon && <selectedPlan.icon className="w-16 h-16 mx-auto mb-3" />}
              <h3 className="text-3xl font-bold mb-2">{selectedPlan.name} Tier</h3>
              <p className="text-4xl font-bold">{selectedPlan.price} ฿/เดือน</p>
            </div>

            <div className="space-y-3">
              <h4 className="font-bold text-lg">คุณจะได้รับ:</h4>
              {selectedPlan.features.map((feature, i) => (
                <div key={i} className="flex items-start gap-3">
                  <Check className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                  <span>{feature}</span>
                </div>
              ))}
            </div>

            <div className="bg-green-50 border-2 border-green-200 rounded-2xl p-4">
              <p className="text-green-800 text-center font-semibold">
                🎉 ทดลองใช้ 7 วันแรกฟรี!
              </p>
            </div>

            <div className="flex gap-3">
              <Button
                variant="secondary"
                size="lg"
                className="flex-1"
                onClick={() => setShowUpgradeModal(false)}
                disabled={loading}
              >
                ยกเลิก
              </Button>
              <Button
                variant="primary"
                size="lg"
                className={`flex-1 bg-gradient-to-r ${selectedPlan.gradient}`}
                onClick={confirmUpgrade}
                loading={loading}
              >
                ยืนยันอัพเกรด
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  )
}

export default Privileges

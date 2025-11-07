require('dotenv').config()
const { MongoClient, ObjectId } = require('mongodb')

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/scipark'

async function seedDatabase() {
  let client

  try {
    console.log('🌱 กำลังเชื่อมต่อกับ MongoDB...')
    client = await MongoClient.connect(MONGODB_URI)
    const db = client.db()

    // Clear existing data
    console.log('🗑️  ลบข้อมูลเก่า...')
    await db.collection('parking_zones').deleteMany({})
    await db.collection('parking_spots').deleteMany({})
    await db.collection('promo_codes').deleteMany({})

    // Create parking zones
    console.log('📍 สร้างโซนจอดรถ...')
    const zones = [
      {
        _id: new ObjectId(),
        name: 'ภาควิชาเคมี',
        description: 'อาคารเคมี ชั้น 1-2',
        building: 'เคมี',
        totalSpots: 30,
        createdAt: new Date()
      },
      {
        _id: new ObjectId(),
        name: 'ภาควิชาฟิสิกส์',
        description: 'อาคารฟิสิกส์ ชั้น 1',
        building: 'ฟิสิกส์',
        totalSpots: 20,
        createdAt: new Date()
      },
      {
        _id: new ObjectId(),
        name: 'ภาควิชาชีววิทยา',
        description: 'อาคารชีววิทยา ชั้น 1-2',
        building: 'ชีววิทยา',
        totalSpots: 25,
        createdAt: new Date()
      },
      {
        _id: new ObjectId(),
        name: 'ภาควิชาคณิตศาสตร์',
        description: 'อาคารคณิตศาสตร์ ชั้น 1',
        building: 'คณิตศาสตร์',
        totalSpots: 15,
        createdAt: new Date()
      }
    ]

    await db.collection('parking_zones').insertMany(zones)
    console.log(`✅ สร้าง ${zones.length} โซนสำเร็จ`)

    // Create parking spots
    console.log('🚗 สร้างที่จอดรถ...')
    const spots = []
    const spotPrefixes = ['A', 'B', 'C', 'D']
    const floors = ['ชั้น 1', 'ชั้น 2']
    const statuses = ['available', 'available', 'available', 'occupied'] // 75% available

    zones.forEach((zone, zoneIndex) => {
      const prefix = spotPrefixes[zoneIndex]
      const spotsPerZone = zone.totalSpots

      for (let i = 1; i <= spotsPerZone; i++) {
        const spotNumber = String(i).padStart(2, '0')
        const floor = i <= Math.ceil(spotsPerZone / 2) ? floors[0] : floors[1]
        const status = statuses[Math.floor(Math.random() * statuses.length)]

        spots.push({
          _id: new ObjectId(),
          name: `${prefix}-${spotNumber}`,
          zoneId: zone._id.toString(),
          zoneName: zone.name,
          floor: floor,
          building: zone.building,
          status: status,
          pricePerHour: 20,
          facilities: [
            'ร่มเงา',
            'ใกล้ทางเข้า',
            'กล้องวงจรปิด',
            'แสงสว่างดี'
          ].slice(0, Math.floor(Math.random() * 4) + 1),
          createdAt: new Date(),
          updatedAt: new Date()
        })
      }
    })

    await db.collection('parking_spots').insertMany(spots)
    console.log(`✅ สร้าง ${spots.length} ที่จอดสำเร็จ`)

    // Create promo codes
    console.log('🎁 สร้างโค้ดโปรโมชั่น...')
    const promoCodes = [
      {
        _id: new ObjectId(),
        code: 'SCIPARK2024',
        type: 'subscription',
        tier: 'diamond',
        durationDays: 30,
        maxUses: 100,
        usedCount: 0,
        usedBy: [],
        isActive: true,
        expiresAt: new Date('2025-12-31'),
        createdAt: new Date()
      },
      {
        _id: new ObjectId(),
        code: 'WELCOME100',
        type: 'points',
        points: 100,
        maxUses: 1000,
        usedCount: 0,
        usedBy: [],
        isActive: true,
        expiresAt: new Date('2025-12-31'),
        createdAt: new Date()
      },
      {
        _id: new ObjectId(),
        code: 'PREDATOR30',
        type: 'subscription',
        tier: 'predator',
        durationDays: 30,
        maxUses: 50,
        usedCount: 0,
        usedBy: [],
        isActive: true,
        expiresAt: new Date('2025-12-31'),
        createdAt: new Date()
      }
    ]

    await db.collection('promo_codes').insertMany(promoCodes)
    console.log(`✅ สร้าง ${promoCodes.length} โค้ดโปรโมชั่นสำเร็จ`)

    // Summary
    console.log('\n📊 สรุปข้อมูลที่สร้าง:')
    console.log(`   - โซนจอดรถ: ${zones.length} โซน`)
    console.log(`   - ที่จอดรถ: ${spots.length} ที่`)
    console.log(`   - ที่ว่าง: ${spots.filter(s => s.status === 'available').length} ที่`)
    console.log(`   - ไม่ว่าง: ${spots.filter(s => s.status === 'occupied').length} ที่`)
    console.log(`   - โค้ดโปรโมชั่น: ${promoCodes.length} โค้ด`)
    console.log('\n🎉 Seed ข้อมูลเสร็จสมบูรณ์!')
    console.log('\n💡 ลองใช้โค้ดเหล่านี้:')
    console.log('   - SCIPARK2024 (Diamond 30 วัน)')
    console.log('   - WELCOME100 (รับ 100 แต้ม)')
    console.log('   - PREDATOR30 (Predator 30 วัน)')

  } catch (error) {
    console.error('❌ เกิดข้อผิดพลาด:', error)
    process.exit(1)
  } finally {
    if (client) {
      await client.close()
      console.log('\n👋 ปิดการเชื่อมต่อกับ MongoDB')
    }
  }
}

// Run seed
seedDatabase()

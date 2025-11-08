import { motion } from 'framer-motion'
import { Link, useNavigate } from 'react-router-dom'
import { ArrowLeft, FileText, CheckCircle } from 'lucide-react'

const Terms = () => {
  const navigate = useNavigate()
  const sections = [
    {
      title: '1. การยอมรับข้อกำหนด',
      content: 'การใช้บริการ SciPark แสดงว่าคุณยอมรับและตกลงที่จะปฏิบัติตามเงื่อนไขการใช้งานทั้งหมด หากคุณไม่เห็นด้วยกับเงื่อนไขใดๆ กรุณาหยุดการใช้บริการทันที'
    },
    {
      title: '2. การสมัครสมาชิกและบัญชีผู้ใช้',
      content: 'คุณต้องให้ข้อมูลที่ถูกต้อง ครบถ้วน และเป็นปัจจุบันในการสมัครสมาชิก คุณมีหน้าที่รักษาความปลอดภัยของรหัสผ่านและรับผิดชอบต่อกิจกรรมทั้งหมดภายใต้บัญชีของคุณ หากพบการใช้งานที่ไม่ได้รับอนุญาต กรุณาแจ้งให้เราทราบทันที'
    },
    {
      title: '3. การใช้บริการ',
      content: 'คุณสามารถใช้บริการเพื่อจองที่จอดรถภายในมหาวิทยาลัยเท่านั้น การใช้บริการในทางที่ผิดกฎหมาย หรือไม่เหมาะสม จะถูกระงับการใช้งานทันที คุณต้องปฏิบัติตามกฎระเบียบของมหาวิทยาลัยและกฎจราจร'
    },
    {
      title: '4. การจองและการชำระเงิน',
      content: 'การจองที่จอดรถจะสมบูรณ์เมื่อได้รับการยืนยันจากระบบ ค่าบริการจะถูกเรียกเก็บตามอัตราที่กำหนด การชำระเงินต้องทำผ่านช่องทางที่ระบบรองรับเท่านั้น การยกเลิกการจองต้องทำก่อนเวลาที่กำหนด มิฉะนั้นอาจมีค่าธรรมเนียมการยกเลิก'
    },
    {
      title: '5. Membership และสิทธิพิเศษ',
      content: 'สมาชิกแต่ละระดับ (Iron, Diamond, Predator) จะได้รับสิทธิประโยชน์ตามที่กำหนด ค่าสมาชิกจะเรียกเก็บเป็นรายเดือนและต่ออายุอัตโนมัติ คุณสามารถยกเลิกการเป็นสมาชิกได้ตลอดเวลา โดยสิทธิประโยชน์จะสิ้นสุดเมื่อครบรอบบิล'
    },
    {
      title: '6. ความรับผิดชอบ',
      content: 'SciPark ไม่รับผิดชอบต่อความเสียหายใดๆ ที่เกิดขึ้นกับยานพาหนะหรือทรัพย์สินของคุณขณะจอดรถ คุณต้องรับผิดชอบในการล็อคและดูแลรักษาความปลอดภัยของยานพาหนะด้วยตนเอง ระบบให้บริการเฉพาะการจัดการที่จอดเท่านั้น'
    },
    {
      title: '7. ทรัพย์สินทางปัญญา',
      content: 'เนื้อหา โลโก้ ชื่อการค้า และทรัพย์สินทางปัญญาอื่นๆ ของ SciPark เป็นของบริษัทฯ คุณไม่มีสิทธิ์คัดลอก ดัดแปลง หรือเผยแพร่เนื้อหาใดๆ โดยไม่ได้รับอนุญาตเป็นลายลักษณ์อักษร'
    },
    {
      title: '8. การระงับและยกเลิกบัญชี',
      content: 'เราขอสงวนสิทธิ์ในการระงับหรือยกเลิกบัญชีของคุณได้ทันที หากมีการละเมิดเงื่อนไขการใช้งาน หรือพบการใช้งานที่ไม่เหมาะสม โดยไม่ต้องแจ้งให้ทราบล่วงหน้า และไม่คืนเงินค่าบริการที่ชำระแล้ว'
    },
    {
      title: '9. การเปลี่ยนแปลงเงื่อนไข',
      content: 'เราอาจปรับปรุงหรือแก้ไขเงื่อนไขการใช้งานได้ตลอดเวลา การเปลี่ยนแปลงจะมีผลทันทีเมื่อประกาศผ่านระบบ การใช้บริการต่อไปถือว่าคุณยอมรับเงื่อนไขที่เปลี่ยนแปลงแล้ว'
    },
    {
      title: '10. กฎหมายที่ใช้บังคับ',
      content: 'เงื่อนไขการใช้งานนี้อยู่ภายใต้กฎหมายไทย ข้อพิพาทใดๆ จะอยู่ในเขตอำนาจศาลไทยเท่านั้น'
    }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Header */}
      <div className="bg-white shadow-md sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-4">
          <button 
            onClick={() => navigate(-1)}
            className="inline-flex items-center gap-2 text-gray-600 hover:text-primary-600 transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-5 h-5" />
            <span className="font-medium">กลับหน้าก่อนหน้า</span>
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {/* Title Section */}
          <div className="text-center mb-12">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring" }}
              className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-2xl shadow-xl mb-6"
            >
              <FileText className="w-10 h-10 text-white" />
            </motion.div>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
              เงื่อนไขการใช้งาน
            </h1>
            <p className="text-base sm:text-lg text-gray-600 max-w-2xl mx-auto">
              กรุณาอ่านเงื่อนไขการใช้งานอย่างละเอียดก่อนใช้บริการ SciPark
            </p>
            <div className="mt-4 inline-block bg-blue-50 border border-blue-200 rounded-lg px-4 py-2">
              <p className="text-sm text-blue-700">
                <strong>วันที่อัปเดตล่าสุด:</strong> 8 พฤศจิกายน 2568
              </p>
            </div>
          </div>

          {/* Terms Content */}
          <div className="bg-white rounded-2xl shadow-xl p-6 sm:p-8 lg:p-12 space-y-8">
            {sections.map((section, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 * index }}
                className="border-b border-gray-200 last:border-0 pb-6 last:pb-0"
              >
                <div className="flex items-start gap-3 mb-3">
                  <CheckCircle className="w-6 h-6 text-green-500 flex-shrink-0 mt-1" />
                  <h2 className="text-xl sm:text-2xl font-bold text-gray-900">
                    {section.title}
                  </h2>
                </div>
                <p className="text-base sm:text-lg text-gray-700 leading-relaxed ml-9">
                  {section.content}
                </p>
              </motion.div>
            ))}
          </div>

          {/* Contact Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
            className="mt-12 bg-gradient-to-r from-primary-50 to-secondary-50 rounded-2xl p-6 sm:p-8 text-center"
          >
            <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-3">
              มีคำถามเพิ่มเติม?
            </h3>
            <p className="text-base sm:text-lg text-gray-700 mb-4">
              หากมีข้อสงสัยเกี่ยวกับเงื่อนไขการใช้งาน สามารถติดต่อเราได้ที่
            </p>
            <a 
              href="mailto:support@scipark.com"
              className="inline-flex items-center gap-2 text-primary-600 hover:text-primary-700 font-semibold text-lg"
            >
              support@scipark.com
            </a>
          </motion.div>

          {/* Back Button */}
          <div className="mt-8 text-center">
            <motion.button
              onClick={() => navigate(-1)}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="px-8 py-3 bg-gradient-to-r from-primary-600 to-secondary-600 text-white font-bold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
            >
              กลับหน้าก่อนหน้า
            </motion.button>
          </div>
        </motion.div>
      </div>
    </div>
  )
}

export default Terms

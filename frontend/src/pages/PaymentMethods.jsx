import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CreditCard, Smartphone, Building2, Plus, Trash2, Check, X } from 'lucide-react';
import { paymentMethodAPI } from '../utils/paymentApi';
import toast from 'react-hot-toast';

const PaymentMethods = () => {
  const [methods, setMethods] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [formData, setFormData] = useState({
    type: 'credit_card',
    cardNumber: '',
    cardHolderName: '',
    expiryMonth: '',
    expiryYear: '',
    phoneNumber: '',
    bankName: '',
    accountNumber: '',
    accountName: '',
    isDefault: false
  });

  const paymentTypes = [
    { value: 'credit_card', label: 'บัตรเครดิต', icon: CreditCard },
    { value: 'debit_card', label: 'บัตรเดบิต', icon: CreditCard },
    { value: 'promptpay', label: 'พร้อมเพย์', icon: Smartphone },
    { value: 'truewallet', label: 'ทรูวอลเล็ต', icon: Smartphone },
    { value: 'bank_transfer', label: 'โอนธนาคาร', icon: Building2 }
  ];

  useEffect(() => {
    fetchPaymentMethods();
  }, []);

  const fetchPaymentMethods = async () => {
    try {
      setLoading(true);
      const response = await paymentMethodAPI.getAll();
      setMethods(response.data);
    } catch (error) {
      toast.error('ไม่สามารถโหลดข้อมูลได้');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleAdd = async (e) => {
    e.preventDefault();
    
    try {
      await paymentMethodAPI.add(formData);
      toast.success('เพิ่มช่องทางการชำระเงินสำเร็จ');
      setShowAddModal(false);
      resetForm();
      fetchPaymentMethods();
    } catch (error) {
      toast.error(error.response?.data?.message || 'เกิดข้อผิดพลาด');
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('ยืนยันการลบช่องทางการชำระเงิน?')) return;
    
    try {
      await paymentMethodAPI.delete(id);
      toast.success('ลบสำเร็จ');
      fetchPaymentMethods();
    } catch (error) {
      toast.error('ไม่สามารถลบได้');
    }
  };

  const handleSetDefault = async (id) => {
    try {
      await paymentMethodAPI.setDefault(id);
      toast.success('ตั้งเป็นช่องทางหลักสำเร็จ');
      fetchPaymentMethods();
    } catch (error) {
      toast.error('เกิดข้อผิดพลาด');
    }
  };

  const resetForm = () => {
    setFormData({
      type: 'credit_card',
      cardNumber: '',
      cardHolderName: '',
      expiryMonth: '',
      expiryYear: '',
      phoneNumber: '',
      bankName: '',
      accountNumber: '',
      accountName: '',
      isDefault: false
    });
  };

  const getIcon = (type) => {
    const typeObj = paymentTypes.find(t => t.value === type);
    const Icon = typeObj?.icon || CreditCard;
    return <Icon className="w-6 h-6" />;
  };

  const renderFormFields = () => {
    const { type } = formData;

    if (type === 'credit_card' || type === 'debit_card') {
      return (
        <>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              หมายเลขบัตร
            </label>
            <input
              type="text"
              maxLength="16"
              value={formData.cardNumber}
              onChange={(e) => setFormData({...formData, cardNumber: e.target.value.replace(/\D/g, '')})}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500"
              placeholder="1234567890123456"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              ชื่อบนบัตร
            </label>
            <input
              type="text"
              value={formData.cardHolderName}
              onChange={(e) => setFormData({...formData, cardHolderName: e.target.value.toUpperCase()})}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500"
              placeholder="SOMCHAI SUKSUK"
              required
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                เดือนหมดอายุ
              </label>
              <select
                value={formData.expiryMonth}
                onChange={(e) => setFormData({...formData, expiryMonth: e.target.value})}
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500"
                required
              >
                <option value="">เลือก</option>
                {Array.from({length: 12}, (_, i) => {
                  const month = String(i + 1).padStart(2, '0');
                  return <option key={month} value={month}>{month}</option>;
                })}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                ปีหมดอายุ
              </label>
              <select
                value={formData.expiryYear}
                onChange={(e) => setFormData({...formData, expiryYear: e.target.value})}
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500"
                required
              >
                <option value="">เลือก</option>
                {Array.from({length: 10}, (_, i) => {
                  const year = String(new Date().getFullYear() + i);
                  return <option key={year} value={year}>{year}</option>;
                })}
              </select>
            </div>
          </div>
        </>
      );
    }

    if (type === 'promptpay' || type === 'truewallet') {
      return (
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            เบอร์โทรศัพท์
          </label>
          <input
            type="tel"
            maxLength="10"
            value={formData.phoneNumber}
            onChange={(e) => setFormData({...formData, phoneNumber: e.target.value.replace(/\D/g, '')})}
            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500"
            placeholder="0812345678"
            required
          />
        </div>
      );
    }

    if (type === 'bank_transfer') {
      return (
        <>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              ธนาคาร
            </label>
            <input
              type="text"
              value={formData.bankName}
              onChange={(e) => setFormData({...formData, bankName: e.target.value})}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500"
              placeholder="ธนาคารกสิกรไทย"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              เลขบัญชี
            </label>
            <input
              type="text"
              value={formData.accountNumber}
              onChange={(e) => setFormData({...formData, accountNumber: e.target.value})}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500"
              placeholder="1234567890"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              ชื่อบัญชี
            </label>
            <input
              type="text"
              value={formData.accountName}
              onChange={(e) => setFormData({...formData, accountName: e.target.value})}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500"
              placeholder="นายสมชาย สุขสุข"
              required
            />
          </div>
        </>
      );
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 pb-20">
      {/* Header */}
      <div className="bg-white shadow-md">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-6">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
            ช่องทางการชำระเงิน
          </h1>
          <p className="text-gray-600 mt-2">จัดการช่องทางการชำระเงินของคุณ</p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
        {/* Add Button */}
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => setShowAddModal(true)}
          className="w-full sm:w-auto mb-6 px-6 py-3 bg-gradient-to-r from-primary-600 to-secondary-600 text-white font-bold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center gap-2"
        >
          <Plus className="w-5 h-5" />
          <span>เพิ่มช่องทางใหม่</span>
        </motion.button>

        {/* Payment Methods List */}
        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
            <p className="text-gray-600 mt-4">กำลังโหลด...</p>
          </div>
        ) : methods.length === 0 ? (
          <div className="bg-white rounded-2xl p-12 text-center shadow-lg">
            <CreditCard className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-600 text-lg">ยังไม่มีช่องทางการชำระเงิน</p>
            <p className="text-gray-500 mt-2">เพิ่มช่องทางเพื่อความสะดวกในการชำระเงิน</p>
          </div>
        ) : (
          <div className="space-y-4">
            {methods.map((method) => (
              <motion.div
                key={method._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-shadow duration-300"
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-primary-100 to-secondary-100 rounded-xl flex items-center justify-center text-primary-600">
                      {getIcon(method.type)}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="text-lg font-bold text-gray-900">
                          {method.displayName}
                        </h3>
                        {method.isDefault && (
                          <span className="px-3 py-1 bg-green-100 text-green-700 text-xs font-bold rounded-full">
                            หลัก
                          </span>
                        )}
                      </div>
                      <p className="text-gray-600 text-sm mt-1">
                        {paymentTypes.find(t => t.value === method.type)?.label}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    {!method.isDefault && (
                      <button
                        onClick={() => handleSetDefault(method._id)}
                        className="p-2 text-gray-600 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                        title="ตั้งเป็นหลัก"
                      >
                        <Check className="w-5 h-5" />
                      </button>
                    )}
                    <button
                      onClick={() => handleDelete(method._id)}
                      className="p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      title="ลบ"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      {/* Add Modal */}
      <AnimatePresence>
        {showAddModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
            onClick={() => setShowAddModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-2xl p-6 max-w-md w-full max-h-[90vh] overflow-y-auto"
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-900">เพิ่มช่องทางใหม่</h2>
                <button
                  onClick={() => setShowAddModal(false)}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleAdd} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    ประเภท
                  </label>
                  <select
                    value={formData.type}
                    onChange={(e) => setFormData({...formData, type: e.target.value})}
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500"
                  >
                    {paymentTypes.map(type => (
                      <option key={type.value} value={type.value}>
                        {type.label}
                      </option>
                    ))}
                  </select>
                </div>

                {renderFormFields()}

                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="isDefault"
                    checked={formData.isDefault}
                    onChange={(e) => setFormData({...formData, isDefault: e.target.checked})}
                    className="w-4 h-4 text-primary-600 rounded"
                  />
                  <label htmlFor="isDefault" className="text-sm text-gray-700">
                    ตั้งเป็นช่องทางหลัก
                  </label>
                </div>

                <div className="flex gap-3 pt-4">
                  <button
                    type="button"
                    onClick={() => setShowAddModal(false)}
                    className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    ยกเลิก
                  </button>
                  <button
                    type="submit"
                    className="flex-1 px-4 py-2 bg-gradient-to-r from-primary-600 to-secondary-600 text-white rounded-lg hover:shadow-lg transition-shadow"
                  >
                    เพิ่ม
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default PaymentMethods;

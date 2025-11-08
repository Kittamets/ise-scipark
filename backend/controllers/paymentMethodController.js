import mongoose from "mongoose";
import PaymentMethod from "../models/paymentMethodModel.js";

/*
    @desc   Get all payment methods for user
    @route  GET /api/payment-methods
    @access Private
*/
export const getPaymentMethods = async (req, res) => {
  try {
    const userId = req.userId;

    const paymentMethods = await PaymentMethod.find({
      user: userId,
      status: "active"
    }).sort({ isDefault: -1, createdAt: -1 });

    // Transform data to mask sensitive information
    const maskedMethods = paymentMethods.map(method => ({
      _id: method._id,
      type: method.type,
      displayName: method.getDisplayName(),
      isDefault: method.isDefault,
      status: method.status,
      createdAt: method.createdAt,
      // Include masked card info for cards
      ...(method.type.includes('card') && {
        maskedCardNumber: method.getMaskedCardNumber(),
        cardHolderName: method.cardHolderName,
        expiryMonth: method.expiryMonth,
        expiryYear: method.expiryYear
      }),
      // Include phone for PromptPay/TrueWallet
      ...((method.type === 'promptpay' || method.type === 'truewallet') && {
        phoneNumber: method.phoneNumber
      }),
      // Include bank info for bank transfer
      ...(method.type === 'bank_transfer' && {
        bankName: method.bankName,
        accountNumber: method.accountNumber,
        accountName: method.accountName
      })
    }));

    res.status(200).json({
      success: true,
      count: maskedMethods.length,
      data: maskedMethods
    });

  } catch (error) {
    console.error("Get payment methods error:", error);
    res.status(500).json({
      success: false,
      message: "เกิดข้อผิดพลาดในการดึงข้อมูลช่องทางการชำระเงิน",
      error: error.message
    });
  }
};

/*
    @desc   Add new payment method
    @route  POST /api/payment-methods
    @access Private
*/
export const addPaymentMethod = async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const userId = req.userId;
    const { type, isDefault, ...methodData } = req.body;

    // Validate required fields based on type
    if (type === 'credit_card' || type === 'debit_card') {
      if (!methodData.cardNumber || !methodData.cardHolderName || 
          !methodData.expiryMonth || !methodData.expiryYear) {
        throw new Error("กรุณากรอกข้อมูลบัตรให้ครบถ้วน");
      }
      // Basic card number validation
      if (!/^\d{16}$/.test(methodData.cardNumber.replace(/\s/g, ''))) {
        throw new Error("หมายเลขบัตรไม่ถูกต้อง");
      }
    } else if (type === 'promptpay' || type === 'truewallet') {
      if (!methodData.phoneNumber) {
        throw new Error("กรุณากรอกเบอร์โทรศัพท์");
      }
      // Phone validation
      if (!/^0\d{9}$/.test(methodData.phoneNumber)) {
        throw new Error("เบอร์โทรศัพท์ไม่ถูกต้อง");
      }
    } else if (type === 'bank_transfer') {
      if (!methodData.bankName || !methodData.accountNumber || !methodData.accountName) {
        throw new Error("กรุณากรอกข้อมูลบัญชีธนาคารให้ครบถ้วน");
      }
    }

    // If setting as default, remove default from other methods
    if (isDefault) {
      await PaymentMethod.updateMany(
        { user: userId, isDefault: true },
        { isDefault: false },
        { session }
      );
    }

    // Create new payment method
    const newMethod = new PaymentMethod({
      user: userId,
      type,
      isDefault: isDefault || false,
      ...methodData
    });

    await newMethod.save({ session });
    await session.commitTransaction();

    res.status(201).json({
      success: true,
      message: "เพิ่มช่องทางการชำระเงินสำเร็จ",
      data: {
        _id: newMethod._id,
        type: newMethod.type,
        displayName: newMethod.getDisplayName(),
        isDefault: newMethod.isDefault
      }
    });

  } catch (error) {
    await session.abortTransaction();
    console.error("Add payment method error:", error);
    res.status(400).json({
      success: false,
      message: error.message || "เกิดข้อผิดพลาดในการเพิ่มช่องทางการชำระเงิน",
      error: error.message
    });
  } finally {
    session.endSession();
  }
};

/*
    @desc   Update payment method
    @route  PUT /api/payment-methods/:id
    @access Private
*/
export const updatePaymentMethod = async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const { id } = req.params;
    const userId = req.userId;
    const { isDefault, ...updateData } = req.body;

    const method = await PaymentMethod.findOne({
      _id: id,
      user: userId
    }).session(session);

    if (!method) {
      throw new Error("ไม่พบช่องทางการชำระเงิน");
    }

    // If setting as default, remove default from other methods
    if (isDefault && !method.isDefault) {
      await PaymentMethod.updateMany(
        { user: userId, isDefault: true },
        { isDefault: false },
        { session }
      );
    }

    // Update fields
    Object.keys(updateData).forEach(key => {
      if (updateData[key] !== undefined) {
        method[key] = updateData[key];
      }
    });

    if (isDefault !== undefined) {
      method.isDefault = isDefault;
    }

    await method.save({ session });
    await session.commitTransaction();

    res.status(200).json({
      success: true,
      message: "อัปเดตช่องทางการชำระเงินสำเร็จ",
      data: {
        _id: method._id,
        type: method.type,
        displayName: method.getDisplayName(),
        isDefault: method.isDefault
      }
    });

  } catch (error) {
    await session.abortTransaction();
    console.error("Update payment method error:", error);
    res.status(400).json({
      success: false,
      message: error.message || "เกิดข้อผิดพลาดในการอัปเดตช่องทางการชำระเงิน",
      error: error.message
    });
  } finally {
    session.endSession();
  }
};

/*
    @desc   Delete payment method
    @route  DELETE /api/payment-methods/:id
    @access Private
*/
export const deletePaymentMethod = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.userId;

    const method = await PaymentMethod.findOne({
      _id: id,
      user: userId
    });

    if (!method) {
      return res.status(404).json({
        success: false,
        message: "ไม่พบช่องทางการชำระเงิน"
      });
    }

    // Soft delete by setting status to inactive
    method.status = "inactive";
    await method.save();

    res.status(200).json({
      success: true,
      message: "ลบช่องทางการชำระเงินสำเร็จ"
    });

  } catch (error) {
    console.error("Delete payment method error:", error);
    res.status(500).json({
      success: false,
      message: "เกิดข้อผิดพลาดในการลบช่องทางการชำระเงิน",
      error: error.message
    });
  }
};

/*
    @desc   Set payment method as default
    @route  PUT /api/payment-methods/:id/default
    @access Private
*/
export const setDefaultPaymentMethod = async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const { id } = req.params;
    const userId = req.userId;

    const method = await PaymentMethod.findOne({
      _id: id,
      user: userId,
      status: "active"
    }).session(session);

    if (!method) {
      throw new Error("ไม่พบช่องทางการชำระเงิน");
    }

    // Remove default from all other methods
    await PaymentMethod.updateMany(
      { user: userId, isDefault: true },
      { isDefault: false },
      { session }
    );

    // Set this method as default
    method.isDefault = true;
    await method.save({ session });

    await session.commitTransaction();

    res.status(200).json({
      success: true,
      message: "ตั้งเป็นช่องทางการชำระเงินหักอัตโนมัติสำเร็จ",
      data: {
        _id: method._id,
        type: method.type,
        displayName: method.getDisplayName(),
        isDefault: method.isDefault
      }
    });

  } catch (error) {
    await session.abortTransaction();
    console.error("Set default payment method error:", error);
    res.status(400).json({
      success: false,
      message: error.message || "เกิดข้อผิดพลาด",
      error: error.message
    });
  } finally {
    session.endSession();
  }
};

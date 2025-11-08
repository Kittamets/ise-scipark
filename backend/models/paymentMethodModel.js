import mongoose from "mongoose";

const paymentMethodSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  type: {
    type: String,
    enum: ["credit_card", "debit_card", "promptpay", "truewallet", "bank_transfer"],
    required: true,
  },
  isDefault: {
    type: Boolean,
    default: false,
  },
  // Credit/Debit Card fields
  cardNumber: {
    type: String,
    default: null,
  },
  cardHolderName: {
    type: String,
    default: null,
  },
  expiryMonth: {
    type: String,
    default: null,
  },
  expiryYear: {
    type: String,
    default: null,
  },
  // PromptPay/TrueWallet fields
  phoneNumber: {
    type: String,
    default: null,
  },
  // Bank Transfer fields
  bankName: {
    type: String,
    default: null,
  },
  accountNumber: {
    type: String,
    default: null,
  },
  accountName: {
    type: String,
    default: null,
  },
  status: {
    type: String,
    enum: ["active", "inactive"],
    default: "active",
  },
}, { timestamps: true });

// Indexes
paymentMethodSchema.index({ user: 1, isDefault: 1 });
paymentMethodSchema.index({ user: 1, status: 1 });

// Method to mask card number
paymentMethodSchema.methods.getMaskedCardNumber = function() {
  if (!this.cardNumber) return null;
  const last4 = this.cardNumber.slice(-4);
  return `**** **** **** ${last4}`;
};

// Method to get display name
paymentMethodSchema.methods.getDisplayName = function() {
  switch (this.type) {
    case 'credit_card':
      return `บัตรเครดิต ${this.getMaskedCardNumber()}`;
    case 'debit_card':
      return `บัตรเดบิต ${this.getMaskedCardNumber()}`;
    case 'promptpay':
      return `PromptPay ${this.phoneNumber}`;
    case 'truewallet':
      return `TrueWallet ${this.phoneNumber}`;
    case 'bank_transfer':
      return `${this.bankName} ${this.accountNumber?.slice(-4)}`;
    default:
      return this.type;
  }
};

const PaymentMethod = mongoose.models.PaymentMethod || mongoose.model("PaymentMethod", paymentMethodSchema);
export default PaymentMethod;

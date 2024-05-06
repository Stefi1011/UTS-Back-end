const accountsSchema = {
  account_number: { type: Number, unique: true, required: true },
  full_name: { type: String },
  email: {type: String},
  balance: { type: Number, default: 0 },
  pin: { type: String },
  mutation: [
    {
      type: {
        type: String,
        enum: ['Transfer to', 'Transfer from', 'Put in', 'Cash out'],
        required: true,
      },
      amount: { type: Number, required: true },
      timestamp: { type: Date, default: Date.now },
      recipient_account: { type: Number },
      sender_account: { type: Number },
    },
  ],
};
module.exports = accountsSchema;

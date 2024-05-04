const failedLoginAttemptsSchema = {
  email: { type: String },
  timestamp: { type: Date },
  totalFailedAttempts: { type: Number },
};

module.exports = failedLoginAttemptsSchema;

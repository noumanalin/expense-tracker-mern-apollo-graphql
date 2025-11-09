import mongoose from "mongoose";

const transactionSchema = new mongoose.Schema({
	userId: {
		type: mongoose.Schema.Types.ObjectId,
		ref: "User",
		required: true,
	},
	description: {
		type: String,
		required: true,
	},
	paymentType: {
		type: String,
		enum: [
			"cash", "card", "bank transfer", "cheque", "online wallet",
			"mobile banking", "cryptocurrency", "exchange", "loan/readycash", "installments",
			"other"
		],
		required: true,
	},

	category: {
		type: String,
		enum: [
			"salary", "saving", "investment", "business income", "bonus",
			"expense", "shopping", "food", "entertainment", "bills",
			"utilities", "transport", "fuel", "travel", "rent",
			"installments", "loan payment", "education", "health", "insurance",
			"gift", "charity", "tax", "other"
		],
		required: true,
	},

	amount: {
		type: Number,
		required: true,
	},
	location: {
		type: String,
		default: "Unknown",
	},
	date: {
		type: Date,
		required: true,
	},
});

const Transaction = mongoose.model("Transaction", transactionSchema);

export default Transaction;

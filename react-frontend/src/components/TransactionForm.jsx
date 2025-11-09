import { useMutation } from "@apollo/client/react";
import { CREATE_TRANSACTION } from "../graphQL/mutations/transaction.mutation";
import { toast } from "react-toastify";

const TransactionForm = () => {
	const [createTransaction, { loading }] = useMutation(CREATE_TRANSACTION, {
		refetchQueries: ["GetTransactions", "GetTransactionStatistics"],
	});

	const handleSubmit = async (e) => {
		e.preventDefault();
		const form = e.target;
		const formData = new FormData(form);
		const transactionData = {
			description: formData.get("description"),
			paymentType: formData.get("paymentType"),
			category: formData.get("category"),
			amount: parseFloat(formData.get("amount")),
			location: formData.get("location"),
			date: formData.get("date"),
		};

		try {
			await createTransaction({ variables: { input: transactionData } });
			form.reset();
			toast.success("Transaction created successfully ✅");
		} catch (error) {
			toast.error(error.message);
		}
	};

	return (
		<form className="w-full max-w-lg flex flex-col gap-5 px-3" onSubmit={handleSubmit}>
			{/* DESCRIPTION */}
			<div>
				<label className="block uppercase tracking-wide text-white text-xs font-bold mb-2">
					Transaction
				</label>
				<input
					name="description"
					type="text"
					required
					placeholder="Rent, Groceries, Salary, etc."
					className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
				/>
			</div>

			{/* PAYMENT TYPE & CATEGORY */}
			<section className="flex flex-wrap gap-3">
				<div className="w-full flex-1">
					<label className="block uppercase tracking-wide text-white text-xs font-bold mb-2">
						Payment Type
					</label>
					<select
						id="paymentType"
						name="paymentType"
						required
						className="block appearance-none w-full bg-gray-200 border border-gray-200 text-gray-700 py-3 px-4 pr-8 rounded leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
					>
						<option value="cash" title="Cash in hand etc.">Cash</option>
						<option value="card" title="Credit/Debit card payments">Card</option>
						<option value="bank transfer" title="Direct bank transfer or cheque">Bank Transfer</option>
						<option value="online wallet" title="SadaPay, EasyPaisa, JazzCash etc.">Online Wallet</option>
						<option value="mobile banking" title="Payments via mobile banking app">Mobile Banking</option>
						<option value="cryptocurrency" title="Bitcoin, Ethereum, USDT etc.">Cryptocurrency</option>
						<option value="exchange" title="Currency or money exchange">Exchange</option>
						<option value="loan/readycash" title="Loan, credit, or readycash payments">Loan / ReadyCash</option>
						<option value="installments" title="Payments made in installments">Installments</option>
						<option value="other" title="Other payment methods">Other</option>
					</select>
				</div>

				{/* CATEGORY */}
				<div className="w-full flex-1">
					<label className="block uppercase tracking-wide text-white text-xs font-bold mb-2">
						Category
					</label>
					<select
						id="category"
						name="category"
						required
						className="block appearance-none w-full bg-gray-200 border border-gray-200 text-gray-700 py-3 px-4 pr-8 rounded leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
					>
						<option value="salary" title="Monthly salary or wage income">Salary</option>
						<option value="saving" title="Personal or emergency savings">Saving</option>
						<option value="investment" title="Stocks, crypto, or business investments">Investment</option>
						<option value="business income" title="Income from business or freelancing">Business Income</option>
						<option value="bonus" title="Bonuses or rewards">Bonus</option>
						<option value="expense" title="General daily expenses">Expense</option>
						<option value="shopping" title="Shopping and retail purchases">Shopping</option>
						<option value="food" title="Groceries, dining, or food delivery">Food</option>
						<option value="entertainment" title="Movies, games, subscriptions, etc.">Entertainment</option>
						<option value="bills" title="Electricity, internet, phone, etc.">Bills</option>
						<option value="utilities" title="Gas, water, and maintenance">Utilities</option>
						<option value="transport" title="Public or private transport costs">Transport</option>
						<option value="fuel" title="Petrol, diesel, CNG etc.">Fuel</option>
						<option value="travel" title="Trips, vacations, or tours">Travel</option>
						<option value="rent" title="Monthly house or office rent">Rent</option>
						<option value="installments" title="EMIs or other installments">Installments</option>
						<option value="loan payment" title="Loan or debt repayment">Loan Payment</option>
						<option value="education" title="School, college, or course fees">Education</option>
						<option value="health" title="Medical or hospital expenses">Health</option>
						<option value="insurance" title="Health, car, or life insurance">Insurance</option>
						<option value="gift" title="Gifts for others">Gift</option>
						<option value="charity" title="Donations or charity">Charity</option>
						<option value="tax" title="Tax payments or deductions">Tax</option>
						<option value="other" title="Other categories">Other</option>
					</select>
				</div>
			</section>

			{/* AMOUNT */}
			<div>
				<label className="block uppercase text-white text-xs font-bold mb-2">Amount ($)</label>
				<input
					name="amount"
					type="number"
					placeholder="150"
					required
					className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 focus:outline-none focus:bg-white focus:border-gray-500"
				/>
			</div>

			{/* LOCATION & DATE */}
			<div className="flex gap-3">
				<div className="flex-1">
					<label className="block uppercase text-white text-xs font-bold mb-2">Location</label>
					<input
						name="location"
						type="text"
						placeholder="New York"
						className="appearance-none block w-full bg-gray-200 text-gray-700 border rounded py-3 px-4 focus:outline-none focus:bg-white"
					/>
				</div>
				<div className="flex-1">
					<label className="block uppercase text-white text-xs font-bold mb-2">Date</label>
					<input
						name="date"
						type="date"
						required
						className="appearance-none block w-full bg-gray-200 text-gray-700 border rounded py-[11px] px-4 focus:outline-none focus:bg-white"
					/>
				</div>
			</div>

			{/* SUBMIT */}
			<button
				disabled={loading}
				className="text-white font-bold w-full rounded px-4 py-2 bg-gradient-to-br from-pink-500 to-pink-500 hover:from-pink-600 hover:to-pink-600 disabled:opacity-70"
			>
				{loading ? "Loading..." : "Add Transaction"}
			</button>
		</form>
	);
};

export default TransactionForm;

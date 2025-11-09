import { useMutation, useQuery } from "@apollo/client/react";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { GET_TRANSACTION, GET_TRANSACTION_STATISTICS } from "../graphQL/queries/transaction.query";
import { UPDATE_TRANSACTION } from "../graphQL/mutations/transaction.mutation";
import { toast } from "react-toastify";
import TransactionFormSkeleton from "../components/TransactionFormSkeleton";

const Transaction = () => {
	const { id } = useParams();

	// 🟢 Update form when data is fetched
	const { loading, data } = useQuery(GET_TRANSACTION, {
		variables: { id },
		fetchPolicy: "cache-first",
	});

	// 🟢 Update transaction mutation
	const [updateTransaction, { loading: loadingUpdate }] = useMutation(UPDATE_TRANSACTION, {
		refetchQueries: [{ query: GET_TRANSACTION_STATISTICS }],
	});

	// 🟢 Initialize with empty values
	const [formData, setFormData] = useState({
		description: "",
		paymentType: "",
		category: "",
		amount: "",
		location: "",
		date: "",
	});

	// 🟢 Track if form has been initialized with data
	const [isFormInitialized, setIsFormInitialized] = useState(false);

	// 🟢 Update form when data is loaded
	useEffect(() => {
		if (data?.transaction && !isFormInitialized) {
			setFormData({
				description: data.transaction.description || "",
				paymentType: data.transaction.paymentType || "",
				category: data.transaction.category || "",
				amount: data.transaction.amount?.toString() || "", // Convert to string for input
				location: data.transaction.location || "",
				date: data.transaction.date
					? new Date(+data.transaction.date).toISOString().split('T')[0]
					: "",
			});
			setIsFormInitialized(true);
		}
	}, [data?.transaction, isFormInitialized]);

	// 🟢 Handle input changes
	const handleInputChange = (e) => {
		const { name, value } = e.target;
		setFormData((prev) => ({ ...prev, [name]: value }));
	};

	// 🟢 Handle submit
	const handleSubmit = async (e) => {
		e.preventDefault();
		try {
			const amount = parseFloat(formData.amount);
			await updateTransaction({
				variables: {
					input: {
						...formData,
						amount,
						transactionId: id
					},
				},
			});
			toast.success("Transaction updated successfully ✅");
		} catch (error) {
			toast.error(error.message);
			console.error("Update error:", error);
		}
	};

	// Show skeleton only during initial load, not during updates
	if (loading && !isFormInitialized) return <TransactionFormSkeleton />;

	return (
		<div className='h-screen max-w-4xl mx-auto flex flex-col items-center relative'>
			<p className='md:text-4xl text-2xl lg:text-4xl font-bold text-center relative z-50 mb-4 mr-4 bg-gradient-to-r from-pink-600 via-indigo-500 to-pink-400 inline-block text-transparent bg-clip-text'>
				Update this transaction
			</p>

			<form className='w-full max-w-lg flex flex-col gap-5 px-3' onSubmit={handleSubmit}>
				{/* TRANSACTION DESCRIPTION */}
				<div>
					<label className='block uppercase text-white text-xs font-bold mb-2'>
						Transaction
					</label>
					<input
						type='text'
						name='description'
						value={formData.description}
						onChange={handleInputChange}
						placeholder='Rent, Groceries, Salary, etc.'
						className='appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 focus:outline-none focus:bg-white focus:border-gray-500'
					/>
				</div>

				{/* PAYMENT TYPE & CATEGORY */}
				<div className='flex flex-wrap gap-3'>
					<div className='w-full flex-1'>
						<label className='block uppercase text-white text-xs font-bold mb-2'>
							Payment Type
						</label>
						<select
							name="paymentType"
							value={formData.paymentType}
							onChange={handleInputChange}
							className="block w-full bg-gray-200 text-gray-700 border border-gray-200 py-3 px-4 rounded focus:outline-none focus:bg-white focus:border-gray-500"
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

					<div className='w-full flex-1'>
						<label className='block uppercase text-white text-xs font-bold mb-2'>
							Category
						</label>
						<select
							name='category'
							value={formData.category}
							onChange={handleInputChange}
							className='block w-full bg-gray-200 text-gray-700 border border-gray-200 py-3 px-4 rounded focus:outline-none focus:bg-white focus:border-gray-500'
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
				</div>

				{/* AMOUNT */}
				<div>
					<label className='block uppercase text-white text-xs font-bold mb-2'>
						Amount ($)
					</label>
					<input
						type='number'
						name='amount'
						value={formData.amount}
						onChange={handleInputChange}
						className='appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 focus:outline-none focus:bg-white focus:border-gray-500'
						placeholder='150'
					/>
				</div>

				{/* LOCATION & DATE */}
				<div className='flex flex-wrap gap-3'>
					<div className='w-full flex-1'>
						<label className='block uppercase text-white text-xs font-bold mb-2'>
							Location
						</label>
						<input
							type='text'
							name='location'
							value={formData.location}
							onChange={handleInputChange}
							className='appearance-none block w-full bg-gray-200 text-gray-700 border rounded py-3 px-4 focus:outline-none focus:bg-white'
							placeholder='New York'
						/>
					</div>

					<div className='w-full flex-1'>
						<label className='block uppercase text-white text-xs font-bold mb-2'>
							Date
						</label>
						<input
							type='date'
							name='date'
							value={formData.date}
							onChange={handleInputChange}
							className='appearance-none block w-full bg-gray-200 text-gray-700 border rounded py-[11px] px-4 focus:outline-none focus:bg-white'
						/>
					</div>
				</div>

				{/* SUBMIT BUTTON */}
				<button
					type='submit'
					className={`${loadingUpdate || !isFormInitialized ? 'cursor-not-allowed' : 'cursor-pointer'} cursor-pointer text-white font-bold w-full rounded px-4 py-2 bg-gradient-to-br from-pink-500 to-pink-500 hover:from-pink-600 hover:to-pink-600 disabled:opacity-50`}
					disabled={loadingUpdate || !isFormInitialized}
				>
					{loadingUpdate ? "Updating..." : "Update Transaction"}
				</button>
			</form>
		</div>
	);
};

export default Transaction;
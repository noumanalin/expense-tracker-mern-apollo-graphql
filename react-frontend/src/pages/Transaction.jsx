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

	// 🟢 Controlled form state
	const [formData, setFormData] = useState({
		description: "",
		paymentType: "",
		category: "",
		amount: "",
		location: "",
		date: "",
	});



	useEffect(() => {
		if (data?.transaction) {
			setFormData({
				description: data?.transaction?.description,
				paymentType: data?.transaction?.paymentType,
				category: data?.transaction?.category,
				amount: data?.transaction?.amount,
				location: data?.transaction?.location,
				date: new Date(+data.transaction.date).toISOString().substr(0, 10),
			});
		}
		// Remove id dependency so it doesn't reset on every re-render
	}, [data?.transaction]);


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
					input: { ...formData, amount, transactionId: id },
				},
			});
			toast.success("Transaction updated successfully ✅");
		} catch (error) {
			toast.error(error.message);
		}
	};

	if (loading || loadingUpdate) return <TransactionFormSkeleton />;

	return (
		<div className='h-screen max-w-4xl mx-auto flex flex-col items-center'>
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
							name='paymentType'
							value={formData.paymentType}
							onChange={handleInputChange}
							className='block w-full bg-gray-200 text-gray-700 border border-gray-200 py-3 px-4 rounded focus:outline-none focus:bg-white focus:border-gray-500'
						>
							<option value='card'>Card</option>
							<option value='cash'>Cash</option>
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
							<option value='saving'>Saving</option>
							<option value='expense'>Expense</option>
							<option value='investment'>Investment</option>
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
					className='text-white font-bold w-full rounded px-4 py-2 bg-gradient-to-br from-pink-500 to-pink-500 hover:from-pink-600 hover:to-pink-600'
					disabled={loadingUpdate}
				>
					{loadingUpdate ? "Updating..." : "Update Transaction"}
				</button>
			</form>
		</div>
	);
};

export default Transaction;

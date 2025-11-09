import { FaLocationDot } from "react-icons/fa6";
import { BsCardText } from "react-icons/bs";
import { MdOutlinePayments } from "react-icons/md";
import { FaSackDollar } from "react-icons/fa6";
import { FaTrash } from "react-icons/fa";
import { HiPencilAlt } from "react-icons/hi";
import { Link } from "react-router-dom";
import { formatDate } from "../utils/formatDates.js";
import { useMutation } from "@apollo/client/react";
import { DELETE_TRANSACTION } from "../graphQL/mutations/transaction.mutation.js";
import { toast } from "react-toastify";

// 🟩 Category colors
const categoryColorMap = {
	saving: "from-green-700 to-green-400",
	expense: "from-pink-800 to-pink-600",
	investment: "from-blue-700 to-blue-400",
	"business income": "from-blue-800 to-indigo-500",
	salary: "from-indigo-600 to-indigo-300",
	shopping: "from-fuchsia-800 to-fuchsia-500",
	food: "from-yellow-600 to-yellow-400",
	entertainment: "from-orange-600 to-orange-400",
	bills: "from-purple-800 to-purple-500",
	utilities: "from-sky-800 to-sky-400",
	transport: "from-cyan-700 to-cyan-400",
	fuel: "from-amber-800 to-amber-400",
	travel: "from-lime-700 to-lime-400",
	rent: "from-rose-800 to-rose-500",
	installments: "from-teal-700 to-teal-400",
	"loan payment": "from-red-800 to-red-500",
	education: "from-blue-700 to-cyan-500",
	health: "from-emerald-700 to-emerald-400",
	insurance: "from-slate-700 to-slate-400",
	gift: "from-pink-700 to-pink-400",
	charity: "from-green-800 to-green-500",
	tax: "from-orange-700 to-orange-400",
	other: "from-gray-600 to-gray-400",
};

// 🟦 Payment Type colors
const paymentColorMap = {
	cash: "text-yellow-300",
	card: "text-blue-300",
	"bank transfer": "text-green-300",
	cheque: "text-purple-300",
	"online wallet": "text-pink-300",
	"mobile banking": "text-cyan-300",
	cryptocurrency: "text-orange-300",
	exchange: "text-emerald-300",
	"loan/readycash": "text-red-300",
	installments: "text-indigo-300",
	other: "text-gray-300",
};

const Card = ({ transaction, authUser }) => {
	let { category, amount, location, date, paymentType, description } = transaction;
	const cardClass = categoryColorMap[category] || "from-gray-600 to-gray-400";
	const paymentColor = paymentColorMap[paymentType] || "text-white";
	const [deleteTransaction, { loading }] = useMutation(DELETE_TRANSACTION, {
		refetchQueries: ["GetTransactions", "GetTransactionStatistics"],
	});

	// Capitalize the first letter of the description
	description = description[0]?.toUpperCase() + description.slice(1);
	category = category[0]?.toUpperCase() + category.slice(1);
	paymentType = paymentType[0]?.toUpperCase() + paymentType.slice(1);

	const formattedDate = formatDate(date);

	const handleDelete = async () => {
		try {
			await deleteTransaction({ variables: { transactionId: transaction._id } });
			toast.success("Transaction deleted successfully");
		} catch (error) {
			console.error("Error deleting transaction:", error);
			toast.error(error.message);
		}
	};

	return (
		<div className={`rounded-md p-4 bg-gradient-to-br ${cardClass}`}>
			<div className='flex flex-col gap-3'>
				<div className='flex flex-row items-center justify-between'>
					<h2 className='text-lg font-bold text-white'>{category}</h2>
					<div className='flex items-center gap-2'>
						{!loading && <FaTrash className={"cursor-pointer"} onClick={handleDelete} />}
						{loading && <div className='w-6 h-6 border-t-2 border-b-2 rounded-full animate-spin'></div>}
						<Link to={`/transaction/${transaction._id}`}>
							<HiPencilAlt className='cursor-pointer' size={20} />
						</Link>
					</div>
				</div>
				<p className='text-white flex items-center gap-1'>
					<BsCardText />
					Description: {description}
				</p>
				<p className={`flex items-center gap-1 ${paymentColor}`}>
					<MdOutlinePayments />
					Payment Type: {paymentType}
				</p>
				<p className='text-white flex items-center gap-1'>
					<FaSackDollar />
					Amount: ${amount}
				</p>
				<p className='text-white flex items-center gap-1'>
					<FaLocationDot />
					Location: {location || "N/A"}
				</p>
				<div className='flex justify-between items-center'>
					<p className='text-xs text-black font-bold'>{formattedDate}</p>
					<img src={authUser?.profilePicture} className='h-8 w-8 border rounded-full' alt='' />
				</div>
			</div>
		</div>
	);
};
export default Card;

import { Doughnut } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";

import Cards from "../components/Cards";
import TransactionForm from "../components/TransactionForm";

import { MdLogout } from "react-icons/md";
import { useApolloClient, useMutation, useQuery } from "@apollo/client/react";
import { GET_AUTHENTICATED_USER } from "../graphQL/queries/user.query";
import { GET_TRANSACTION_STATISTICS } from "../graphQL/queries/transaction.query";
import { useEffect, useState } from "react";
import { LOGOUT_USER } from "../graphQL/mutations/user.mutaion";
import { toast } from "react-toastify";

ChartJS.register(ArcElement, Tooltip, Legend);

const categoryColors = {
	salary: "#1E90FF",
	saving: "#3CB371",
	investment: "#4682B4",
	"business income": "#4169E1",
	bonus: "#00CED1",
	expense: "#FF6347",
	shopping: "#FF69B4",
	food: "#FFD700",
	entertainment: "#FF4500",
	bills: "#FFA500",
	utilities: "#20B2AA",
	transport: "#00BFFF",
	fuel: "#A0522D",
	travel: "#9370DB",
	rent: "#CD5C5C",
	installments: "#D2691E",
	"loan payment": "#8B0000",
	education: "#6495ED",
	health: "#9ACD32",
	insurance: "#6A5ACD",
	gift: "#DA70D6",
	charity: "#32CD32",
	tax: "#FF8C00",
	other: "#808080",
};

const Home = () => {
	const { data: userData } = useQuery(GET_AUTHENTICATED_USER);

	// const chartData = {
	// 	labels: ["Saving", "Expense", "Investment"],
	// 	datasets: [
	// 		{
	// 			label: "%",
	// 			data: [13, 8, 3],
	// 			backgroundColor: ["rgba(75, 192, 192)", "rgba(255, 99, 132)", "rgba(54, 162, 235)"],
	// 			borderColor: ["rgba(75, 192, 192)", "rgba(255, 99, 132)", "rgba(54, 162, 235, 1)"],
	// 			borderWidth: 1,
	// 			borderRadius: 30,
	// 			spacing: 10,
	// 			cutout: 130,
	// 		},
	// 	],
	// };

	const client = useApolloClient();
	const [logout, { loading: isLoggingOut }] = useMutation(LOGOUT_USER);

	const handleLogout = async () => {
		try {
			await logout();
			await client.clearStore(); // clear Apollo cache 
			toast.success("Logged out successfully");

			// navigate("/login")) doesn’t trigger immediately because your <App /> 
			// component still sees the cached authUser data until React re-renders or refreshes.
			window.location.href = "/login";
		} catch (error) {
			toast.error(`Error logging out ${error.message}`);
		}
	};

	const { data } = useQuery(GET_TRANSACTION_STATISTICS);
	const [chartData, setChartData] = useState({
		labels: [],
		datasets: [
			{
				label: "$",
				data: [],
				backgroundColor: [],
				borderColor: [],
				borderWidth: 1,
				borderRadius: 30,
				spacing: 10,
				cutout: 130,
			},
		],
	});

	useEffect(() => {
		if (data?.categoryStatistics) {
			const categories = data.categoryStatistics.map((stat) => stat.category);
			const totalAmounts = data.categoryStatistics.map((stat) => stat.totalAmount);

			const backgroundColors = categories.map((cat) => categoryColors[cat] || "#808080");
			const borderColors = backgroundColors.map((color) => color);

			setChartData((prev) => ({
				labels: categories,
				datasets: [
					{
						...prev.datasets[0],
						data: totalAmounts,
						backgroundColor: backgroundColors,
						borderColor: borderColors,
					},
				],
			}));
		}
	}, [data]);

	return (
		<>
			<div className='flex flex-col gap-6 items-center max-w-7xl mx-auto z-20 relative justify-center'>
				<div className='flex items-center'>
					<p className='md:text-4xl text-2xl lg:text-4xl font-bold text-center relative z-50 mb-4 mr-4 bg-gradient-to-r from-pink-600 via-indigo-500 to-pink-400 inline-block text-transparent bg-clip-text'>
						Spend wisely, track wisely
					</p>
					<img
						src={userData?.authUser?.profilePicture}
						title={userData?.authUser?.name}
						className='w-11 h-11 rounded-full border cursor-pointer'
						alt='Avatar'
					/>
					{!isLoggingOut && <MdLogout className='mx-2 w-5 h-5 cursor-pointer' onClick={handleLogout} title="Logout" />}
					{/* loading spinner */}
					{isLoggingOut && <div className='w-6 h-6 border-t-2 border-b-2 mx-2 rounded-full animate-spin'></div>}
				</div>
				<div className='flex flex-wrap w-full justify-center items-center gap-6'>
					<div className='h-[330px] w-[330px] md:h-[360px] md:w-[360px]'>
						<Doughnut data={chartData} />
					</div>

					<TransactionForm />
				</div>
				<Cards />
			</div>
		</>
	);
};

export default Home;

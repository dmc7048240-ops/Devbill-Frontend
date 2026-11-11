import {
	ArrowDownCircle,
	ArrowUpCircle,
	Calendar,
	TrendingUp,
	Wallet,
} from "lucide-react";
import { useEffect, useState } from "react";
import type { PieLabelRenderProps } from "recharts";
import {
	Bar,
	BarChart,
	CartesianGrid,
	Cell,
	Legend,
	Pie,
	PieChart,
	ResponsiveContainer,
	Tooltip,
	XAxis,
	YAxis,
} from "recharts";
import Card from "../components/Card";
import MonthYearSelect from "../components/MonthYearSelect";
import {
	getTransactionsMonthly,
	getTransactionsSumary,
} from "../services/transactionsService";
import type { MonthlyItem, TransactionSumary } from "../Types/transaction";
import { formatCurrency } from "../utils/formatter";

const initialSumary: TransactionSumary = {
	balance: 0,
	totalExpenses: 0,
	totalIncomes: 0,
	expensesByCategory: [],
};

const Dashboard = () => {
	const currentDate = new Date();
	const [year, setYear] = useState<number>(currentDate.getFullYear());
	const [month, setMonth] = useState(currentDate.getMonth() + 1);
	const [sumary, setSumary] = useState<TransactionSumary>(initialSumary);
	const [monthlyItemsDate, setMonthlyItemsDate] = useState<MonthlyItem[]>([]);

	useEffect(() => {
		async function loadTransactionsSummary() {
			const response = await getTransactionsSumary(month, year);
			setSumary(response);
		}
		loadTransactionsSummary();
	}, [month, year]);

	useEffect(() => {
		async function loadTransactionsMonthly() {
			const response = await getTransactionsMonthly(month, year, 4);
			setMonthlyItemsDate(response.history);
		}
		loadTransactionsMonthly();
	}, [month, year]);

	const renderPieChatLabel = (props: PieLabelRenderProps): string => {
		const { name, percent } = props;
		const percentage = typeof percent === "number" ? percent * 100 : 0;
		return `${name}: ${percentage.toFixed(1)}%`;
	};

	const formatToolTipValue = (value: unknown): string => {
		if (typeof value === "number") {
			return formatCurrency(value);
		}
		if (typeof value === "string") {
			const parsed = parseFloat(value);
			return Number.isNaN(parsed) ? formatCurrency(0) : formatCurrency(parsed);
		}
		if (Array.isArray(value) && value.length > 0) {
			const num = Number(value[0]);
			return Number.isNaN(num) ? formatCurrency(0) : formatCurrency(num);
		}
		return formatCurrency(0);
	};

	// Safely fallback to an empty array if expensesByCategory is undefined/null
	const expensesList = sumary?.expensesByCategory ?? [];

	return (
		<div className="container-app py-6">
			<div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
				<h1 className="text-2xl font-bold mb-4 md:mb-0">Dashboard</h1>
				<MonthYearSelect
					month={month}
					year={year}
					onMonthChange={setMonth}
					onYearChange={setYear}
				/>
			</div>

			<div className="grid grid-cols-1 md:grid-cols-3 gap-4">
				{/* Card Saldo */}
				<Card
					icon={<Wallet size={20} className="text-primary-500" />}
					title="Saldo"
					hover
					glowEffect={sumary.balance > 0}
				>
					<p
						className={`text-2xl font-semibold mt-2 ${
							sumary.balance >= 0 ? "text-primary-500" : "text-red-300"
						}`}
					>
						{formatCurrency(sumary.balance)}
					</p>
				</Card>

				{/* Card Receitas */}
				<Card
					icon={<ArrowUpCircle size={20} className="text-green-500" />}
					title="Receitas"
					hover
				>
					<p className="text-2xl font-semibold mt-2 text-green-500">
						{formatCurrency(sumary.totalIncomes)}
					</p>
				</Card>

				{/* Card Despesas */}
				<Card
					icon={<ArrowDownCircle size={20} className="text-red-500" />}
					title="Despesas"
					hover
				>
					<p className="text-2xl font-semibold mt-2 text-red-500">
						{formatCurrency(sumary.totalExpenses)}
					</p>
				</Card>
			</div>

			<div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6 mt-3">
				<Card
					icon={<TrendingUp size={20} className="text-primary-500" />}
					title="Despesas por Categoria"
					className="min-h-80"
				>
					{expensesList.length > 0 ? (
						<div className="h-72 mt-4">
							<ResponsiveContainer width="100%" height="100%">
								<PieChart>
									<Pie
										data={expensesList}
										cx="50%"
										cy="50%"
										outerRadius={80}
										dataKey="amount"
										nameKey="categoryName"
										label={renderPieChatLabel}
									>
										{expensesList.map((entry) => (
											<Cell key={entry.categoryId} fill={entry.categoryColor} />
										))}
									</Pie>
									<Tooltip formatter={formatToolTipValue} />
								</PieChart>
							</ResponsiveContainer>
						</div>
					) : (
						<div className="flex items-center justify-center h-64 text-gray-500">
							Nenhuma despesa registrada nesse período
						</div>
					)}
				</Card>
				<Card
					icon={<Calendar size={20} className="text-primary-500" />}
					title="Histórico Mensal"
					className="min-h-80 p-2.5"
				>
					<div className="h-72 mt-4">
						{(monthlyItemsDate ?? []).length > 0 ? (
							<ResponsiveContainer width="100%" height="100%">
								<BarChart data={monthlyItemsDate} margin={{ left: 40 }}>
									<CartesianGrid
										strokeDasharray="3 3"
										stroke="rgba(255,255,255,0.1)"
									/>
									<XAxis
										dataKey="name"
										stroke="#94A3B8"
										tick={{ style: { textTransform: "capitalize" } }}
									/>
									<YAxis
										width="auto"
										stroke="#94A3B8"
										tickFormatter={formatCurrency}
										tick={{ style: { fontSize: 14 } }}
									/>
									<Tooltip
										formatter={formatToolTipValue}
										contentStyle={{
											backgroundColor: "#1A1A1A",
											borderColor: "#2A2A2A",
										}}
										labelStyle={{
											color: "#f8f8f8",
										}}
									/>
									<Legend />
									<Bar
										dataKey="expenses"
										name="Despesas"
										fill="#FF6384"
										radius={[10, 10, 0, 0]}
									/>
									<Bar
										dataKey="income"
										name="Receitas"
										fill="#37E359"
										radius={[10, 10, 0, 0]}
									/>
								</BarChart>
							</ResponsiveContainer>
						) : (
							<div className="flex items-center justify-center h-full text-gray-500">
								Nenhum dado disponível para o histórico mensal
							</div>
						)}
					</div>
				</Card>
			</div>
		</div>
	);
};

export default Dashboard;

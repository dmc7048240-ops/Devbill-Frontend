import { AlertCircle, ArrowDown, ArrowUp, Plus, Search } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { Link } from "react-router";
import Button from "../components/Button";
import Card from "../components/Card";
import Input from "../components/Input";
import MonthYearSelect from "../components/MonthYearSelect";
import { getTransactions } from "../services/transactionsService";
import { type Transaction, TransactionType } from "../Types/transaction";
import { formatCurrency, formatDate } from "../utils/formatter";

const Transactions = () => {
	const currentDate = new Date();
	const [year, setYear] = useState<number>(currentDate.getFullYear());
	const [month, setMonth] = useState<number>(currentDate.getMonth() + 1);
	const [loading, setLoading] = useState<boolean>(false);
	const [error, setError] = useState<string | null>(null);
	const [transactions, setTransactions] = useState<Transaction[]>([]);

	const fetchTransactions = useCallback(async (): Promise<void> => {
		try {
			setLoading(true);
			setError(null);
			const data = await getTransactions({ month, year });
			setTransactions(data);
		} catch {
			setError(
				"Erro ao buscar transações. Por favor, tente novamente mais tarde.",
			);
		} finally {
			setLoading(false);
		}
	}, [month, year]);

	useEffect(() => {
		fetchTransactions();
	}, [fetchTransactions]);

	return (
		<div className="container-app py-6 ">
			<div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
				<h1 className="text-2xl font-bold mb-4 md:mb-0">Transações</h1>
				<Link
					to="/transacoes/nova"
					className="bg-primary-500 text-[#051626] font-semibold px-4 py-2.5 rounded-xl flex items-center justify-center hover:bg-primary-500 transition-all"
				>
					Nova Transação
					<Plus className="w-4 h-4 mr-2" />
				</Link>
			</div>
			<Card className="mb-6">
				<MonthYearSelect
					month={month}
					onMonthChange={setMonth}
					onYearChange={setYear}
					year={year}
				/>
			</Card>
			<Card className="mb-6">
				<Input
					error="erro ao pesquisar"
					placeholder="Buscar transações..."
					icon={<Search className="w-4 h-4" />}
					fullWidth
				/>
			</Card>
			<Card className="mb-6">
				{loading ? (
					<div className="flex items-center justify-center">
						<div className="w-10 h-10 border-4 border-primary-500 border-t-transparent rounded-full animate-spin" />
					</div>
				) : error ? (
					<div className="p-8 text-center">
						<AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
						<p>{error}</p>
						<Button onClick={fetchTransactions} className="mx-auto mt-6">
							Tentar Novamente
						</Button>
					</div>
				) : transactions?.length === 0 ? (
					<div className="p-8 text-center py-12">
						<p className="text-gray-500 mb-4">Nenhuma transação encontrada.</p>
						<Link
							to="/transacoes/nova"
							className="w-fit mx-auto mt-6 bg-primary-500 text-[#051626] font-semibold px-4 py-2.5 rounded-xl flex items-center justify-center hover:bg-primary-500 transition-all"
						>
							Nova Transação
							<Plus className="w-4 h-4 mr-2" />
						</Link>
					</div>
				) : (
					<div className="overflow-x-auto">
						<table className="divide-y divide-gray-700 min-h-full ">
							<thead>
								<tr>
									<th
										scope="col"
										className="px-3 py-3 text-left text-xs font-medium text-gray-400 uppercase"
									>
										Descrição
									</th>
									<th
										scope="col"
										className="px-3 py-3 text-left text-xs font-medium text-gray-400 uppercase"
									>
										Data
									</th>
									<th
										scope="col"
										className="px-3 py-3 text-left text-xs font-medium text-gray-400 uppercase"
									>
										Categoria
									</th>
									<th
										scope="col"
										className="px-3 py-3 text-left text-xs font-medium text-gray-400 uppercase"
									>
										Valor
									</th>
									<th
										scope="col"
										className="px-3 py-3 text-left text-xs font-medium text-gray-400 uppercase"
									>
										{""}
									</th>
								</tr>
							</thead>
							<tbody className="divide-y divide-gray-700 ">
								{transactions.map((transaction) => (
									<tr
										key={transaction.id}
										className="hover:bg-gray-800 transition-colors"
									>
										<td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-300">
											<div className=" flex items-center px-3 py-4 whitespace-nowrap text-sm font-medium text-gray-300">
												<div className="mr-2">
													{transaction.type === TransactionType.INCOME ? (
														<ArrowUp className="w-4 h-4 text-green-500" />
													) : (
														<ArrowDown className="w-4 h-4 text-red-500" />
													)}
												</div>
												<span className="text-sm font-medium text-gray-50">
													{transaction.description}
												</span>
											</div>
										</td>
										<td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-300">
											{formatDate(transaction.date)}
										</td>
										<td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-300">
											<div className="flex items-center">
												<div
													className="w-2 h-2 rounded-full mr-2"
													style={{
														backgroundColor: transaction.category.color,
													}}
												></div>
												<span className="text-sm font-medium text-gray-50">
													{transaction.category.name}
												</span>
											</div>
										</td>
										<td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-300">
											<span
												className={`${transaction.type === TransactionType.INCOME ? "text-green-500" : "text-red-500"}`}
											>
												{formatCurrency(transaction.amount)}
											</span>
										</td>
									</tr>
								))}
							</tbody>
						</table>
					</div>
				)}
			</Card>
		</div>
	);
};

export default Transactions;

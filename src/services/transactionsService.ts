import type {
	MonthlyItem,
	Transaction,
	TransactionFilter,
	TransactionSumary,
} from "../Types/transaction";
import { api } from "./api";

export const getTransactions = async (
	filter?: Partial<TransactionFilter>,
): Promise<Transaction[]> => {
	const response = await api.get<Transaction[]>("/transactions", {
		params: filter,
	});

	return response.data;
};

export const getTransactionsSumary = async (
	month: number,
	year: number,
): Promise<TransactionSumary> => {
	const response = await api.get<TransactionSumary>("/transactions/summary", {
		params: { month, year },
	});
	return response.data;
};

export const getTransactionsMonthly = async (
	month: number,
	year: number,
	months?: number,
): Promise<{ history: MonthlyItem[] }> => {
	const response = await api.get("/transactions/historical", {
		params: {
			month,
			year,
			months,
		},
	});

	return response.data;
};

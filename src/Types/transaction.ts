import type { Category, CategorySumary } from "./category";

export type TransactionType = "expense" | "income";

export interface Transaction {
	id: string;
	userId: string;
	description: string;
	amount: number;
	date: string | Date;
	categoryId: string;
	category: Category;
	type: TransactionType; // Corrigido aqui de 'Transaction' para 'TransactionType'
	updateAt: string | Date;
	createdAt: string | Date;
}

export interface TransactionFilter {
	month: number;
	year: number;
	categoryId?: string;
	type?: TransactionType;
}

export interface TransactionSumary {
	totalExpenses: number;
	totalIncomes: number;
	balance: number;
	expensesByCategory: CategorySumary[];
}

export interface MonthlyItem {
	name: string;
	expenses: number;
	income: number;
}

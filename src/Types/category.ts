import type { TransactionType } from "./transaction";

export interface Category {
	id: string;
	name: string;
	color: string;
	type: TransactionType;
}

export interface CategorySumary {
	categoryId: string;
	categoryName: string;
	categoryColor: string;
	amount: number;
	pocentage: number;
}

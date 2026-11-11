import { type InputHTMLAttributes, type ReactNode, useId } from "react";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
	icon?: ReactNode;
	fullWidth?: boolean;
	label?: string;
	error?: string;
	id?: string;
}

const Input = ({
	icon,
	fullWidth,
	label,
	error,
	id,
	className = "",
	...rest
}: InputProps) => {
	const generatedId = useId();
	const inputId = id || generatedId;

	return (
		<div className={`${fullWidth ? "w-full" : ""} mb-4`}>
			{label && (
				<label
					htmlFor={inputId}
					className="block text-sm font-medium text-gray-300 mb-2"
				>
					{label}
				</label>
			)}

			<div className="relative">
				{icon && (
					<div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-gray-400">
						{icon}
					</div>
				)}

				<input
					id={inputId}
					aria-invalid={!!error}
					aria-describedby={error ? `${inputId}-error` : undefined}
					className={`bg-gray-800 text-gray-300 placeholder:text-gray-500 border block w-full p-2.5 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-primary-500 focus:border-primary-500 ${
						error ? "border-red-500" : "border-gray-600"
					} ${icon ? "pl-10" : "pl-3"} ${className}`}
					{...rest}
				/>
			</div>

			{error && (
				<p id={`${inputId}-error`} className="text-red-500 text-sm mt-1">
					{error}
				</p>
			)}
		</div>
	);
};

export default Input;

import { BrowserRouter, Route, Routes } from "react-router";
import { AuthProvider } from "../context/AuthContext";
import AppLayout from "../layout/App.Layout";
import Deshboard from "../pages/Dashboard";
import Home from "../pages/Home";
import Login from "../pages/Login";
import Transactions from "../pages/Transactions";
import TransactionsForm from "../pages/TransactionsForm";
import PrivateRoutes from "./PrivateRoutes";

const AppRoutes = () => {
	return (
		<BrowserRouter>
			<AuthProvider>
				<Routes>
					<Route path="/" element={<Home />} />
					<Route path="/login" element={<Login />} />

					<Route element={<PrivateRoutes />}>
						<Route element={<AppLayout />}>
							<Route path="/dashboard" element={<Deshboard />} />
							<Route path="/transacoes" element={<Transactions />} />
							<Route path="/transacoes/nova" element={<TransactionsForm />} />
						</Route>
					</Route>
				</Routes>
			</AuthProvider>
		</BrowserRouter>
	);
};

export default AppRoutes;

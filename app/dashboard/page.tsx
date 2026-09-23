"use client";

import { useEffect, useState } from "react";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

type Transaction = {
  id: string;
  amount: number;
  type: "income" | "expense";
  category: { name: string };
};

const COLORS = [
  "#3b82f6",
  "#ef4444",
  "#22c55e",
  "#f59e0b",
  "#8b5cf6",
  "#ec4899",
  "#14b8a6",
];

export default function DashboardPage() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      const res = await fetch("/api/transactions");
      const data = await res.json();
      setTransactions(data);
      setLoading(false);
    }
    loadData();
  }, []);

  const totalIncome = transactions
    .filter((t) => t.type === "income")
    .reduce((sum, t) => sum + t.amount, 0);

  const totalExpense = transactions
    .filter((t) => t.type === "expense")
    .reduce((sum, t) => sum + t.amount, 0);

  const balance = totalIncome - totalExpense;

  const expensesByCategory = transactions
    .filter((t) => t.type === "expense")
    .reduce((acc: Record<string, number>, t) => {
      acc[t.category.name] = (acc[t.category.name] || 0) + t.amount;
      return acc;
    }, {});

  const chartData = Object.entries(expensesByCategory).map(
    ([name, value]) => ({ name, value })
  );

  if (loading) {
    return <div className="p-8">Carregando...</div>;
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-linear-to-t from-finance-navy via-finance-dark to-black">
        <div className="mx-auto max-w-4xl p-8">
        <h1 className="mb-6 text-2xl font-bold text-white">Dashboard</h1>

        <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-3">
            <div className="rounded-2xl bg-green-100 p-4">
            <p className="text-sm text-black">Receitas</p>
            <p className="text-xl font-bold text-green-700">
                R$ {totalIncome.toFixed(2)}
            </p>
            </div>
            <div className="rounded-2xl bg-red-100 p-4">
            <p className="text-sm text-black">Despesas</p>
            <p className="text-xl font-bold text-red-700">
                R$ {totalExpense.toFixed(2)}
            </p>
            </div>
            <div
            className={`rounded-2xl p-4 ${
                balance >= 0 ? "bg-blue-100" : "bg-orange-100"
            }`}
            >
            <p className="text-sm text-black">Saldo</p>
            <p
                className={`text-xl font-bold ${
                balance >= 0 ? "text-blue-700" : "text-orange-700"
                }`}
            >
                R$ {balance.toFixed(2)}
            </p>
            </div>
        </div>

        <div className="rounded-2xl border border-gray-200 p-4">
            <h2 className="mb-4 text-lg font-semibold text-white">
            Despesas por categoria
            </h2>

            {chartData.length === 0 ? (
            <p className="text-gray-500">
                Nenhuma despesa cadastrada ainda.
            </p>
            ) : (
            <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                <Pie
                    data={chartData}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    outerRadius={100}
                    label={(entry) => entry.name}
                >
                    {chartData.map((_, index) => (
                    <Cell
                        key={`cell-${index}`}
                        fill={COLORS[index % COLORS.length]}
                    />
                    ))}
                </Pie>
                <Tooltip />
                <Legend />
                </PieChart>
            </ResponsiveContainer>
            )}
        </div>
        </div>
    </div>
    );
}
"use client";

import { useEffect, useState } from "react";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
} from "recharts";

type Transaction = {
  id: string;
  amount: number;
  type: "income" | "expense";
  category: { name: string };
};

const COLORS = ["#3ECF8E", "#F2545B", "#5EEAD4", "#FBBF24", "#818CF8", "#F472B6"];

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

  const incomeByCategory = transactions
    .filter((transaction) => transaction.type === "income")
    .reduce((acc: Record<string, number>, transaction) => {
      acc[transaction.category.name] =
        (acc[transaction.category.name] || 0) + transaction.amount;
      return acc;
    }, {});

  const incomeChartData = Object.entries(incomeByCategory).map(
    ([name, value]) => ({ name, value })
  );

  if (loading) {
    return <div className="p-8 text-text-muted">Carregando...</div>;
  }

  return (
    <div className="mx-auto max-w-4xl p-8">
      <h1 className="mb-6 text-2xl font-bold text-text">Dashboard</h1>

      <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div className="rounded-2xl border border-border bg-surface p-4">
          <p className="text-sm text-text-muted">Receitas</p>
          <p className="text-xl font-bold text-accent">
            R$ {totalIncome.toFixed(2)}
          </p>
        </div>
        <div className="rounded-2xl border border-border bg-surface p-4">
          <p className="text-sm text-text-muted">Despesas</p>
          <p className="text-xl font-bold text-danger">
            R$ {totalExpense.toFixed(2)}
          </p>
        </div>
        <div className="rounded-2xl border border-border bg-surface p-4">
          <p className="text-sm text-text-muted">Saldo</p>
          <p
            className={`text-xl font-bold ${
              balance >= 0 ? "text-accent" : "text-danger"
            }`}
          >
            R$ {balance.toFixed(2)}
          </p>
        </div>
      </div>

      <div className="rounded-2xl border border-border bg-surface p-4">
        <h2 className="mb-4 text-lg font-semibold text-text">
          Despesas por categoria
        </h2>

        {chartData.length === 0 ? (
          <p className="text-text-muted">Nenhuma despesa cadastrada ainda.</p>
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
              <Tooltip
                contentStyle={{
                  backgroundColor: "#141F1B",
                  border: "1px solid #1F2E28",
                  borderRadius: "8px",
                  color: "#E8ECEA",
                }}
              />
              <Legend wrapperStyle={{ color: "#8FA39B" }} />
            </PieChart>
          </ResponsiveContainer>
        )}
      </div>
      <div className="mt-6 rounded-2xl border border-border bg-surface p-4">
        <h2 className="mb-4 text-lg font-semibold text-text">
          Receitas por categoria
        </h2>

        {incomeChartData.length === 0 ? (
          <p className="text-text-muted">Nenhuma receita cadastrada ainda.</p>
        ) : (
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={incomeChartData} margin={{ top: 12, right: 12, left: 0, bottom: 0 }}>
              <CartesianGrid stroke="#1F2E28" strokeDasharray="3 3" />
              <XAxis dataKey="name" stroke="#8FA39B" />
              <YAxis stroke="#8FA39B" />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#141F1B",
                  border: "1px solid #1F2E28",
                  borderRadius: "8px",
                  color: "#E8ECEA",
                }}
              />
              <Bar dataKey="value" fill="#3ECF8E" name="Receitas" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
}
"use client";

export default function DashboardPage() {
    return (
        <div className="flex items-center justify-center min-h-screen bg-linear-to-b from-finance-dark via-finance-navy to-black bg-cover bg-center bg-no-repeat">
            <div className="bg-white/60 p-8 rounded-2xl shadow-lg w-full max-w-md backdrop-blur-xl border border-white/20">
                <h1 className="text-lg text-gray-800 mb-2 text-center">Bem-vindo ao Dashboard!</h1>
                <h2 className="text-2xl text-black mb-6 text-center">Aqui você pode gerenciar suas finanças</h2>
            </div>
        </div>
    );
}
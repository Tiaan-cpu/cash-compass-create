
import React, { useMemo } from "react";
import { Bar, Pie } from "recharts";
import { useFinancial } from "@/contexts/FinancialContext";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { BarChart, PieChart } from "@/components/ui/chart";
import { cn } from "@/lib/utils";

const Dashboard: React.FC = () => {
  const { transactions, totalIncome, totalExpense, balance } = useFinancial();

  // Data for income vs expense chart
  const overviewData = [
    {
      name: "Income",
      value: totalIncome,
      fill: "#38A169", // Green
    },
    {
      name: "Expenses",
      value: totalExpense,
      fill: "#E53E3E", // Red
    },
  ];

  // Get data for category breakdown
  const categoryData = useMemo(() => {
    const incomeCategories = new Map<string, number>();
    const expenseCategories = new Map<string, number>();

    transactions.forEach((transaction) => {
      const map =
        transaction.type === "income" ? incomeCategories : expenseCategories;
      const currentAmount = map.get(transaction.category) || 0;
      map.set(transaction.category, currentAmount + transaction.amount);
    });

    const incomeData = Array.from(incomeCategories.entries()).map(
      ([name, value]) => ({
        name,
        value,
        fill: "#38A169", // Green
      })
    );

    const expenseData = Array.from(expenseCategories.entries()).map(
      ([name, value]) => ({
        name,
        value,
        fill: "#E53E3E", // Red
      })
    );

    return { incomeData, expenseData };
  }, [transactions]);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 2,
    }).format(amount);
  };

  return (
    <div className="space-y-8">
      {/* Summary Cards */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total Income
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-income">
              {formatCurrency(totalIncome)}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total Expenses
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-expense">
              {formatCurrency(totalExpense)}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Balance
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div
              className={cn(
                "text-2xl font-bold",
                balance >= 0 ? "text-income" : "text-expense"
              )}
            >
              {formatCurrency(balance)}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Income vs Expenses</CardTitle>
            <CardDescription>
              Comparison between your income and expenses
            </CardDescription>
          </CardHeader>
          <CardContent className="pb-4">
            <BarChart
              data={overviewData}
              index="name"
              categories={["value"]}
              colors={["emerald", "rose"]}
              valueFormatter={(value) => formatCurrency(value)}
              className="h-[300px]"
            />
          </CardContent>
        </Card>

        {transactions.length > 0 ? (
          <Card>
            <CardHeader>
              <CardTitle>Category Breakdown</CardTitle>
              <CardDescription>
                Distribution of your expenses by category
              </CardDescription>
            </CardHeader>
            <CardContent className="pb-4">
              <PieChart
                data={categoryData.expenseData.length > 0 ? categoryData.expenseData : [{ name: "No Data", value: 1, fill: "#ccc" }]}
                index="name"
                categories={["value"]}
                valueFormatter={(value) => formatCurrency(value)}
                className="h-[300px]"
              />
            </CardContent>
          </Card>
        ) : (
          <Card>
            <CardHeader>
              <CardTitle>Category Breakdown</CardTitle>
              <CardDescription>
                Add transactions to see your category breakdown
              </CardDescription>
            </CardHeader>
            <CardContent className="flex h-[300px] items-center justify-center">
              <p className="text-muted-foreground">No data available</p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default Dashboard;


import React, { useMemo } from "react";
import { Bar, Pie, BarChart as RechartsBarChart, PieChart as RechartsPieChart, ResponsiveContainer, Cell, Tooltip } from "recharts";
import { useFinancial } from "@/contexts/FinancialContext";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ChartContainer, ChartTooltipContent } from "@/components/ui/chart";
import { cn } from "@/lib/utils";
import { Loader2 } from "lucide-react";

const Dashboard: React.FC = () => {
  const { transactions, totalIncome, totalExpense, balance, isLoading } = useFinancial();

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

  // Color palette for pie chart
  const COLORS = ["#38A169", "#3182CE", "#805AD5", "#D69E2E", "#DD6B20", "#E53E3E", "#F56565", "#ED8936", "#48BB78", "#4299E1"];

  if (isLoading) {
    return (
      <div className="h-60 flex items-center justify-center">
        <Loader2 className="h-10 w-10 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Summary Cards */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card className="overflow-hidden border-t-4 border-t-emerald-500 shadow-md hover:shadow-lg transition-shadow">
          <CardHeader className="pb-2 bg-gradient-to-r from-emerald-50 to-transparent">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total Income
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-emerald-500">
              {formatCurrency(totalIncome)}
            </div>
          </CardContent>
        </Card>
        <Card className="overflow-hidden border-t-4 border-t-rose-500 shadow-md hover:shadow-lg transition-shadow">
          <CardHeader className="pb-2 bg-gradient-to-r from-rose-50 to-transparent">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total Expenses
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-rose-500">
              {formatCurrency(totalExpense)}
            </div>
          </CardContent>
        </Card>
        <Card className={cn(
          "overflow-hidden border-t-4 shadow-md hover:shadow-lg transition-shadow", 
          balance >= 0 ? "border-t-emerald-500" : "border-t-rose-500"
        )}>
          <CardHeader className={cn(
            "pb-2 bg-gradient-to-r to-transparent", 
            balance >= 0 ? "from-emerald-50" : "from-rose-50"
          )}>
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Balance
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div
              className={cn(
                "text-2xl font-bold",
                balance >= 0 ? "text-emerald-500" : "text-rose-500"
              )}
            >
              {formatCurrency(balance)}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card className="shadow-md hover:shadow-lg transition-shadow">
          <CardHeader>
            <CardTitle>Income vs Expenses</CardTitle>
            <CardDescription>
              Comparison between your income and expenses
            </CardDescription>
          </CardHeader>
          <CardContent className="pb-4">
            <div className="h-[300px]">
              <ChartContainer config={{
                income: { color: "#38A169" },
                expense: { color: "#E53E3E" }
              }}>
                <ResponsiveContainer width="100%" height="100%">
                  <RechartsBarChart data={overviewData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                    <Tooltip content={<ChartTooltipContent />} />
                    <Bar dataKey="value" name="Amount" radius={[4, 4, 0, 0]}>
                      {overviewData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.fill} />
                      ))}
                    </Bar>
                  </RechartsBarChart>
                </ResponsiveContainer>
              </ChartContainer>
            </div>
          </CardContent>
        </Card>

        {transactions.length > 0 ? (
          <Card className="shadow-md hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle>Category Breakdown</CardTitle>
              <CardDescription>
                Distribution of your expenses by category
              </CardDescription>
            </CardHeader>
            <CardContent className="pb-4">
              <div className="h-[300px]">
                <ChartContainer config={{
                  expense: { color: "#E53E3E" }
                }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <RechartsPieChart>
                      <Tooltip content={<ChartTooltipContent />} />
                      <Pie
                        data={categoryData.expenseData.length > 0 ? categoryData.expenseData : [{ name: "No Data", value: 1, fill: "#ccc" }]}
                        dataKey="value"
                        nameKey="name"
                        cx="50%"
                        cy="50%"
                        outerRadius={80}
                        label={(entry) => entry.name}
                      >
                        {categoryData.expenseData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                    </RechartsPieChart>
                  </ResponsiveContainer>
                </ChartContainer>
              </div>
            </CardContent>
          </Card>
        ) : (
          <Card className="shadow-md hover:shadow-lg transition-shadow bg-gradient-to-br from-gray-50 to-transparent">
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


import React, { useState } from "react";
import { format } from "date-fns";
import { useFinancial, Transaction, TransactionType } from "@/contexts/FinancialContext";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

const TransactionList: React.FC = () => {
  const { transactions, deleteTransaction } = useFinancial();
  const [filter, setFilter] = useState<TransactionType | "all">("all");
  const [searchTerm, setSearchTerm] = useState("");

  const filteredTransactions = transactions.filter((transaction) => {
    const matchesType = filter === "all" || transaction.type === filter;
    const matchesSearch =
      transaction.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      transaction.category.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesType && (searchTerm === "" || matchesSearch);
  });

  const formatAmount = (amount: number, type: TransactionType) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-2xl font-bold">Transactions</CardTitle>
        <CardDescription>View your recent transactions</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="mb-4">
          <div className="space-y-2">
            <Label htmlFor="search">Search</Label>
            <Input
              id="search"
              placeholder="Search by description or category..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        <Tabs defaultValue="all" className="w-full" onValueChange={(value) => setFilter(value as TransactionType | "all")}>
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="income" className="data-[state=active]:bg-income/20">Income</TabsTrigger>
            <TabsTrigger value="expense" className="data-[state=active]:bg-expense/20">Expenses</TabsTrigger>
          </TabsList>
          <TabsContent value="all" className="mt-4">
            {renderTransactionsTable(filteredTransactions, deleteTransaction, formatAmount)}
          </TabsContent>
          <TabsContent value="income" className="mt-4">
            {renderTransactionsTable(filteredTransactions, deleteTransaction, formatAmount)}
          </TabsContent>
          <TabsContent value="expense" className="mt-4">
            {renderTransactionsTable(filteredTransactions, deleteTransaction, formatAmount)}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

const renderTransactionsTable = (
  transactions: Transaction[],
  deleteTransaction: (id: string) => void,
  formatAmount: (amount: number, type: TransactionType) => string
) => {
  if (transactions.length === 0) {
    return <p className="text-center py-4 text-muted-foreground">No transactions found.</p>;
  }

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Date</TableHead>
            <TableHead>Category</TableHead>
            <TableHead>Description</TableHead>
            <TableHead className="text-right">Amount</TableHead>
            <TableHead className="text-right">Action</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {transactions.map((transaction) => (
            <TableRow key={transaction.id}>
              <TableCell className="font-medium">
                {format(transaction.date, "MMM d, yyyy")}
              </TableCell>
              <TableCell>{transaction.category}</TableCell>
              <TableCell className="max-w-[200px] truncate">
                {transaction.description || "-"}
              </TableCell>
              <TableCell
                className={cn(
                  "text-right font-medium",
                  transaction.type === "income" ? "text-income" : "text-expense"
                )}
              >
                {formatAmount(transaction.amount, transaction.type)}
              </TableCell>
              <TableCell className="text-right">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => deleteTransaction(transaction.id)}
                  className="h-8 w-8 p-0 text-muted-foreground hover:text-destructive"
                >
                  <span className="sr-only">Delete</span>
                  &times;
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default TransactionList;


import React, { createContext, useState, useContext, ReactNode, useEffect } from "react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { v4 as uuidv4 } from "uuid";

export type TransactionType = "income" | "expense";

export interface Transaction {
  id: string;
  type: TransactionType;
  amount: number;
  category: string;
  description: string;
  date: Date;
  user_id?: string;
}

interface FinancialContextType {
  transactions: Transaction[];
  addTransaction: (transaction: Omit<Transaction, "id" | "user_id">) => void;
  deleteTransaction: (id: string) => void;
  totalIncome: number;
  totalExpense: number;
  balance: number;
  isLoading: boolean;
}

const FinancialContext = createContext<FinancialContextType | undefined>(undefined);

export const useFinancial = (): FinancialContextType => {
  const context = useContext(FinancialContext);
  if (!context) {
    throw new Error("useFinancial must be used within a FinancialProvider");
  }
  return context;
};

interface FinancialProviderProps {
  children: ReactNode;
}

export const FinancialProvider: React.FC<FinancialProviderProps> = ({ children }) => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { user } = useAuth();

  // Fetch transactions from Supabase
  useEffect(() => {
    const fetchTransactions = async () => {
      if (!user) {
        setTransactions([]);
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        const { data, error } = await supabase
          .from('transactions')
          .select('*')
          .eq('user_id', user.id)
          .order('date', { ascending: false });

        if (error) {
          throw error;
        }

        if (data) {
          // Convert string dates back to Date objects
          const formattedTransactions = data.map(transaction => ({
            ...transaction,
            date: new Date(transaction.date),
          }));
          
          setTransactions(formattedTransactions);
        }
      } catch (error: any) {
        console.error('Error fetching transactions:', error.message);
        toast.error("Failed to load your transactions");
      } finally {
        setIsLoading(false);
      }
    };

    fetchTransactions();
  }, [user]);

  const addTransaction = async (transaction: Omit<Transaction, "id" | "user_id">) => {
    if (!user) {
      toast.error("You need to be logged in to add transactions");
      return;
    }

    const newTransaction = {
      ...transaction,
      id: uuidv4(),
      user_id: user.id,
    };
    
    try {
      // Optimistically update UI
      setTransactions((prev) => [newTransaction, ...prev]);
      
      // Store in Supabase (dates need to be ISO strings)
      const { error } = await supabase
        .from('transactions')
        .insert({
          id: newTransaction.id,
          type: newTransaction.type,
          amount: newTransaction.amount,
          category: newTransaction.category,
          description: newTransaction.description,
          date: newTransaction.date.toISOString(),
          user_id: user.id,
        });

      if (error) {
        throw error;
      }
      
      toast.success(`${transaction.type === "income" ? "Income" : "Expense"} added successfully!`);
    } catch (error: any) {
      console.error('Error adding transaction:', error.message);
      // Revert the optimistic update if saving fails
      setTransactions((prev) => prev.filter(t => t.id !== newTransaction.id));
      toast.error("Failed to save transaction");
    }
  };

  const deleteTransaction = async (id: string) => {
    if (!user) {
      toast.error("You need to be logged in to delete transactions");
      return;
    }

    try {
      // Optimistically update UI
      const transactionToDelete = transactions.find(t => t.id === id);
      setTransactions((prev) => prev.filter((transaction) => transaction.id !== id));
      
      // Delete from Supabase
      const { error } = await supabase
        .from('transactions')
        .delete()
        .eq('id', id)
        .eq('user_id', user.id);

      if (error) {
        throw error;
      }
      
      toast.success("Transaction deleted successfully!");
    } catch (error: any) {
      console.error('Error deleting transaction:', error.message);
      toast.error("Failed to delete transaction");
      // Revert the optimistic update if deletion fails
      if (transactionToDelete) {
        setTransactions((prev) => [...prev, transactionToDelete]);
      }
    }
  };

  const totalIncome = transactions
    .filter((t) => t.type === "income")
    .reduce((sum, transaction) => sum + transaction.amount, 0);

  const totalExpense = transactions
    .filter((t) => t.type === "expense")
    .reduce((sum, transaction) => sum + transaction.amount, 0);

  const balance = totalIncome - totalExpense;

  return (
    <FinancialContext.Provider
      value={{
        transactions,
        addTransaction,
        deleteTransaction,
        totalIncome,
        totalExpense,
        balance,
        isLoading
      }}
    >
      {children}
    </FinancialContext.Provider>
  );
};


import React from "react";
import { FinancialProvider } from "@/contexts/FinancialContext";
import Dashboard from "@/components/Dashboard";
import TransactionForm from "@/components/TransactionForm";
import TransactionList from "@/components/TransactionList";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useIsMobile } from "@/hooks/use-mobile";

const Index = () => {
  const isMobile = useIsMobile();

  return (
    <FinancialProvider>
      <div className="container py-6">
        <header className="mb-8">
          <h1 className="text-4xl font-bold">Income vs Expense Tracker</h1>
          <p className="text-muted-foreground">
            Track, analyze, and manage your personal finances
          </p>
        </header>

        {isMobile ? (
          // Mobile layout with tabs
          <Tabs defaultValue="dashboard" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
              <TabsTrigger value="add">Add New</TabsTrigger>
              <TabsTrigger value="history">History</TabsTrigger>
            </TabsList>
            <TabsContent value="dashboard" className="mt-6">
              <Dashboard />
            </TabsContent>
            <TabsContent value="add" className="mt-6">
              <TransactionForm />
            </TabsContent>
            <TabsContent value="history" className="mt-6">
              <TransactionList />
            </TabsContent>
          </Tabs>
        ) : (
          // Desktop layout
          <div className="flex flex-col gap-8">
            <Dashboard />
            
            <div className="grid gap-6 md:grid-cols-2">
              <div>
                <TransactionForm />
              </div>
              <div>
                <TransactionList />
              </div>
            </div>
          </div>
        )}
      </div>
    </FinancialProvider>
  );
};

export default Index;

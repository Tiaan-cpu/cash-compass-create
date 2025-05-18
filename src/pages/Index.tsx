
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
      <div className="container py-6 animate-in fade-in duration-500">
        <header className="mb-8 text-center">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-emerald-600 via-blue-600 to-rose-500 bg-clip-text text-transparent">
            Income vs Expense Tracker
          </h1>
          <p className="text-muted-foreground mt-2 max-w-2xl mx-auto">
            Track, analyze, and manage your personal finances with our intuitive dashboard
          </p>
        </header>

        {isMobile ? (
          // Mobile layout with tabs
          <Tabs defaultValue="dashboard" className="w-full">
            <TabsList className="grid w-full grid-cols-3 mb-6">
              <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
              <TabsTrigger value="add">Add New</TabsTrigger>
              <TabsTrigger value="history">History</TabsTrigger>
            </TabsList>
            <TabsContent value="dashboard" className="mt-6 animate-in fade-in duration-300">
              <Dashboard />
            </TabsContent>
            <TabsContent value="add" className="mt-6 animate-in fade-in duration-300">
              <TransactionForm />
            </TabsContent>
            <TabsContent value="history" className="mt-6 animate-in fade-in duration-300">
              <TransactionList />
            </TabsContent>
          </Tabs>
        ) : (
          // Desktop layout
          <div className="flex flex-col gap-8">
            <Dashboard />
            
            <div className="grid gap-6 md:grid-cols-2">
              <div className="animate-in fade-in duration-300" style={{ animationDelay: "100ms" }}>
                <TransactionForm />
              </div>
              <div className="animate-in fade-in duration-300" style={{ animationDelay: "200ms" }}>
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

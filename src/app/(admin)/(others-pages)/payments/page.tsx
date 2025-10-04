"use client";

import React, { useEffect, useState } from "react";
import { supabase, Payment } from "@/lib/supabase";
import PageBreadCrumb from "@/components/common/PageBreadCrumb";
import InputField from "@/components/form/input/InputField";
import PaymentStatusFilter from "@/components/payments/PaymentStatusFilter";
import PaymentCard from "@/components/payments/PaymentCard";
import PaymentActionChecklist from "@/components/payments/PaymentActionChecklist";
import { Modal } from "@/components/ui/modal";
import Checkbox from "@/components/form/input/Checkbox";

export default function PaymentsPage() {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [filteredPayments, setFilteredPayments] = useState<Payment[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [selectedPayments, setSelectedPayments] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [detailsModalOpen, setDetailsModalOpen] = useState(false);
  const [selectedPayment, setSelectedPayment] = useState<Payment | null>(null);

  useEffect(() => {
    fetchPayments();
  }, []);

  useEffect(() => {
    applyFilters();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [payments, searchQuery, selectedStatus]);

  const fetchPayments = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from("payments")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;

      setPayments(data || []);
    } catch (error) {
      console.error("Error fetching payments:", error);
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = () => {
    let filtered = [...payments];

    if (searchQuery) {
      filtered = filtered.filter(
        (payment) =>
          payment.user_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          payment.service_name
            .toLowerCase()
            .includes(searchQuery.toLowerCase())
      );
    }

    if (selectedStatus !== "all") {
      filtered = filtered.filter((payment) => payment.status === selectedStatus);
    }

    setFilteredPayments(filtered);
  };

  const getCounts = () => {
    return {
      all: payments.length,
      paid: payments.filter((p) => p.status === "paid").length,
      pending: payments.filter((p) => p.status === "pending").length,
      cancelled: payments.filter((p) => p.status === "cancelled").length,
    };
  };

  const handleMarkAsPaid = async (id: string) => {
    try {
      const { error } = await supabase
        .from("payments")
        .update({
          status: "paid",
          payment_date: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        })
        .eq("id", id);

      if (error) throw error;

      await fetchPayments();
      alert("Pagamento marcado como pago com sucesso!");
    } catch (error) {
      console.error("Error updating payment:", error);
      alert("Erro ao atualizar pagamento");
    }
  };

  const handleGenerateReceipt = (id: string) => {
    alert(`Gerando recibo para pagamento ${id}...`);
  };

  const handleSendNotification = (id: string) => {
    alert(`Enviando notificação para pagamento ${id}...`);
  };

  const handleViewDetails = (id: string) => {
    const payment = payments.find((p) => p.id === id);
    if (payment) {
      setSelectedPayment(payment);
      setDetailsModalOpen(true);
    }
  };

  const handleMarkMultipleAsPaid = async (paymentIds: string[]) => {
    try {
      for (const id of paymentIds) {
        await supabase
          .from("payments")
          .update({
            status: "paid",
            payment_date: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          })
          .eq("id", id);
      }

      await fetchPayments();
      setSelectedPayments([]);
      alert(`${paymentIds.length} pagamento(s) marcado(s) como pago!`);
    } catch (error) {
      console.error("Error updating payments:", error);
      alert("Erro ao atualizar pagamentos");
    }
  };

  const handleGenerateMultipleReceipts = (paymentIds: string[]) => {
    alert(`Gerando recibos para ${paymentIds.length} pagamento(s)...`);
  };

  const handleSendMultipleNotifications = (paymentIds: string[]) => {
    alert(`Enviando notificações para ${paymentIds.length} pagamento(s)...`);
  };

  const togglePaymentSelection = (id: string) => {
    if (selectedPayments.includes(id)) {
      setSelectedPayments(selectedPayments.filter((p) => p !== id));
    } else {
      setSelectedPayments([...selectedPayments, id]);
    }
  };

  const toggleSelectAll = () => {
    if (selectedPayments.length === filteredPayments.length) {
      setSelectedPayments([]);
    } else {
      setSelectedPayments(filteredPayments.map((p) => p.id));
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(amount);
  };

  const formatDate = (date?: string) => {
    if (!date) return "-";
    return new Date(date).toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <>
      <PageBreadCrumb pageTitle="Pagamentos" />

      <div className="space-y-6">
        <div className="rounded-2xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-white/[0.03]">
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-gray-800 dark:text-white/90">
              Gerenciamento de Pagamentos
            </h1>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              Visualize e gerencie todos os pagamentos
            </p>
          </div>

          <div className="space-y-4">
            <InputField
              type="text"
              placeholder="Buscar por usuário ou serviço..."
              defaultValue={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />

            <PaymentStatusFilter
              selectedStatus={selectedStatus}
              onChange={setSelectedStatus}
              counts={getCounts()}
            />
          </div>
        </div>

        {selectedPayments.length > 0 && (
          <PaymentActionChecklist
            selectedPayments={selectedPayments}
            onMarkMultipleAsPaid={handleMarkMultipleAsPaid}
            onGenerateMultipleReceipts={handleGenerateMultipleReceipts}
            onSendMultipleNotifications={handleSendMultipleNotifications}
          />
        )}

        <div className="rounded-2xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-white/[0.03]">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-lg font-semibold text-gray-800 dark:text-white/90">
                Lista de Pagamentos
              </h2>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                {loading
                  ? "Carregando..."
                  : `${filteredPayments.length} pagamento(s) encontrado(s)`}
              </p>
            </div>
            {filteredPayments.length > 0 && (
              <label className="flex items-center gap-2 cursor-pointer">
                <Checkbox
                  checked={
                    selectedPayments.length === filteredPayments.length &&
                    filteredPayments.length > 0
                  }
                  onChange={toggleSelectAll}
                />
                <span className="text-sm text-gray-700 dark:text-gray-300">
                  Selecionar todos
                </span>
              </label>
            )}
          </div>

          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-500"></div>
            </div>
          ) : filteredPayments.length === 0 ? (
            <div className="text-center py-12">
              <svg
                className="w-16 h-16 mx-auto mb-4 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                />
              </svg>
              <p className="text-gray-600 dark:text-gray-400">
                Nenhum pagamento encontrado
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-500 mt-1">
                Tente ajustar os filtros ou buscar por outros termos
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredPayments.map((payment) => (
                <div key={payment.id} className="flex items-start gap-4">
                  <div className="pt-6">
                    <Checkbox
                      checked={selectedPayments.includes(payment.id)}
                      onChange={() => togglePaymentSelection(payment.id)}
                    />
                  </div>
                  <div className="flex-1">
                    <PaymentCard
                      payment={payment}
                      onMarkAsPaid={handleMarkAsPaid}
                      onGenerateReceipt={handleGenerateReceipt}
                      onSendNotification={handleSendNotification}
                      onViewDetails={handleViewDetails}
                    />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {selectedPayment && (
        <Modal
          isOpen={detailsModalOpen}
          onClose={() => {
            setDetailsModalOpen(false);
            setSelectedPayment(null);
          }}
          className="max-w-2xl p-6"
        >
          <div className="space-y-4">
            <h2 className="text-xl font-semibold text-gray-800 dark:text-white/90 mb-4">
              Detalhes do Pagamento
            </h2>
            <div>
              <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">
                Serviço
              </h4>
              <p className="text-base text-gray-800 dark:text-white/90">
                {selectedPayment.service_name}
              </p>
            </div>
            <div>
              <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">
                Usuário
              </h4>
              <p className="text-base text-gray-800 dark:text-white/90">
                {selectedPayment.user_name}
              </p>
            </div>
            <div>
              <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">
                Valor
              </h4>
              <p className="text-xl font-bold text-gray-800 dark:text-white/90">
                {formatCurrency(selectedPayment.amount)}
              </p>
            </div>
            <div>
              <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">
                Status
              </h4>
              <p className="text-base text-gray-800 dark:text-white/90">
                {selectedPayment.status === "paid"
                  ? "Pago"
                  : selectedPayment.status === "pending"
                  ? "Pendente"
                  : "Cancelado"}
              </p>
            </div>
            <div>
              <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">
                Data de Pagamento
              </h4>
              <p className="text-base text-gray-800 dark:text-white/90">
                {formatDate(selectedPayment.payment_date)}
              </p>
            </div>
            <div>
              <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">
                Data de Vencimento
              </h4>
              <p className="text-base text-gray-800 dark:text-white/90">
                {formatDate(selectedPayment.due_date)}
              </p>
            </div>
            {selectedPayment.notes && (
              <div>
                <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">
                  Observações
                </h4>
                <p className="text-base text-gray-800 dark:text-white/90">
                  {selectedPayment.notes}
                </p>
              </div>
            )}
            <div>
              <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">
                Criado em
              </h4>
              <p className="text-base text-gray-800 dark:text-white/90">
                {formatDate(selectedPayment.created_at)}
              </p>
            </div>
          </div>
        </Modal>
      )}
    </>
  );
}

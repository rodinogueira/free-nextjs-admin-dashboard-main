import React from "react";
import { Payment } from "@/lib/supabase";
import Badge from "../ui/badge/Badge";
import Button from "../ui/button/Button";

interface PaymentCardProps {
  payment: Payment;
  onMarkAsPaid?: (id: string) => void;
  onGenerateReceipt?: (id: string) => void;
  onSendNotification?: (id: string) => void;
  onViewDetails?: (id: string) => void;
}

const PaymentCard: React.FC<PaymentCardProps> = ({
  payment,
  onMarkAsPaid,
  onGenerateReceipt,
  onSendNotification,
  onViewDetails,
}) => {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(amount);
  };

  const formatDate = (date?: string) => {
    if (!date) return "-";
    return new Date(date).toLocaleDateString("pt-BR");
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "paid":
        return "success";
      case "pending":
        return "warning";
      case "cancelled":
        return "error";
      default:
        return "primary";
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case "paid":
        return "Pago";
      case "pending":
        return "Pendente";
      case "cancelled":
        return "Cancelado";
      default:
        return status;
    }
  };

  return (
    <div className="rounded-xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-white/[0.03] hover:shadow-lg transition-shadow">
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-2">
            <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">
              {payment.service_name}
            </h3>
            <Badge size="sm" color={getStatusColor(payment.status)}>
              {getStatusLabel(payment.status)}
            </Badge>
          </div>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Usuário: {payment.user_name}
          </p>
        </div>
        <div className="text-right">
          <p className="text-2xl font-bold text-gray-800 dark:text-white/90">
            {formatCurrency(payment.amount)}
          </p>
        </div>
      </div>

      <div className="space-y-2 mb-4 pb-4 border-b border-gray-200 dark:border-gray-800">
        <div className="flex justify-between text-sm">
          <span className="text-gray-600 dark:text-gray-400">
            Data de Pagamento:
          </span>
          <span className="text-gray-800 dark:text-white/90">
            {formatDate(payment.payment_date)}
          </span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-gray-600 dark:text-gray-400">
            Data de Vencimento:
          </span>
          <span className="text-gray-800 dark:text-white/90">
            {formatDate(payment.due_date)}
          </span>
        </div>
        {payment.notes && (
          <div className="mt-2">
            <p className="text-xs text-gray-500 dark:text-gray-500">
              Observações:
            </p>
            <p className="text-sm text-gray-700 dark:text-gray-300 mt-1">
              {payment.notes}
            </p>
          </div>
        )}
      </div>

      <div className="flex flex-wrap gap-2">
        {payment.status === "pending" && onMarkAsPaid && (
          <Button
            size="sm"
            variant="primary"
            onClick={() => onMarkAsPaid(payment.id)}
          >
            Marcar como Pago
          </Button>
        )}
        {payment.status === "paid" && onGenerateReceipt && (
          <Button
            size="sm"
            variant="outline"
            onClick={() => onGenerateReceipt(payment.id)}
          >
            Gerar Recibo
          </Button>
        )}
        {payment.status === "pending" && onSendNotification && (
          <Button
            size="sm"
            variant="outline"
            onClick={() => onSendNotification(payment.id)}
          >
            Enviar Notificação
          </Button>
        )}
        {onViewDetails && (
          <Button
            size="sm"
            variant="outline"
            onClick={() => onViewDetails(payment.id)}
          >
            Ver Detalhes
          </Button>
        )}
      </div>
    </div>
  );
};

export default PaymentCard;

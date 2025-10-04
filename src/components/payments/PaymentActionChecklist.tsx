import React, { useState } from "react";
import Checkbox from "../form/input/Checkbox";
import Button from "../ui/button/Button";

interface PaymentActionChecklistProps {
  selectedPayments: string[];
  onMarkMultipleAsPaid: (paymentIds: string[]) => void;
  onGenerateMultipleReceipts: (paymentIds: string[]) => void;
  onSendMultipleNotifications: (paymentIds: string[]) => void;
}

const PaymentActionChecklist: React.FC<PaymentActionChecklistProps> = ({
  selectedPayments,
  onMarkMultipleAsPaid,
  onGenerateMultipleReceipts,
  onSendMultipleNotifications,
}) => {
  const [actions, setActions] = useState({
    markAsPaid: false,
    generateReceipts: false,
    sendNotifications: false,
  });

  const handleToggle = (action: keyof typeof actions) => {
    setActions((prev) => ({
      ...prev,
      [action]: !prev[action],
    }));
  };

  const handleExecuteActions = () => {
    if (selectedPayments.length === 0) {
      alert("Selecione pelo menos um pagamento");
      return;
    }

    if (actions.markAsPaid) {
      onMarkMultipleAsPaid(selectedPayments);
    }
    if (actions.generateReceipts) {
      onGenerateMultipleReceipts(selectedPayments);
    }
    if (actions.sendNotifications) {
      onSendMultipleNotifications(selectedPayments);
    }

    setActions({
      markAsPaid: false,
      generateReceipts: false,
      sendNotifications: false,
    });
  };

  const hasSelectedActions =
    actions.markAsPaid || actions.generateReceipts || actions.sendNotifications;

  return (
    <div className="rounded-xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-white/[0.03]">
      <h3 className="text-base font-semibold text-gray-800 dark:text-white/90 mb-4">
        Ações em Lote
      </h3>

      <div className="space-y-3 mb-4">
        <label className="flex items-center gap-3 cursor-pointer p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-white/[0.03] transition">
          <Checkbox
            checked={actions.markAsPaid}
            onChange={() => handleToggle("markAsPaid")}
          />
          <div>
            <p className="text-sm font-medium text-gray-800 dark:text-white/90">
              Marcar como Pago
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              Atualiza o status dos pagamentos selecionados para &quot;Pago&quot;
            </p>
          </div>
        </label>

        <label className="flex items-center gap-3 cursor-pointer p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-white/[0.03] transition">
          <Checkbox
            checked={actions.generateReceipts}
            onChange={() => handleToggle("generateReceipts")}
          />
          <div>
            <p className="text-sm font-medium text-gray-800 dark:text-white/90">
              Gerar Recibos
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              Cria recibos para os pagamentos selecionados
            </p>
          </div>
        </label>

        <label className="flex items-center gap-3 cursor-pointer p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-white/[0.03] transition">
          <Checkbox
            checked={actions.sendNotifications}
            onChange={() => handleToggle("sendNotifications")}
          />
          <div>
            <p className="text-sm font-medium text-gray-800 dark:text-white/90">
              Enviar Notificações
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              Envia notificações por email para os usuários
            </p>
          </div>
        </label>
      </div>

      <div className="flex items-center justify-between pt-4 border-t border-gray-200 dark:border-gray-800">
        <p className="text-sm text-gray-600 dark:text-gray-400">
          {selectedPayments.length} pagamento(s) selecionado(s)
        </p>
        <Button
          size="sm"
          variant="primary"
          onClick={handleExecuteActions}
          disabled={!hasSelectedActions || selectedPayments.length === 0}
        >
          Executar Ações
        </Button>
      </div>
    </div>
  );
};

export default PaymentActionChecklist;

import React from "react";

interface PaymentStatusFilterProps {
  selectedStatus: string;
  onChange: (status: string) => void;
  counts: {
    all: number;
    paid: number;
    pending: number;
    cancelled: number;
  };
}

const PaymentStatusFilter: React.FC<PaymentStatusFilterProps> = ({
  selectedStatus,
  onChange,
  counts,
}) => {
  return (
    <div className="flex flex-wrap gap-2">
      <button
        onClick={() => onChange("all")}
        className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
          selectedStatus === "all"
            ? "bg-brand-500 text-white"
            : "bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700"
        }`}
      >
        Todos ({counts.all})
      </button>
      <button
        onClick={() => onChange("paid")}
        className={`px-4 py-2 rounded-lg text-sm font-medium transition flex items-center gap-2 ${
          selectedStatus === "paid"
            ? "bg-success-500 text-white"
            : "bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700"
        }`}
      >
        Pagos ({counts.paid})
      </button>
      <button
        onClick={() => onChange("pending")}
        className={`px-4 py-2 rounded-lg text-sm font-medium transition flex items-center gap-2 ${
          selectedStatus === "pending"
            ? "bg-warning-500 text-white"
            : "bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700"
        }`}
      >
        Pendentes ({counts.pending})
      </button>
      <button
        onClick={() => onChange("cancelled")}
        className={`px-4 py-2 rounded-lg text-sm font-medium transition flex items-center gap-2 ${
          selectedStatus === "cancelled"
            ? "bg-error-500 text-white"
            : "bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700"
        }`}
      >
        Cancelados ({counts.cancelled})
      </button>
    </div>
  );
};

export default PaymentStatusFilter;

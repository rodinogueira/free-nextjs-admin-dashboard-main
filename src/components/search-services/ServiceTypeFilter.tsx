import React from "react";
import RadioSm from "../form/input/RadioSm";

interface ServiceTypeFilterProps {
  selectedType: string;
  onChange: (type: string) => void;
}

const ServiceTypeFilter: React.FC<ServiceTypeFilterProps> = ({
  selectedType,
  onChange,
}) => {
  return (
    <div className="flex flex-col gap-3">
      <h4 className="text-sm font-medium text-gray-800 dark:text-white/90">
        Tipo de Serviço
      </h4>
      <div className="flex flex-col gap-2">
        <RadioSm
          id="serviceType-all"
          name="serviceType"
          value="all"
          label="Todos"
          checked={selectedType === "all"}
          onChange={() => onChange("all")}
        />
        <RadioSm
          id="serviceType-physical"
          name="serviceType"
          value="physical"
          label="Local Físico"
          checked={selectedType === "physical"}
          onChange={() => onChange("physical")}
        />
        <RadioSm
          id="serviceType-teleconsultation"
          name="serviceType"
          value="teleconsultation"
          label="Teleconsulta"
          checked={selectedType === "teleconsultation"}
          onChange={() => onChange("teleconsultation")}
        />
      </div>
    </div>
  );
};

export default ServiceTypeFilter;

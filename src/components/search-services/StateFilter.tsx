import React from "react";
import Checkbox from "../form/input/Checkbox";

interface StateFilterProps {
  selectedStates: string[];
  onChange: (states: string[]) => void;
}

const brazilianStates = [
  { code: "AC", name: "Acre" },
  { code: "AL", name: "Alagoas" },
  { code: "AP", name: "Amapá" },
  { code: "AM", name: "Amazonas" },
  { code: "BA", name: "Bahia" },
  { code: "CE", name: "Ceará" },
  { code: "DF", name: "Distrito Federal" },
  { code: "ES", name: "Espírito Santo" },
  { code: "GO", name: "Goiás" },
  { code: "MA", name: "Maranhão" },
  { code: "MT", name: "Mato Grosso" },
  { code: "MS", name: "Mato Grosso do Sul" },
  { code: "MG", name: "Minas Gerais" },
  { code: "PA", name: "Pará" },
  { code: "PB", name: "Paraíba" },
  { code: "PR", name: "Paraná" },
  { code: "PE", name: "Pernambuco" },
  { code: "PI", name: "Piauí" },
  { code: "RJ", name: "Rio de Janeiro" },
  { code: "RN", name: "Rio Grande do Norte" },
  { code: "RS", name: "Rio Grande do Sul" },
  { code: "RO", name: "Rondônia" },
  { code: "RR", name: "Roraima" },
  { code: "SC", name: "Santa Catarina" },
  { code: "SP", name: "São Paulo" },
  { code: "SE", name: "Sergipe" },
  { code: "TO", name: "Tocantins" },
];

const StateFilter: React.FC<StateFilterProps> = ({
  selectedStates,
  onChange,
}) => {
  const handleToggle = (stateCode: string) => {
    if (selectedStates.includes(stateCode)) {
      onChange(selectedStates.filter((s) => s !== stateCode));
    } else {
      onChange([...selectedStates, stateCode]);
    }
  };

  return (
    <div className="flex flex-col gap-3">
      <h4 className="text-sm font-medium text-gray-800 dark:text-white/90">
        Estados
      </h4>
      <div className="flex flex-col gap-2 max-h-64 overflow-y-auto">
        {brazilianStates.map((state) => (
          <label
            key={state.code}
            className="flex items-center gap-2 cursor-pointer"
          >
            <Checkbox
              checked={selectedStates.includes(state.code)}
              onChange={() => handleToggle(state.code)}
            />
            <span className="text-sm text-gray-700 dark:text-gray-300">
              {state.name} ({state.code})
            </span>
          </label>
        ))}
      </div>
    </div>
  );
};

export default StateFilter;

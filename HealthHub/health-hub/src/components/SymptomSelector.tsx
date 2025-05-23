
import React from "react";
import Select, { MultiValue } from "react-select";
import { SymptomOption } from "./SymptonOption";

type SymptomSelectorProps = {
    value: MultiValue<SymptomOption>;
    onChange: (val: MultiValue<SymptomOption>) => void;
    symptomOptions: SymptomOption[];
};

const SymptomSelector: React.FC<SymptomSelectorProps> = ({ value, onChange, symptomOptions }) => {
    return (
        <Select<SymptomOption, true>
      options= { symptomOptions }
    isMulti
    onChange = { onChange }
    value = { value }
    placeholder = "Select symptoms..."
    closeMenuOnSelect = { false}
        />
  );
};

export default SymptomSelector;

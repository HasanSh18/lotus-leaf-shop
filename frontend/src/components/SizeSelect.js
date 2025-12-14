// src/components/SizeSelect.js
import React from 'react';
import Select from 'react-select';

const SIZE_OPTIONS = ['XS', 'S', 'M', 'L', 'XL', '2XL'];

const SizeSelect = ({ value, onChange, placeholder = 'Size' }) => {
  const options = SIZE_OPTIONS.map((s) => ({ value: s, label: s }));
  const selected = value ? { value, label: value } : null;

  return (
    <Select
      classNamePrefix="size-select"
      options={options}
      value={selected}
      onChange={(opt) => onChange(opt ? opt.value : '')}
      placeholder={placeholder}
      // 👇 ما بقى في X
      isClearable={false}
      // 👇 نشيل الخط بين القيمة والسهم
      components={{
        IndicatorSeparator: () => null,
      }}
      styles={{
        control: (base, state) => ({
          ...base,
          minHeight: 38,
          borderRadius: 4,
          fontSize: 14,
          backgroundColor: '#ffffff',
          color: '#000000',
          borderColor: state.isFocused ? '#0d6efd' : base.borderColor,
          boxShadow: state.isFocused ? '0 0 0 1px #0d6efd' : 'none',
          '&:hover': {
            borderColor: '#0d6efd',
          },
        }),
        menu: (base) => ({
          ...base,
          fontSize: 14,
          zIndex: 5,
          backgroundColor: '#ffffff',
        }),
        option: (base, state) => ({
          ...base,
          backgroundColor: state.isFocused
            ? '#e7f1ff'
            : state.isSelected
            ? '#cfe2ff'
            : '#ffffff',
          color: '#000000',
          cursor: 'pointer',
        }),
        singleValue: (base) => ({
          ...base,
          color: '#000000',
        }),
        placeholder: (base) => ({
          ...base,
          color: '#000000',
        }),
        input: (base) => ({
          ...base,
          color: '#000000',
        }),
      }}
    />
  );
};

export default SizeSelect;

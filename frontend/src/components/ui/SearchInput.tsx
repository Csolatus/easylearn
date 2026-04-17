import { SearchFieldRoot, SearchFieldGroup, SearchFieldInput, SearchFieldSearchIcon } from "@heroui/react";

type Props = {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
};

export default function SearchInput({ value, onChange, placeholder = "Rechercher..." }: Props) {
  return (
    <SearchFieldRoot value={value} onChange={onChange}>
      <SearchFieldGroup>
        <SearchFieldSearchIcon />
        <SearchFieldInput placeholder={placeholder} />
      </SearchFieldGroup>
    </SearchFieldRoot>
  );
}

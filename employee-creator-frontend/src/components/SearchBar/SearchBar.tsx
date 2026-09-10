import classes from "./SearchBar.module.scss";

interface SearchBarProps {
  placeholder: string;
  value: string;
  onChange: (string: string) => void;
}

export default function SearchBar({
  placeholder,
  value,
  onChange,
}: SearchBarProps) {
  return (
    <div className={classes.container}>
      <input
        className={classes.searchbar}
        type="text"
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
    </div>
  );
}

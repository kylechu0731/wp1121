import { Input } from "./ui/input";

export default function SearchBar() {
  return (
    <>
      <Input
        className="w-full"
        placeholder="Search for the event you want to join..."
      />
    </>
  );
}
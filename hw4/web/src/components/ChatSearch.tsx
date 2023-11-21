export default function ChatSearch({
  search,
  setSearch
}: {
  search: string,
  setSearch: (e: string) => void;
}) {

  return (
    <form className="bg-black">
      <input
        type="text"
        placeholder="Search User..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="w-full bg-black text-md flex-1 border-2 border-white px-2 outline-none"
      />
    </form>
  );
}
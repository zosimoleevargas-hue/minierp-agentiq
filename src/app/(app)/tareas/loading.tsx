export default function TareasLoading() {
  return (
    <div className="space-y-4 animate-pulse">
      <div className="h-8 w-48 rounded bg-muted" />
      <div className="h-4 w-72 rounded bg-muted" />
      <div className="flex gap-3">
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            className="flex-1 min-h-[300px] rounded-lg bg-muted p-3"
          />
        ))}
      </div>
    </div>
  );
}

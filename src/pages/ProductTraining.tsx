export function ProductTraining() {
  return (
    <div className="h-full w-full flex flex-col overflow-hidden">
      <iframe
        src="/vguard/index.html"
        className="w-full h-full border-none"
        title="V-Guard Fan Assistant"
        allow="microphone; camera; fullscreen; autoplay"
      />
    </div>
  );
}

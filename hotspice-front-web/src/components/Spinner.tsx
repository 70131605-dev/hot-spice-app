export function Spinner({ size = 32 }: { size?: number }) {
  return (
    <div
      className="animate-spin-slow rounded-full border-4 border-brand-tint border-t-brand"
      style={{ width: size, height: size }}
    />
  );
}

export function FullPageSpinner() {
  return (
    <div className="flex min-h-[50vh] items-center justify-center">
      <Spinner size={40} />
    </div>
  );
}

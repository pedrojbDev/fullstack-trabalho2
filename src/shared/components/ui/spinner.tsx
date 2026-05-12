import { cn } from "@/shared/lib/utils/cn";

export function Spinner({
  size = 16,
  className,
}: {
  size?: number;
  className?: string;
}) {
  return (
    <span
      aria-hidden="true"
      role="status"
      className={cn(
        "inline-block animate-spin rounded-full border-2 border-current border-t-transparent",
        className,
      )}
      style={{ width: size, height: size }}
    />
  );
}

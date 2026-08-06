import defaultLogo from "@/assets/x-copper-logo.png";
import { useAppSettings } from "@/lib/appSettings";

export function XLogo({ className = "h-10 w-10", onClick }: { className?: string; onClick?: () => void }) {
  const { logo_url, ai_name } = useAppSettings();
  return (
    <img
      src={logo_url || defaultLogo}
      alt={ai_name}
      className={className}
      onClick={onClick}
      draggable={false}
    />
  );
}

import logo from "@/assets/x-copper-logo.png";

export function XLogo({ className = "h-10 w-10", onClick }: { className?: string; onClick?: () => void }) {
  return <img src={logo} alt="X COPPER" className={className} onClick={onClick} draggable={false} />;
}
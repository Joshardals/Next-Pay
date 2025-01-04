import { IconType } from "react-icons";

interface ActionCardProps {
  title: string;
  badge: string;
  value: string;
  subValue: string;
  buttonText: string;
  buttonIcon: IconType;
  variant?: "primary" | "secondary";
}

export function ActionCard({
  title,
  badge,
  value,
  subValue,
  buttonText,
  buttonIcon: Icon,
  variant = "primary",
}: ActionCardProps) {
  return (
    <div className="bg-darkCharcoal rounded-2xl p-4 hover:shadow-lg transition-all duration-300">
      <div className="flex justify-between items-start mb-4">
        <h3 className="text-snow font-medium">{title}</h3>
        <span className="text-xs text-lightGray bg-charcoal sm:bg-darkCharcoal px-2 py-1 rounded-lg">
          {badge}
        </span>
      </div>
      <p
        className={`text-xl font-semibold ${
          variant === "primary" ? "text-snow" : "text-goldenrod"
        } mb-1`}
      >
        {value}
      </p>
      <p className="text-sm text-lightGray mb-6">{subValue}</p>
      <button
        className={`w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl ${
          variant === "primary"
            ? "bg-gradient-to-r from-goldenrod to-goldenrod/80 hover:from-goldenrod/90 hover:to-goldenrod/70 text-charcoal"
            : "bg-charcoal max-lg:hover:bg-charcoal/50 hover:bg-charcoal/70 text-snow"
        } text-sm font-medium transition-all duration-200 hover:transform hover:translate-y-[-2px]`}
      >
        <Icon size={18} />
        {buttonText}
      </button>
    </div>
  );
}

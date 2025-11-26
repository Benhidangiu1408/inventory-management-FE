import Link from "next/link";
import Button from "../../default_components/ui/button/Button";

interface ButtonItemProps {
  size: "sm" | "md";
  variant?:
    | "primary"
    | "outline"
    | "warning"
    | "danger"
    | "success"
    | "warning_outline"
    | "danger_outline"
    | "success_outline"
    | "exempt_outline";
  startIcon?: React.ReactNode;
  endIcon?: React.ReactNode;
  onClick?: () => void;
  disabled?: boolean;
  className?: string;
  type: "button" | "link";
  title: string;
  href?: string;
}

interface CustomFilterProps {
  children: React.ReactNode;
  listButton?: ButtonItemProps[];
}

export default function CustomFilter({
  children,
  listButton,
}: CustomFilterProps) {
  return (
    <>
      <div className="flex items-center justify-between gap-20 p-6">
        <div className="flex flex-1 gap-3">{children}</div>
        {listButton &&
          listButton.map((button, index) => {
            if (button.type === "button") {
              return (
                <Button key={index} {...button}>
                  {button.title}
                </Button>
              );
            } else {
              return (
                <Link key={index} href={button.href ?? ""}>
                  <Button {...button}>{button.title}</Button>
                </Link>
              );
            }
          })}
      </div>
    </>
  );
}

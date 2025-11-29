import Link from "next/link";
import { Link as LinkIcon } from "lucide-react";

interface SearchResultItemProps {
  path: string;
  parentName?: string;
  name: string;
  onClick: () => void;
}

const capitalizeWords = (str: string) =>
  str.replace(/\b\w/g, (c: string) => c.toUpperCase());

export default function SearchResultItem({
  path,
  parentName,
  name,
  onClick,
}: SearchResultItemProps) {
  return (
    <Link
      href={path}
      onClick={onClick}
      className="hover:text-brand-500 flex cursor-pointer items-center gap-2 p-3"
    >
      <LinkIcon />
      <div>
        {parentName && (
          <div className="text-xs text-gray-500">
            {capitalizeWords(parentName)}
          </div>
        )}
        <div>{capitalizeWords(name)}</div>
      </div>
    </Link>
  );
}

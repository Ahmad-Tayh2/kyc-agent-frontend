import NomadRemLogo from "@/assets/black-logo.svg?react";
import type { ReactElement } from "react";

export default function BrandingSection(props: BrandingSectionProps) {
  const { description } = props;
  return (
    <div className="bg-gray-50 border border-gray-200 p-4 flex items-center justify-between rounded-md mb-2">
      <div className="flex justify-center mb-2">
        <NomadRemLogo className="h-6 w-fit" />
      </div>
      <p className="text-sm text-gray-500">{description}</p>
    </div>
  );
}
interface BrandingSectionProps {
  description?: string | ReactElement;
}

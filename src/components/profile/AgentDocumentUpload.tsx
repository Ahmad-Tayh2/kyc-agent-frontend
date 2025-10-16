import { Label } from "@/components/ui/label";
import UploadIcon from "@/assets/icons/upload-icon.svg?react";
import FileIcon from "@/assets/icons/file-icon.svg?react";
import { cn } from "@/lib/utils";
import { useTranslation } from "react-i18next";
import { useEffect } from "react";
export default function AgentDocumentUpload(props: any) {
  const { editMode, setDocsData, docsData } = props;
  const [t] = useTranslation("global");
  useEffect(() => {
    console.log(" docsData ==== ", docsData);
  }, [docsData]);
  return (
    <div className="p-5">
      <div className="md:col-span-2 flex flex-col gap-2">
        <Label>
          {t("modules.register.fields.identity.label")}
          <span className="text-red-500">*</span>
        </Label>
        <div className="border-2 border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center">
          <input
            type="file"
            multiple
            accept=".png,.jpg,.jpeg,.pdf"
            onChange={(e: any) => {
              setDocsData((prev: any) => ({
                ...prev,
                files: [...e.target.files]?.slice(0, 2),
              }));
            }}
            className="hidden"
            id="id-docs"
            disabled={!editMode}
          />
          <label
            htmlFor="id-docs"
            className={cn(
              "p-6 cursor-pointer text-center flex flex-col items-center justify-center h-full w-full",
              !editMode && "opacity-50 cursor-not-allowed"
            )}
          >
            <UploadIcon width={90} />
            <p className="text-teal-600 font-medium">Upload document</p>
            <p className="text-sm text-gray-500">
              {/* Drag or click here to upload your document */}
              Click here to upload your document
            </p>
          </label>
        </div>

        {/* {errors.identityFiles && (
          <span className="text-destructive text-xs">
            {errors.identityFiles}
          </span>
        )} */}
        {[...docsData?.files]?.map((file: File, idx: number) => (
          <div
            key={idx}
            className="flex items-center gap-2 border border-[#656565] rounded-md p-2 mt-2"
          >
            <span>
              {/* You can use an icon here */}
              <FileIcon color="var(--primary)" />
            </span>
            <div>
              <div className="font-medium">{file.name}</div>
              <div className="text-xs text-[#656565]">
                {(file.size / 1024).toFixed(0)}{" "}
                {/* {t("modules.register.fields.identity.fileSize")} */}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

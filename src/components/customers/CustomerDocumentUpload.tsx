import { useEffect } from "react";
// import { useTranslation } from "react-i18next";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import DatePicker from "@/components/shared/DatePicker";
import FileIcon from "@/assets/icons/file-icon.svg?react";
import UploadIcon from "@/assets/icons/upload-icon.svg?react";
import type {
  CustomerIdentityFileData,
  CustomerIncomeFileData,
} from "@/services/customers";
import SearchableSelect from "../ui/searchable-select";
import { cn } from "@/lib/utils";
import ErrorField from "../shared/ErrorField";

export default function CustomerDocumentUpload(props: any) {
  const {
    identityData,
    setIdentityData,
    incomeData,
    setIncomeData,
    editMode,
    identityErrors,
  } = props;

  return (
    <div className="space-y-6 p-5">
      <div className="pb-10 border-b-1 border-gray-200">
        <RenderCustomerIdentity
          identityData={identityData}
          setIdentityData={setIdentityData}
          editMode={editMode}
          identityErrors={identityErrors}
        />
      </div>
      <RenderProofOfIncome
        editMode={editMode}
        incomeData={incomeData}
        setIncomeData={setIncomeData}
      />
    </div>
  );
}

const RenderCustomerIdentity = (props: any) => {
  const { identityData, setIdentityData, editMode, identityErrors } = props;

  const documentTypesOptions = [
    { label: "Passport", value: "passport" },
    { label: "National ID", value: "id_card" },
    { label: "Residence Permit ", value: "residence_permit" },
    { label: "Driver's License", value: "driving_license" },
  ];

  const handleFileUpload = (
    field: string,
    files: FileList | null,
    isMultiple = false
  ) => {
    if (!files || files.length === 0) return;

    if (isMultiple) {
    } else {
      const file = files[0];
      if (field === "front_image") {
        handleIdentityChange("front_image", file);
      } else if (field === "back_image") {
        handleIdentityChange("back_image", file);
      }
    }
  };
  const handleIdentityChange = (
    field: keyof CustomerIdentityFileData,
    value: any
  ) => {
    setIdentityData((prev: any) => ({
      ...prev,
      [field]: value,
    }));
  };
  useEffect(() => {
    console.log(" identityData = = ", identityData);
  }, [identityData]);
  return (
    <div className="flex flex-col gap-5">
      <h3 className="text-lg font-semibold">Identity files</h3>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div>
          <SearchableSelect
            label="Document Type"
            options={documentTypesOptions}
            value={identityData?.document_type || ""}
            onChange={(value: string | number) =>
              handleIdentityChange("document_type", String(value))
            }
            disabled={!editMode}
            required
            error={identityErrors?.document_type}
          />
        </div>

        <div className="flex flex-col gap-2">
          <Label htmlFor="document_number">
            Document Number
            <span className="text-red-500">*</span>
          </Label>
          <Input
            id="document_number"
            name="document_number"
            placeholder="Enter document number"
            value={identityData?.document_number || ""}
            onChange={(e) =>
              handleIdentityChange("document_number", e.target.value)
            }
            disabled={!editMode}
          />
          {identityErrors?.document_number && (
            <ErrorField errors={[identityErrors?.document_number[0]]} />
          )}
        </div>

        <div className="flex flex-col gap-2">
          <Label htmlFor="issuing_date">
            Document Issue Date
            <span className="text-red-500">*</span>
          </Label>
          <DatePicker
            value={identityData?.issuing_date || ""}
            onChange={(date: string) =>
              handleIdentityChange("issuing_date", date)
            }
            disabled={!editMode}
          />
          {identityErrors?.issuing_date && (
            <ErrorField errors={[identityErrors?.issuing_date[0]]} />
          )}
        </div>
        <div className="flex flex-col gap-2">
          <Label htmlFor="documentExpiryDate">
            Document Expiry Date
            <span className="text-red-500">*</span>
          </Label>
          <DatePicker
            value={identityData?.expiry_date || ""}
            onChange={(date: string) =>
              handleIdentityChange("expiry_date", date)
            }
            disabled={!editMode}
            // endMonth={documentExpiryEndMonth}
          />
          {identityErrors?.expiry_date && (
            <ErrorField errors={[identityErrors?.expiry_date[0]]} />
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="flex flex-col gap-2">
          <Label>
            Upload the front face of your ID
            <span className="text-red-500">*</span>
          </Label>
          <div className="border-2 border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center">
            <input
              type="file"
              accept="image/*,.pdf"
              onChange={(e) => handleFileUpload("front_image", e.target.files)}
              className="hidden"
              id="front_image"
              disabled={!editMode}
            />
            <label
              htmlFor="front_image"
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
          {/* {identityData?.front_image && (
            <p className="text-sm text-green-600">
              ✓ {identityData?.front_image?.name}
            </p>
          )} */}
          {identityData?.front_image && (
            <div className="flex items-center gap-2 border border-[#656565] rounded-md p-2 mt-2">
              <span>
                {/* You can use an icon here */}
                <FileIcon color="var(--primary)" />
              </span>
              <div>
                <div className="font-medium">
                  {identityData?.front_image?.name}
                </div>
                <div className="text-xs text-[#656565]">
                  {(identityData?.front_image?.size / 1024).toFixed(0)}{" "}
                </div>
              </div>
            </div>
          )}
          {identityErrors?.front_image && (
            <ErrorField errors={[identityErrors?.front_image[0]]} />
          )}
        </div>

        <div className="flex flex-col gap-2">
          <Label>Upload the back face of your ID</Label>
          <div className="border-2 border-dashed border-gray-300 rounded-lg text-center flex flex-col items-center justify-center">
            <input
              type="file"
              accept="image/*,.pdf"
              onChange={(e) => handleFileUpload("back_image", e.target.files)}
              className="hidden"
              id="back_image"
              disabled={!editMode}
            />
            <label
              htmlFor="back_image"
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
          {/* {identityData?.back_image && (
            <p className="text-sm text-green-600">
              ✓ {identityData?.back_image?.name}
            </p>
          )} */}
          {identityData?.back_image && (
            <div className="flex items-center gap-2 border border-[#656565] rounded-md p-2 mt-2">
              <span>
                {/* You can use an icon here */}
                <FileIcon color="var(--primary)" />
              </span>
              <div>
                <div className="font-medium">
                  {identityData?.back_image?.name}
                </div>
                <div className="text-xs text-[#656565]">
                  {(identityData?.back_image?.size / 1024).toFixed(0)}{" "}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const RenderProofOfIncome = (props: any) => {
  const { editMode, incomeData, setIncomeData } = props;
  const handleUploadIncomeFile = (files: FileList | null, type: string) => {
    if (!files || files?.length === 0 || !type) return;
    setIncomeData((prev: CustomerIncomeFileData[]) => {
      let exist = false;
      const updatedData: any[] = [];
      for (let file of prev) {
        if (file?.document_type === type) {
          updatedData?.push({
            document: files,
            document_type: type,
          });
          exist = true;
        } else {
          updatedData?.push({ ...file });
        }
      }
      if (!exist) {
        return [
          ...prev,
          {
            document: files,
            document_type: type,
          },
        ];
      }
      return updatedData;
    });
  };
  useEffect(() => {
    console.log(" icoincomeDataincomeData = = = ", incomeData);
  }, [incomeData]);
  return (
    <div className="flex flex-col gap-5">
      <h3 className="text-lg font-semibold">Proof of Income</h3>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="flex flex-col gap-2">
          <Label>Upload Recent Three Months Bank Statements</Label>
          <div className="border-2 border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center">
            <input
              type="file"
              accept=".pdf,.doc,.docx,image/*"
              multiple
              onChange={(e) =>
                handleUploadIncomeFile(
                  e.target.files,
                  "recent_three_months_income"
                )
              }
              className="hidden"
              id="bankStatements"
              disabled={!editMode}
            />
            <label
              htmlFor="bankStatements"
              className={cn(
                "p-6 cursor-pointer text-center flex flex-col items-center justify-center h-full w-full",
                !editMode && "opacity-50 cursor-not-allowed"
              )}
            >
              <UploadIcon width={90} />
              <p className="text-teal-600 font-medium">Upload Bank statement</p>
              <p className="text-sm text-gray-500">
                {/* Drag or click here to upload your document */}
                Click here to upload your document
              </p>
            </label>
          </div>

          {incomeData?.[0]?.document?.length && (
            <div className="flex items-center gap-2 border border-[#656565] rounded-md p-2 mt-2">
              <span>
                {/* You can use an icon here */}
                <FileIcon color="var(--primary)" />
              </span>
              <div>
                <div className="font-medium">
                  {incomeData[0]?.document?.[0]?.name}
                </div>
                <div className="text-xs text-[#656565]">
                  {(incomeData[0]?.document?.[0]?.size / 1024).toFixed(0)}{" "}
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="flex flex-col gap-2">
          <Label>Upload Extra Documents of other income with description</Label>
          {/* <AlertCircle className="h-4 w-4 text-gray-400" /> */}
          <div className="border-2 border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center">
            <input
              type="file"
              accept=".pdf,.doc,.docx,image/*"
              multiple
              onChange={(e) =>
                handleUploadIncomeFile(e.target.files, "additional_proof")
              }
              className="hidden"
              id="extraDocuments"
              disabled={!editMode}
            />
            <label
              htmlFor="extraDocuments"
              className={cn(
                "p-6 cursor-pointer text-center flex flex-col items-center justify-center h-full w-full",
                !editMode && "opacity-50 cursor-not-allowed"
              )}
            >
              <UploadIcon width={90} />
              <p className="text-teal-600 font-medium">Upload extra document</p>
              <p className="text-sm text-gray-500">
                {/* Drag or click here to upload your document */}
                Click here to upload your document
              </p>
            </label>
          </div>

          {incomeData?.[1]?.document?.length && (
            <div className="flex items-center gap-2 border border-[#656565] rounded-md p-2 mt-2">
              <span>
                {/* You can use an icon here */}
                <FileIcon color="var(--primary)" />
              </span>
              <div>
                <div className="font-medium">
                  {incomeData[1]?.document?.[0]?.name}
                </div>

                <div className="text-xs text-[#656565]">
                  {(incomeData[1]?.document?.[0]?.size / 1024).toFixed(0)}{" "}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

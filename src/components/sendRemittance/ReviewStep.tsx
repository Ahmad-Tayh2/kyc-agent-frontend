import React, { useMemo } from "react";
import SearchableSelect from "@/components/ui/searchable-select";
// import { Textarea } from "@/components/ui/textarea";
// import { Input } from "@/components/ui/input";
// import { Label } from "@/components/ui/label";
import SummaryCard, { type SummaryData } from "./SummaryCard";
import EditSectionCard from "../shared/EditSectionCard";
import { ROUTES } from "@/constants/routes";
import { useNavigate } from "react-router-dom";
import { useSendRemittanceStore } from "@/store/sendRemittanceStore";
import {
  useGetRemittancePurposes,
  useGetSourceIncomes,
} from "@/hooks/data/useTransferPurposeAndSource";

const ReviewStep: React.FC = () => {
  // const [extraDetails, setExtraDetails] = useState("");
  // const [transactionReference, setTransactionReference] = useState("");

  const navigate = useNavigate();
  const stepOne = useSendRemittanceStore((state) => state.data.stepOne);
  const stepTwo = useSendRemittanceStore((state) => state.data.stepTwo);

  const remittancePurpose = useSendRemittanceStore(
    (state) => state.data.stepThree?.remittancePurpose
  );
  const sourceOfIncome = useSendRemittanceStore(
    (state) => state.data.stepThree?.sourceOfIncome
  );
  const setRemittancePurpose = useSendRemittanceStore(
    (state) => state.setRemittancePurpose
  );
  const setSourceOfIncome = useSendRemittanceStore(
    (state) => state.setSourceOfIncome
  );

  const deliveryData = {
    method: stepOne?.remittanceMethod?.name,
    pickupLocation: "323, Metro line 3, New Delhi (fake data)",
  };
  const customer = { ...stepOne?.customer };
  const recipient = { ...stepOne?.recipient };

  const summaryData: SummaryData = {
    sendingCustomer: customer?.fullName,
    sendingCountryIso: stepOne?.sendCountry?.iso3,
    recipient: stepOne?.recipient?.fullName,
    recipientCountryIso: stepOne?.receiveCountry?.iso3,
    remittanceMethod: stepOne?.remittanceMethod?.name,
    sendingCountry: stepOne?.sendCountry?.name,
    receivingCountry: stepOne?.receiveCountry?.name,
    sendingAmount: stepTwo?.sendAmount,
    // exchangeRate: "",
    // feesAndCharges: "",
    // commission: "",
    // extraFees: "",
    // recipientGets: "",
    // totalPayableAmount: "",
  };

  const { data: reasonForTransferData } = useGetRemittancePurposes();
  const { data: sourceIncomesData } = useGetSourceIncomes();

  const reasonForTransferOptions = useMemo(() => {
    if (reasonForTransferData?.length) {
      return reasonForTransferData?.map((item: any) => ({
        label: item?.formal_name,
        value: item?.id,
      }));
    }
    return [];
  }, [reasonForTransferData]);
  const sourceIncomesOptions = useMemo(() => {
    if (sourceIncomesData?.length) {
      return sourceIncomesData?.map((item: any) => ({
        label: item?.formal_name,
        value: item?.id,
      }));
    }
    return [];
  }, [sourceIncomesData]);

  const handleChangeRemittancePurpose = (id: string | number) => {
    const selectedPurpose =
      reasonForTransferOptions?.find(
        (item: { label: string; value: string | number }) => item?.value === id
      ) ?? null;
    setRemittancePurpose({
      formal_name: selectedPurpose?.label,
      id: selectedPurpose?.value,
    });
  };

  const handleChangeSourceIncomes = (id: string | number) => {
    const selectedPurpose =
      sourceIncomesOptions?.find(
        (item: { label: string; value: string | number }) => item?.value === id
      ) ?? null;
    setSourceOfIncome({
      formal_name: selectedPurpose?.label,
      id: selectedPurpose?.value,
    });
  };

  const handleEditRecipient = () => {
    stepOne?.recipient?.id &&
      navigate(ROUTES.RECIPIENTS.DETAILS(stepOne?.recipient?.id));
  };

  return (
    <div className="p-6 space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content - Left Side */}
        <div className="lg:col-span-2 space-y-6">
          {/* Recipient Details and Delivery Options Row */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Recipient Details Card */}
            <EditSectionCard
              sectionTitle="Recipient Details"
              editMode={false}
              setEditMode={handleEditRecipient}
            >
              <div className="p-6">
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600 text-sm">Name</span>
                    <span className="font-medium text-sm">
                      {recipient?.fullName}
                    </span>
                  </div>

                  <hr className="my-3" />

                  <div className="flex justify-between">
                    <span className="text-gray-600 text-sm">Phone</span>
                    <span className="font-medium text-sm">
                      {recipient?.phoneNumber}
                    </span>
                  </div>

                  <hr className="my-3" />

                  <div className="flex justify-between">
                    <span className="text-gray-600 text-sm">Email</span>
                    <span className="font-medium text-sm">
                      {recipient?.email}
                    </span>
                  </div>

                  <hr className="my-3" />

                  <div className="flex justify-between">
                    <span className="text-gray-600 text-sm">Address</span>
                    <span className="font-medium text-sm">
                      {recipient?.address?.city}
                    </span>
                  </div>

                  <hr className="my-3" />

                  <div className="flex justify-between">
                    <span className="text-gray-600 text-sm">Country</span>
                    <span className="font-medium text-sm">
                      {recipient?.address?.country}
                    </span>
                  </div>
                </div>
              </div>
            </EditSectionCard>
            {/* Delivery Options Card */}

            <EditSectionCard sectionTitle="Delivery Options" editMode={false}>
              <div className="p-6">
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600 text-sm">Method</span>
                    <span className="font-medium text-sm">
                      {deliveryData.method}
                    </span>
                  </div>

                  <hr className="my-3" />

                  <div className="flex justify-between">
                    <span className="text-gray-600 text-sm">
                      Pickup Location
                    </span>
                    <span className="font-medium text-sm">
                      {deliveryData.pickupLocation}
                    </span>
                  </div>
                </div>
              </div>
            </EditSectionCard>
          </div>

          {/* Source of Fund and Reason for Transfer Row */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Source of Fund */}
            <div>
              <SearchableSelect
                label="Source of fund"
                placeholder="Selected fund"
                options={sourceIncomesOptions}
                value={sourceOfIncome?.id ?? ""}
                onChange={handleChangeSourceIncomes}
              />
            </div>

            {/* Reason for Transfer */}
            <div>
              <SearchableSelect
                label="Reason for transfer"
                placeholder="Selected reason"
                options={reasonForTransferOptions}
                value={remittancePurpose?.id ?? ""}
                onChange={handleChangeRemittancePurpose}
              />
            </div>
          </div>

          {/* Extra Details */}
          {/* <div className="space-y-4">
            <Label className="text-sm font-medium">Extra details</Label>
            <Textarea
              placeholder="Write here"
              value={extraDetails}
              onChange={(e) => setExtraDetails(e.target.value)}
              className="min-h-[120px] resize-none"
            />
          </div> */}

          {/* Transaction Reference */}
          {/* <div className="space-y-4">
            <Input
              placeholder="Enter description or reference for this transaction (optional)"
              value={transactionReference}
              onChange={(e) => setTransactionReference(e.target.value)}
              className="w-full"
            />
          </div> */}
        </div>

        {/* Summary Card - Right Side */}
        <div className="lg:col-span-1">
          <SummaryCard data={summaryData} />
        </div>
      </div>
    </div>
  );
};

export default ReviewStep;

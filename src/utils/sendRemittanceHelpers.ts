import type { Currency } from "@/types/currency";
import type { CustomerType } from "@/types/customers";
import type { CustomerRecipient } from "@/types/customers/recipients";
import type { RemittanceMethod } from "@/types/remittanceMethod/RemittanceMethod";
import type {
  SendRemittanceCurrency,
  SendRemittanceCustomer,
  SendRemittanceData,
  SendRemittanceMethod,
  SendRemittancePurpose,
  SendRemittanceRecipient,
  SendRemittanceSourceIncome,
  SendRemittanceStepFour,
  SendRemittanceStepOne,
  SendRemittanceStepThree,
  SendRemittanceStepTwo,
} from "@/types/sendRemittance";
import type { Currency as SimpleCountryAllowedCurrency } from "@/types/shared/countryAllowedCurrency";
import type {
  RemittancePurpose,
  SourceIncome,
} from "@/types/shared/transferPurposeAndSource";

// Mapper functions to convert API responses to store format

export const mapCustomerToStoreFormat = (
  customer: CustomerType
): SendRemittanceCustomer => ({
  id: parseInt(customer.id),
  firstName: customer.first_name,
  lastName: customer.last_name,
  fullName: customer.full_name,
  countryId: 0, // Will need to be extracted from customer data structure
  countryIso3: "", // Will need to be extracted from customer data structure
  countryName: customer.country.name,
});

export const mapCustomerRecipientToStoreFormat = (
  recipient: CustomerRecipient
): SendRemittanceRecipient => ({
  id: recipient.id,
  firstName: recipient.first_name,
  lastName: recipient.last_name,
  fullName: `${recipient.first_name} ${recipient.last_name}`,
  countryId:
    typeof recipient.address.country.id === "string"
      ? parseInt(recipient.address.country.id)
      : recipient.address.country.id,
  countryIso3: recipient.address.country.iso3 || "",
  countryName: recipient.address.country.name,
  countryPhoneCode: recipient.country_phone_code,
  phoneNumber: recipient.phone_number,
  email: recipient.email,
  address: {
    streetName: recipient.address.street || "",
    houseNumber: "", // Not available in the Address type
    postalCode: recipient.address.postal_code || "",
    extraDetails: "", // Not available in the Address type
    city: recipient.address.city?.name || "",
    state: recipient.address.state?.name || "",
    country: recipient.address.country.name,
  },
});

export const mapCurrencyToStoreFormat = (
  currency: Currency
): SendRemittanceCurrency => ({
  id: currency.id,
  code: currency.code,
  name: currency.name,
});

export const mapSimpleCurrencyToStoreFormat = (
  currency: SimpleCountryAllowedCurrency
): SendRemittanceCurrency => ({
  id: currency.id,
  code: currency.code,
  name: currency.name,
});

export const mapRemittanceMethodToStoreFormat = (
  method: RemittanceMethod
): SendRemittanceMethod => ({
  id: method.id,
  name: method.name,
  description: method.description,
});

export const mapSourceIncomeToStoreFormat = (
  sourceIncome: SourceIncome
): SendRemittanceSourceIncome => ({
  id: sourceIncome.id,
  formal_name: sourceIncome.formal_name,
});

export const mapRemittancePurposeToStoreFormat = (
  purpose: RemittancePurpose
): SendRemittancePurpose => ({
  id: purpose.id,
  formal_name: purpose.formal_name,
});

// Validation functions
export const validateStepOneData = (
  stepOne: SendRemittanceStepOne
): boolean => {
  return !!(
    stepOne.customer &&
    stepOne.recipient &&
    stepOne.sendCountry &&
    stepOne.receiveCountry &&
    stepOne.remittanceMethod
  );
};

export const validateStepTwoData = (
  stepTwo: SendRemittanceStepTwo
): boolean => {
  return !!(
    stepTwo.sendCurrency &&
    stepTwo.sendAmount > 0 &&
    stepTwo.receiveCurrency &&
    stepTwo.receiveAmount > 0 &&
    stepTwo.exchangeDetails
  );
};

export const validateStepThreeData = (
  stepThree: SendRemittanceStepThree
): boolean => {
  return !!(
    (stepThree.sourceOfIncome && stepThree.remittancePurpose)
    // extraDetails and descriptionOrReference are optional
  );
};

export const validateStepFourData = (
  stepFour: SendRemittanceStepFour
): boolean => {
  return !!stepFour.paymentMethod;
  // paymentLink is optional, only required for certain payment methods
};

export const validateAllSteps = (data: SendRemittanceData): boolean => {
  return (
    validateStepOneData(data.stepOne) &&
    validateStepTwoData(data.stepTwo) &&
    validateStepThreeData(data.stepThree) &&
    validateStepFourData(data.stepFour)
  );
};

// Helper function to create form data for submission
// export const createSubmissionData = (data: SendRemittanceData) => {
//   const { stepOne, stepTwo, stepThree, stepFour } = data;

//   return {
//     // Customer and recipient data
//     customerId: stepOne.customer?.id,
//     recipientId: stepOne.recipient?.id,
//     sendCountryId: stepOne.sendCountry?.id,
//     receiveCountryId: stepOne.receiveCountry?.id,
//     remittanceMethodId: stepOne.remittanceMethod?.id,

//     // Currency and amount data
//     sendCurrencyId: stepTwo.sendCurrency?.id,
//     sendAmount: stepTwo.sendAmount,
//     receiveCurrencyId: stepTwo.receiveCurrency?.id,
//     receiveAmount: stepTwo.receiveAmount,
//     exchangeRate: stepTwo.exchangeDetails?.rate,
//     charges: stepTwo.exchangeDetails?.charges,

//     // Additional details
//     sourceOfIncomeId: stepThree.sourceOfIncome?.id,
//     remittancePurposeId: stepThree.remittancePurpose?.id,
//     extraDetails: stepThree.extraDetails,
//     description: stepThree.descriptionOrReference,

//     // Payment details
//     paymentMethod: stepFour.paymentMethod,
//     paymentLink: stepFour.paymentLink,
//   };
// };

// Helper function to generate summary data for display
// export const generateSummaryData = (data: SendRemittanceData) => {
//   const { stepOne, stepTwo } = data;

//   return {
//     sendingCustomer: stepOne.customer?.fullName || "N/A",
//     sendingCustomerCountry: stepOne.customer?.countryName || "N/A",
//     recipient: stepOne.recipient?.fullName || "N/A",
//     recipientCountry: stepOne.recipient?.countryName || "N/A",
//     remittanceMethod: stepOne.remittanceMethod?.name || "N/A",
//     sendingAmount: stepTwo.sendAmount || 0,
//     sendingCurrency: stepTwo.sendCurrency?.code || "N/A",
//     receivingAmount: stepTwo.receiveAmount || 0,
//     receivingCurrency: stepTwo.receiveCurrency?.code || "N/A",
//     exchangeRate: stepTwo.exchangeDetails?.rate || 0,
//     feesAndCharges: stepTwo.exchangeDetails?.charges || 0,
//   };
// };

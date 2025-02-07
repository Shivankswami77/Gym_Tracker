import dayjs from "dayjs";
import CryptoJS from "crypto-js";

export const DATE_FORMAT = "DD/MM/YYYY";

export const formatPhoneNumber = (
  phoneCountryCode: string,
  phoneNumber: string
): string => {
  return phoneCountryCode?.replace("+", "") + phoneNumber;
};
export const filterOption = (input: any, option: any) => {
  const searchText = input.toLowerCase();
  return option.label.toLowerCase().includes(searchText);
};
export const findInvalidReasonsBulkUpload = (objects: any) => {
  objects.forEach((obj: any) => {
    if (obj.isInvalid) {
      const errorMessages = [];

      if (obj.invalidReasonContext.existingName) {
        errorMessages.push("Already Exist");
      }

      if (obj.invalidReasonContext.invalidName) {
        errorMessages.push("Wrong format");
      }

      if (obj.invalidReasonContext.invalidParent) {
        errorMessages.push("Parent doesn't exist");
      }

      if (obj.invalidReasonContext.isDuplicate) {
        errorMessages.push("Duplicate");
      }

      if (errorMessages.length > 0) {
        obj.errorMessage = errorMessages;
      }
    }
  });

  return objects;
};
export function createTagFromName(word1: string, word2: string) {
  if (word1 && !word2) {
    return word1.charAt(0).toUpperCase() + word1.charAt(1).toUpperCase();
  }
  if (!word1 || !word2) return "";
  if (!word2) return "";

  return word1.charAt(0).toUpperCase() + word2.charAt(0).toUpperCase();
}
export const maxSizeValidationMessage = (maxSize = 200) => {
  return `File size should be less than ${maxSize}KB!`;
};
export function formatUnderscoreString(str: string) {
  const convertStatusToActiveIfIsQuoted =
    str?.toLowerCase() === "quoted" ? "active" : str?.toLowerCase();
  return convertStatusToActiveIfIsQuoted
    ?.toLowerCase()
    .split("_")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}
export function removeEmptyKeysFromPayload(obj: any) {
  const newObj = { ...obj };

  Object.keys(newObj).forEach((key) => {
    const value = newObj[key];

    if (
      value === undefined ||
      value === null ||
      value === "" ||
      (Array.isArray(value) && value.length === 0) ||
      // (typeof value === "object" && Object.keys(value).length === 0) ||
      Number.isNaN(value)
    ) {
      delete newObj[key];
    }
  });

  return newObj;
}
export const getRedirectUrl = (
  redirectionPage: string,
  selectedCustomer: string | undefined
): string => {
  switch (redirectionPage) {
    case "product-list":
      return `/product/list/${selectedCustomer}`;
    case "product-bulk-add":
      return `/product/bulk-add/${selectedCustomer}`;
    case "bulk-upload":
      return `/pr/upload-set-sheet/${selectedCustomer}`;
    default:
      return `/product/list/${selectedCustomer}`;
  }
};
export const checkIfIsDefault = (status: string) => {
  return status ? "Yes" : "No";
};
export const checkIfNumberIsValid = (
  value: number | undefined | null,
  fixed: number = 2
): string => {
  if (typeof value === "number" && isFinite(value) && value !== 0) {
    return value.toFixed(fixed);
  } else {
    return "N/A";
  }
};
// export const handleSuccess = (type: string, operation: string) =>
//   notification.success({
//     message: "Success",
//     description: `${type} ${operation} successfully`,
//     duration: 1,
//   });
export function getIsoCodeByNameFromLocalStorage(name: string) {
  const encryptedCountryList = localStorage.getItem("country-storage");

  if (encryptedCountryList) {
    const countryListString = decryptData(encryptedCountryList);
    if (countryListString?.state?.countriesList?.length) {
      if (
        Array.isArray(countryListString?.state?.countriesList) &&
        countryListString?.state?.countriesList.length > 0
      ) {
        const country = countryListString?.state?.countriesList.find(
          (item: any) => item.name.toLowerCase() === name?.toLowerCase()
        );

        return country ? country.isoCode3 : null;
      }
    } else {
      console.error("Decryption failed or returned empty string.");
      return null;
    }
  }

  return null;
}

export const convertCurrency = (
  total: number,
  currency: string,
  toCurrency: string,
  currenciesConvertedList: any
) => {
  const conversionRate = currenciesConvertedList.find(
    (rate: any) => rate.from === currency && rate.to === toCurrency
  );
  if (conversionRate) {
    return total * parseFloat(conversionRate.conversionValue);
  }
  return total;
};

export const removePropertiesByValues = (
  obj: any,
  valuesToRemove: Array<string | null | undefined>
) => {
  Object.keys(obj).forEach((key) => {
    if (typeof obj[key] === "object" && obj[key] !== null) {
      removePropertiesByValues(obj[key], valuesToRemove);
    } else {
      if (valuesToRemove.includes(obj[key])) {
        delete obj[key];
      }
    }
  });
};
export function addMMToEmptyItems(items: any) {
  let timestamp = Math.floor(Date.now() / 1000);

  const generateRandomString = () => {
    const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    return (
      letters.charAt(Math.floor(Math.random() * letters.length)) +
      letters.charAt(Math.floor(Math.random() * letters.length))
    );
  };

  items.forEach((item: any) => {
    if (item?.mm === "") {
      item.mm = `TMP${generateRandomString()}${timestamp}`;
      timestamp += 1;
    }
  });

  return items;
}

export const isRoleAllowed = (role: any, allowedRoles: string[]) =>
  allowedRoles.includes(role);

export const isFilterAllowedBasedOnListType = (
  list: any,
  allowedLists: string[]
) => allowedLists.includes(list);

export const stripHtml = (html: string): string => {
  return html.replace(/<\/?[^>]+(>|$)/g, "").trim();
};

export const sortFollowUps = (arr: any) =>
  arr?.sort((a: any, b: any) =>
    dayjs(a.createdAt).isBefore(dayjs(b.createdAt)) ? -1 : 1
  );
const ENCRYPTION_KEY = "your-encryption-key";

export const encryptData = (data: any) => {
  const stringData = JSON.stringify(data);
  return CryptoJS.AES.encrypt(stringData, ENCRYPTION_KEY).toString();
};

export const decryptData = (encryptedData: string) => {
  const bytes = CryptoJS.AES.decrypt(encryptedData, ENCRYPTION_KEY);
  const decryptedString = bytes.toString(CryptoJS.enc.Utf8);
  return JSON.parse(decryptedString);
};

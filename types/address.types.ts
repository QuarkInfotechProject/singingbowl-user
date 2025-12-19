export interface Address {
    uuid?: string;
    firstName: string;
    lastName: string;
    email: string;
    mobile: string;
    backupMobile?: string;
    addressLine1: string;
    addressLine2?: string;
    postalCode: string;
    landmark?: string;
    addressType: "home" | "work" | "other";
    deliveryInstructions?: string;
    isDefault: boolean;
    label: string;
    countryId: string;
    countryCode: string;
    countryName: string;
    provinceId: string;
    provinceName: string;
    cityId: string;
    cityName: string;
    zoneId: string;
    zoneName: string;
}

export interface AddressFormData {
    firstName: string;
    lastName: string;
    email: string;
    mobile: string;
    backupMobile?: string;
    addressLine1: string;
    addressLine2?: string;
    postalCode: string;
    landmark?: string;
    addressType: "home" | "work" | "other";
    deliveryInstructions?: string;
    isDefault: boolean;
    label: string;
    countryId: string;
    countryCode: string;
    countryName: string;
    provinceId: string;
    provinceName: string;
    cityId: string;
    cityName: string;
    zoneId: string;
    zoneName: string;
}

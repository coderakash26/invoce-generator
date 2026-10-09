export type CurrencyCode = "USD" | "EUR" | "GBP" | "BDT" | "CAD" | "AUD" | "JPY" | "INR" | "SGD";

export interface Address {
  street: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
}

export interface BankDetails {
  bankName: string;
  accountHolder: string;
  accountNumber: string;
  routingNumber?: string;
  swiftCode?: string;
  paymentInstructions?: string;
}

export interface BusinessProfile {
  id: string;
  name: string;
  logoUrl?: string;
  email: string;
  phone: string;
  website?: string;
  address: Address;
  taxId?: string;
  bankDetails: BankDetails;
  defaultCurrency: CurrencyCode;
  invoicePrefix: string;
  nextNumber: number;
  defaultPaymentTerms: number; // in days, e.g. 14, 30
  defaultTaxRate: number;
  defaultNotes: string;
  defaultTerms: string;
  createdAt: string;
  updatedAt: string;
}

export interface Client {
  id: string;
  name: string;
  companyName?: string;
  email: string;
  phone?: string;
  billingAddress: Address;
  taxId?: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface InvoiceItem {
  id: string;
  name: string;
  description?: string;
  quantity: number;
  unit?: string; // e.g. hrs, pcs, units
  unitPrice: number;
  discountRate: number; // percentage (0-100)
  taxRate: number; // percentage (0-100)
}

export type PaymentMethod = "bank_transfer" | "credit_card" | "cash" | "paypal" | "stripe" | "other";

export interface Payment {
  id: string;
  invoiceId: string;
  amount: number;
  date: string; // YYYY-MM-DD
  method: PaymentMethod;
  reference?: string;
  notes?: string;
  createdAt: string;
}

export type InvoiceStatus = "draft" | "sent" | "paid" | "partially_paid" | "overdue" | "cancelled";

export type InvoiceTemplateId = "classic" | "modern" | "minimal" | "bold";

export interface InvoiceBranding {
  templateId: InvoiceTemplateId;
  accentColor: string; // hex
  fontFamily: "sans" | "serif" | "mono";
  showLogo: boolean;
  showBankDetails: boolean;
  footerText?: string;
}

export interface Invoice {
  id: string;
  invoiceNumber: string;
  title?: string;
  poNumber?: string;
  referenceNumber?: string;
  clientId?: string;
  clientSnapshot: {
    name: string;
    companyName?: string;
    email: string;
    phone?: string;
    billingAddress: Address;
    taxId?: string;
  };
  businessSnapshot: {
    name: string;
    logoUrl?: string;
    email: string;
    phone: string;
    website?: string;
    address: Address;
    taxId?: string;
    bankDetails: BankDetails;
  };
  issueDate: string; // YYYY-MM-DD
  dueDate: string; // YYYY-MM-DD
  currency: CurrencyCode;
  status: InvoiceStatus;
  items: InvoiceItem[];
  invoiceDiscountRate: number; // percentage
  invoiceDiscountAmount: number; // fixed discount amount if specified
  discountType: "percentage" | "fixed";
  shipping: number;
  additionalCharges: number;
  withholdingTaxRate: number; // percentage (0-100)
  notes: string;
  terms: string;
  payments: Payment[];
  branding: InvoiceBranding;
  createdAt: string;
  updatedAt: string;
}

export interface LineItemCalculation {
  lineSubtotal: number;
  discountAmount: number;
  taxableAmount: number;
  taxAmount: number;
  lineTotal: number;
}

export interface InvoiceTotals {
  lineItemsCalculations: LineItemCalculation[];
  subtotal: number;
  lineDiscountsTotal: number;
  invoiceDiscount: number;
  totalDiscount: number;
  taxableSubtotal: number;
  taxTotal: number;
  shipping: number;
  additionalCharges: number;
  grandTotal: number;
  withholdingTaxAmount: number;
  netPayable: number;
  amountPaid: number;
  balanceDue: number;
  effectiveStatus: InvoiceStatus;
}

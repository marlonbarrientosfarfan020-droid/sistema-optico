export type UserRole = "ADMIN" | "OPTOMETRIST" | "SALES_AGENT" | "LAB_TECHNICIAN";

export type DocumentType = "DNI" | "CE" | "PASSPORT" | "RUC" | "OTHER";

export type Gender = "MALE" | "FEMALE" | "OTHER" | "PREFER_NOT_TO_SAY";

export type ProductCategory =
  | "FRAME"
  | "OPHTHALMIC_LENS"
  | "CONTACT_LENS"
  | "ACCESSORY"
  | "SOLUTION"
  | "SERVICE";

export type OrderStatus =
  | "PENDING"
  | "IN_LAB"
  | "LAB_COMPLETED"
  | "READY_FOR_PICKUP"
  | "DELIVERED"
  | "CANCELLED";

export type FrameSource = "STORE_INVENTORY" | "CUSTOMER_OWN_FRAME";

export type SaleStatus = "DRAFT" | "PARTIAL" | "COMPLETED" | "CANCELLED" | "REFUNDED";

export type PaymentMethod =
  | "CASH"
  | "CREDIT_CARD"
  | "DEBIT_CARD"
  | "BANK_TRANSFER"
  | "YAPE_PLIN"
  | "OTHER";

export type PaymentType = "FULL_PAYMENT" | "ADVANCE_DEPOSIT" | "BALANCE_SETTLEMENT";

export type LensType =
  | "MONOFOCAL"
  | "BIFOCAL"
  | "PROGRESSIVE"
  | "OCCUPATIONAL"
  | "CONTACT_LENS"
  | "OTHER";

export type LensMaterial =
  | "ORGANIC_CR39"
  | "POLYCARBONATE"
  | "HIGH_INDEX_1_60"
  | "HIGH_INDEX_1_67"
  | "HIGH_INDEX_1_74"
  | "MINERAL_GLASS"
  | "TRIVEX"
  | "SILICONE_HYDROGEL";

export type BevelType =
  | "CLASSIC_BEVEL"
  | "GROOVED_RIMLESS"
  | "DRILLED_RIMLESS"
  | "FLAT";

export interface RefractionEye {
  sphere: number | null;
  cylinder: number | null;
  axis: number | null;
  addition: number | null;
  prism?: number | null;
  base?: string | null;
  visualAcuityFar?: string | null;
  visualAcuityNear?: string | null;
}

export interface PupillaryMeasurements {
  pupillaryDistance?: number | null;
  npdFarOD?: number | null;
  npdFarOS?: number | null;
  npdNearOD?: number | null;
  npdNearOS?: number | null;
  pupilHeightOD?: number | null;
  pupilHeightOS?: number | null;
}

export interface OpticalTreatments {
  antireflective: boolean;
  blueBlock: boolean;
  photochromic: boolean;
  polarized: boolean;
  uv400: boolean;
  hardCoat: boolean;
}

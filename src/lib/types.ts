import type { ConfirmationResult, User } from "firebase/auth"

export enum AuthProviderId {
  PHONE = "phone",
  GOOGLE = "google.com",
  APPLE = "apple.com"
}

export enum AuthenticationType {
  phone = "Phone",
  email = "Email",
  google = "Google"
}

export enum UserRights {
  user = "user",
  admin = "admin",
  eventCreator = "eventCreator"
}

export enum VehicleType {
  car = "car",
  truck = "truck",
  bike = "bike"
}

export interface AuthData {
  user: User | null,
  isLoggedIn: boolean,
}

export interface PrivacyData {
  hideModifications: boolean,
  hidePoints: boolean
}

export interface UserData {
  created: number | null,
  modified: number | null,
  userId: string | null,
  userPhoto: string | null,
  name: string | null,
  userName: string | null,
  email: string | null,
  phone: string | null,
  countryCode: string | null,
  bio: string | null,
  authenticationType: string | null,
  points: number | null,
  specialTag: string | null,
  privacy: PrivacyData | null,
  rights: string[] | null,
  cars: string[] | null,
  badges: string[] | null
}

export interface ToastData {
  type: string,
  message: string
}

export interface PhoneVerificationData {
  confirmation: ConfirmationResult,
  phoneNumber: string
}

export interface CarModificationData {
  modificationId: string | null,
  category: string | null,
  subCategory: string | null,
  part: string | null,
  brand: string | null,
  points: number | null,
  categories: string[] | null,
  coverPhoto: string | null
}

export interface CarData {
  created: number | null,
  modified: number | null,
  carId: string | null,
  userId: string | null,
  userName: string | null,
  coverPhoto: string | null,
  name: string | null,
  vehicleType: VehicleType,
  year: number | null,
  points: number | null,
  totalPoints: number | null,
  make: string | null,
  model: string | null,
  photos: string[] | null,
  modifications: CarModificationData[] | null
}

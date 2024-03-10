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

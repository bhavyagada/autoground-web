import { writable } from "svelte/store"

import { browser } from "$app/environment";
import { VehicleType, type CarData } from "../../types";

export const defaultCarModification = {
  modificationId: "",
  category: "",
  subCategory: "",
  part: "",
  brand: "",
  points: 0,
  categories: [],
  coverPhoto: ""
}

export const defaultCar = {
  created: 0,
  modified: 0,
  carId: "",
  userId: "",
  userName: "",
  coverPhoto: "",
  name: "",
  vehicleType: VehicleType.car,
  year: 0,
  points: 0,
  totalPoints: 0, 
  make: "",
  model: "",
  photos: [],
  modifications: []
}

let car: any;
if (browser) {
  const oldData: any = sessionStorage.getItem("car");
  car = JSON.parse(oldData);
}
export const carStore = writable<CarData[]>(car ? car : defaultCar);

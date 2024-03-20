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
let cars: any;
if (browser) {
  const oldCarData: any = sessionStorage.getItem("car");
  const oldCarListData: any = sessionStorage.getItem("cars");
  car = JSON.parse(oldCarData);
  cars = JSON.parse(oldCarListData);
}
export const carStore = writable<CarData>(car ? car : defaultCar);
export const allCarsStore = writable<CarData[]>(cars ? cars : [defaultCar]);

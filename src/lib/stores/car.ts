import { writable } from "svelte/store"

import { browser } from "$app/environment";
import { VehicleType, type CarData, type CarModificationData } from "../../types";

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
let othercar: any;
let mod: any;
let mods: any;
if (browser) {
  car = sessionStorage.getItem("car");
  cars = sessionStorage.getItem("cars");
  mod = sessionStorage.getItem("mod");
  mods = sessionStorage.getItem("mods");
  othercar = sessionStorage.getItem("othercar");
}
export const carStore = writable<CarData>(car ? JSON.parse(car) : defaultCar);
export const allCarsStore = writable<CarData[]>(cars ? JSON.parse(cars) : [defaultCar]);
export const modificationStore = writable<CarModificationData>(mod ? JSON.parse(mod) : defaultCarModification);
export const allModificationStore = writable<CarModificationData[][]>(mods ? JSON.parse(mods) : [defaultCarModification]);

export const otherCarStore = writable<CarData>(othercar ? JSON.parse(othercar) : defaultCar);
export const otherAllCarsStore = writable<CarData[]>([defaultCar]);

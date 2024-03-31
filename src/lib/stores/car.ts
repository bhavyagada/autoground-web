import { writable } from "svelte/store";
import { browser } from "$app/environment";
import { VehicleType, type CarData, type CarModificationData } from "$lib/types";

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

let car: CarData = defaultCar;
let cars: CarData[] = [];
let mod: CarModificationData = defaultCarModification;
let othercars: CarData[] = [];
if (browser) {
  const storedCar: string | null = localStorage.getItem("car");
  const storedCars: string | null = localStorage.getItem("cars");
  const storedMod: string | null = localStorage.getItem("mod");
  const storedOtherCars: string | null = localStorage.getItem("othercars");
  car = storedCar ? JSON.parse(storedCar) : car;
  cars = storedCars ? JSON.parse(storedCars) : cars;
  mod = storedMod ? JSON.parse(storedMod) : mod;
  othercars = storedOtherCars ? JSON.parse(storedOtherCars) : othercars;
}
export const carStore = writable<CarData>(car);
export const allCarsStore = writable<CarData[]>(cars);
export const modificationStore = writable<CarModificationData>(mod);
export const otherAllCarsStore = writable<CarData[]>(othercars);

if (browser) {
  carStore.subscribe((value) => localStorage.setItem("car", JSON.stringify(value)));
  allCarsStore.subscribe((value) => localStorage.setItem("cars", JSON.stringify(value)));
  modificationStore.subscribe((value) => localStorage.setItem("mod", JSON.stringify(value)));
  otherAllCarsStore.subscribe((value) => localStorage.setItem("othercars", JSON.stringify(value)));
}
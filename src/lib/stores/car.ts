import { writable } from "svelte/store";
import { browser } from "$app/environment";
import { VehicleType } from "$lib/types";

export const default_car_modification = {
  modificationId: "",
  category: "",
  subCategory: "",
  part: "",
  brand: "",
  points: 0,
  categories: [],
  coverPhoto: ""
}

export const default_car = {
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

export const car_store = writable(browser && JSON.parse(localStorage.getItem("car")!) || default_car);
export const all_cars_store = writable(browser && JSON.parse(localStorage.getItem("cars")!) || []);
export const modification_store = writable(browser && JSON.parse(localStorage.getItem("mod")!) || default_car_modification);
export const other_all_cars_store = writable(browser && JSON.parse(localStorage.getItem("othercars")!) || []);
if (browser) {
  car_store.subscribe((value) => (localStorage.car = JSON.stringify(value)));
  all_cars_store.subscribe((value) => (localStorage.cars = JSON.stringify(value)));
  modification_store.subscribe((value) => (localStorage.mod = JSON.stringify(value)));
  other_all_cars_store.subscribe((value) => (localStorage.othercars = JSON.stringify(value)));
}
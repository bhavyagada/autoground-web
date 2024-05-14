import { browser } from "$app/environment";
import { writable } from "svelte/store";

enum EventStatus {
  active = "active",
  cancelled = "cancelled"
}

interface Circle {
  circleId: string,
  latitude: number,
  longitude: number
  circleRadius: number,
}

interface Marker {
  markerId: string
  latitude: number,
  longitude: number,
  address: string,
}

interface Location {
  latitude: number,
  longitude: number
  address: string,
}

interface Ticket {
  ticketId: string,
  title: string
  description: string,
  freeTicket: boolean,
  price: number,
  quantity: number,
}

interface EventsData {
  created: number,
  modified: number,
  eventId: string,
  eventName: string,
  date: number,
  userId: string,
  eventAddress: string,
  eventPhoto: string,
  eventDescription: string,
  eventStatus: string,
  eventStartTime: number,
  eventEndTime: number,
  showAddressAfterTime: number,
  showAddress: boolean,
  totalPeopleAttendingCount: number,
  hideLivePeopleAttendCount: boolean,
  locationSharingEnabled: boolean,
  showVipList: boolean,
  eventMapRoute: {
    markers: Marker[]
    circles: Circle[],
    showMapRouteTime: number
    date: number,
    showMapRoute: boolean
  },
  location: Location,
  tickets: Ticket[],
}

interface TransactionTicket {
  ticketData: Ticket,
  quantity: number,
  price: number
}

interface BookingEventTransaction {
  userId: string,
  eventId: string,
  created: number,
  totalPrice: number,
  tax: number,
  status: string,
  paymentMethod: string,
  paymentDescription: string,
  bookingId: string,
  eventDescription: EventsData,
  ticketsBooked: TransactionTicket[]
}

let all: EventsData[] = [];
let booked: BookingEventTransaction[] = [];
let transaction: BookingEventTransaction | object = {};
let selected: string = "all";
if (browser) {
  const storedAll: string | null = localStorage.getItem("allevents");
  const storedBooked: string | null = localStorage.getItem("bookedevents");
  const storedTransaction: string | null = localStorage.getItem("transaction");
  const storedSelectedEventType: string | null = localStorage.getItem("eventtype");
  all = storedAll ? JSON.parse(storedAll) : all;
  booked = storedBooked ? JSON.parse(storedBooked) : booked;
  transaction = storedTransaction ? JSON.parse(storedTransaction) : transaction;
  selected = storedSelectedEventType ? JSON.parse(storedSelectedEventType) : selected;
}
export const allResultList = writable<EventsData[]>(all);
export const bookedResultList = writable<BookingEventTransaction[]>(booked);
export const bookingTransaction = writable<BookingEventTransaction | object>(transaction);
export const selectedEventType = writable<string>("all");
if (browser) {
  allResultList.subscribe((value) => localStorage.setItem("allevents", JSON.stringify(value)));
  bookedResultList.subscribe((value) => localStorage.setItem("bookedevents", JSON.stringify(value)));
  bookingTransaction.subscribe((value) => localStorage.setItem("transaction", JSON.stringify(value)));
  selectedEventType.subscribe((value) => localStorage.setItem("eventtype", JSON.stringify(value)));
}
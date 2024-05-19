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

export const all_result_list = writable(browser && JSON.parse(localStorage.getItem("allevents")!) || []);
export const booked_result_list = writable(browser && JSON.parse(localStorage.getItem("bookedevents")!) || []);
export const booking_transaction = writable(browser && JSON.parse(localStorage.getItem("transaction")!) || {});
export const selected_event_type = writable(browser && localStorage.getItem("eventtype") || "all");
if (browser) {
  all_result_list.subscribe((value) => (localStorage.allevents = JSON.stringify(value)));
  booked_result_list.subscribe((value) => (localStorage.bookedevents = JSON.stringify(value)));
  booking_transaction.subscribe((value) => (localStorage.transaction = JSON.stringify(value)));
  selected_event_type.subscribe((value) => (localStorage.eventtype = value));
}
import { browser } from "$app/environment";
import { writable } from "svelte/store";

interface Circle {
  circleId: string,
  circleRadius: number,
  latitude: number,
  longitude: number
}

interface Marker {
  address: string,
  latitude: number,
  longitude: number,
  markerId: string
}

interface Location {
  address: string,
  latitude: number,
  longitude: number
}

interface Ticket {
  description: string,
  freeTicket: boolean,
  price: number,
  quantity: number,
  ticketId: string,
  title: string
}

interface EventsData {
  created: number,
  date: number,
  eventAddress: string,
  eventDescription: string,
  eventEndTime: number,
  eventId: string,
  eventMapRoute: {
    circles: Circle[],
    date: number,
    markers: Marker[]
    showMapRouteTime: number
  },
  eventName: string,
  eventPhoto: string,
  eventStartTime: number,
  eventStatus: string,
  hideLivePeopleAttendCount: boolean,
  location: Location,
  modified: number,
  showAddressAfterTime: number,
  tickets: Ticket[],
  totalPeopleAttendingCount: number,
  userId: string,
}

let all: EventsData[] = [];
let booked: any[] = [];
if (browser) {
  const storedAll: string | null = localStorage.getItem("allevents");
  const storedBooked: string | null = localStorage.getItem("bookedevents");
  all = storedAll ? JSON.parse(storedAll) : all;
  booked = storedBooked ? JSON.parse(storedBooked) : booked;
}
export const allResultList = writable<EventsData[]>(all);
export const bookedResultList = writable<any>(booked);

if (browser) {
  allResultList.subscribe((value) => localStorage.setItem("allevents", JSON.stringify(value)));
  bookedResultList.subscribe((value) => localStorage.setItem("bookedevents", JSON.stringify(value)));
}
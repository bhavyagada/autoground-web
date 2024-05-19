<script lang="ts">
  import { browser } from "$app/environment";
  import { goto } from "$app/navigation";
  import { page } from "$app/stores";
  import { booked_result_list } from "$lib/stores/events";

  const { type, eventId } = $page.params;
  const id = Number(eventId) - 1;
  if (browser) {
    if (id < 0 || id >= $booked_result_list.length) goto("/events");
  }
  const eventBooking = $booked_result_list[id];
  const eventDetails = $booked_result_list[id].eventDescription;
  const eventTicket = eventDetails.tickets[0];
</script>

<div class="background ticketbg">
  <div class="ticket-background">
    <div class="details">
      <h1>{eventDetails.eventName}</h1>
      <p>{new Date(eventDetails.date).toDateString()} | {new Date(eventDetails.date).toLocaleTimeString()}</p>
      <p>{eventDetails.eventAddress || "Address Coming Soon"}</p>
      <div class="price-qty">
        <p>{eventTicket.title}</p>
        <p>{eventTicket.freeTicket ? "Free" : "$" + eventTicket.price}</p>
        <p>Qty {eventTicket.quantity}</p>
      </div>
      {#if eventBooking.status === "booked"}
        <img class="qr" alt="Event Ticket QR Code" src="https://api.qrserver.com/v1/create-qr-code/?size=150x150&data={eventBooking.bookingId}">
      {:else if eventBooking.status === "cancelled"}
        <p class="cancel-message">Ticket Cancelled</p>
      {/if}
    </div>
  </div>
</div>

<style>
  .background {
    width: var(--bgwidth);
    height: var(--bgheight);
    position: relative;
    z-index: 1; 
    color: white;
  }
  .ticketbg {
    background: url('/bg-ticket.avif') center / var(--bgsize) var(--bgrepeat);
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    height: 100vh;
  }
  .ticket-background {
    background: url("/event-ticket.svg") center;
    background-repeat: no-repeat, no-repeat;
    position: absolute;
    width: 70%;
    height: 70%;
  }
  .details {
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items: center;
    width: 100%;
    height: 100%;
    margin-top: 3rem;
  }
  .details h1 {
    font-size: 1.75rem;
    font-weight: 500;
    margin-top: 0.5rem;
  }
  .details p {
    font-size: 1.125rem;
    padding-bottom: 0.625rem;
    padding-left: 0.75rem;
  }
  .price-qty {
    display: flex;
    justify-content: space-evenly;
    align-items: center;
    width: 40%;
    margin-top: 1.5rem;
  }
  .price-qty p {
    font-size: 1.25rem;
    font-weight: 500;
    margin-top: 0.5rem;
  }
  .qr {
    margin: auto;
    width: 150px;
    height: 150px;
  }
  .cancel-message {
    margin: auto;
    color: red;
  }
</style>
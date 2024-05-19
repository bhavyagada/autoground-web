<script lang="ts">
  import { browser } from "$app/environment";
  import { goto } from "$app/navigation";
  import { page } from "$app/stores";
  import { CloudFunctions } from "$lib/functions/all";
  import { call_cloud_function } from "$lib/functions/util";
  import { add_toast, user_store } from "$lib/stores/auth";
  import { all_result_list, booked_result_list } from "$lib/stores/events";
  import Loading from "../../../../components/Loading.svelte";

  const { type, eventId } = $page.params;
  const id = Number(eventId) - 1;
  if (browser) {
    if (id < 0) goto("/events");
    if (type === "all" && (!$all_result_list.length || id >= $all_result_list.length)) goto("/events");
    else if (type === "booked" && (!$booked_result_list.length || id >= $booked_result_list.length)) goto("/events");
  }
  let eventDetails: any;
  if (type === "all") eventDetails = $all_result_list[id];
  else if (type === "booked") eventDetails = $booked_result_list[id].eventDescription;

  let booked: boolean = false;
  let isLoading: boolean = false;
  let clicked: boolean = false;

  const handleServerSideError = (errorMessage: string): boolean => {
    add_toast("error", errorMessage);
    isLoading = false;
    return false;
  };

  const handleEventBooking = async () => {
    const eventsData = $all_result_list[id];
    const sendData = { 
      userId: $user_store.userId, 
      eventId: eventsData.eventId,
      created: 0,
      totalPrice: 0,
      tax: 0,
      status: "cancelled",
      paymentMethod: "",
      paymentDescription: "",
      bookingId: "",
      eventDescription: eventsData,
      ticketsBooked: {
        ticketData: eventsData.tickets[0],
        quantity: 1,
        price: 0.0
      }
    }
    try {
      isLoading = true;
      const response = await call_cloud_function(CloudFunctions.BOOK_FREE_EVENT, sendData);
      if (response.isError) {
        if (response.errorType === "[already_booked]") return handleServerSideError("You are already attending this event!");
        else return handleServerSideError("Server Error! Please Try Again!");
      }
      else {
        isLoading = false;
        booked = true;
        return true;
      }
    } catch (err) {
      return handleServerSideError("Server Error! Please Try Again!");
    }
  }

  const handleCancelConfirmation = () => {
    if (type === "booked") {
      if ($booked_result_list[id].status === "cancelled") add_toast("error", "Your ticket is already Cancelled!");
      else clicked = !clicked;
    }
  }

  const handleCancelTicket = async () => {
    try {
      isLoading = true;
      const data = $booked_result_list[id];
      const res = await call_cloud_function(CloudFunctions.CANCEL_FREE_EVENT_TICKET, { ticketsBooked: data.ticketsBooked, bookingId: data.bookingId, eventId: data.eventId });
      if (res?.isError) return handleServerSideError("Error Loading Data! Try Again!");
      else {
        $booked_result_list[id] = { ...data, status: "cancelled"};
        isLoading = false;
        clicked = false;
        add_toast("success", "Event Ticket Cancelled Successfully!");
        return true;
      }
    } catch (err) {
      return handleServerSideError("Server Error! Please Try Again!");
    }
  }
</script>

{#if clicked}
  <div class="confirm-form">
    <form class={!clicked ? "hide" : ""}>
      <button on:click={() => { clicked = !clicked; }}><img src="/close-icon.svg" alt="Close Modal"></button>
      <h1>Confirm</h1>
      <div class="update">
        <p>Are you sure you want to cancel your ticket?</p>
        <div class="button-group">
          <button type="button" class="cancel" on:click={handleCancelTicket}>Yes</button>
          <button type="button" class="submit" on:click={() => { clicked = !clicked; }}>Cancel</button>
        </div>
      </div>
    </form>
  </div>
{/if}

{#if booked}
  <div class={clicked ? "hide" : "booked-background"}>
    <h1>Event Booked Successfully!</h1>
    <img src="/event-booked.svg" alt="Event Booked Confirmation">
    <p>Thank you for booking this event. We look forward to seeing you!</p>
    <button type="submit" on:click={() => goto("/events")}>Done</button>
  </div>
{:else}
  <div class={clicked ? "hide" : "background"}>
    <h1>Event Details</h1>
    <div class="details-container">
      <img src={eventDetails.eventPhoto !== "" ? eventDetails.eventPhoto : "/default-event.svg"} alt="Change this later">
      <div class="other-details">
        <p class="name">{eventDetails.eventName}</p>
        <p>{new Date(eventDetails.date).toDateString()} | {new Date(eventDetails.date).toLocaleTimeString()}</p>
        <p>{eventDetails.eventAddress}</p>
        {#if eventDetails.eventDescription}
          <div class="description">
            <p>Event Description</p>
            <p>{eventDetails.eventDescription}</p>
          </div>
        {/if}
        <div class="misc-group">
          <div class="vip">
            <p>Vip List</p>
            <button>View</button>
          </div>
          {#if eventDetails.showPeopleAttendingCount}
            <div class="people-attending">
              <p>People Attending</p>
              <div class="attending-total">
                <img class="people-attending-logo" src="/attending-event.svg" alt="Total People Attending Logo">
                <p>{eventDetails.totalPeopleAttendingCount}</p>
              </div>
            </div>
          {/if}
        </div>
      </div>
    </div>
    {#if isLoading}
      <div class="loading"><Loading /></div>
    {:else}
      {#if type === "all"}
        <button class="submit" on:click={handleEventBooking}>I am attending</button>
      {:else if type === "booked"}
        <div class="booked-actions">
          <button class="submit" on:click={() => { goto(`${$page.url.pathname}/ticket`); }}>View ticket</button>
          <button class="submit" on:click={handleCancelConfirmation}>Cancel ticket</button>
          <button class="submit" on:click={() => { goto(`${$page.url.pathname}/announcements`); }}>Announcements</button>
        </div>
      {/if}
    {/if}
  </div>
{/if}

<style>
  .confirm-form {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 100vw;
    height: 100vh;
  }
  form {
    position: absolute;
    background-color: black;
    color: white;
    display: flex;
    flex-direction: column;
    justify-content: center;
    width: 50%;
    height: 25%;
    padding: 1.5rem;
    border-radius: 0.5rem;
  }
  .hide {
    display: none;
  }
  .confirm-form img {
    position: absolute;
    top: -25px;
    right: -25px;
    z-index: 4;
    width: 3rem;
    height: 3rem;
  }
  form h1 {
    font-size: 2.25rem;
    line-height: 2.5rem;
    margin-bottom: 2rem;
    color: white;
  }
  .update {
    margin: auto 0;
  }
  .button-group {
    margin-top: 1rem;
  }
  .cancel {
    background-color: red;
    color: white;
    border-radius: 0.5rem;
    padding: 0.5rem 1.5rem;
    width: 15%;
    margin-bottom: 8rem;
    margin-right: 0.5rem;
  }
  .background, .booked-background {
    color: white;
    width: 100vw;
    height: 100vh;
    display: flex;
    flex-direction: column;
    justify-content: space-evenly;
    align-items: center;
    z-index: 1;
  }
  .background {
    background-color: rgb(24, 24, 24);
  }
  .booked-background {
    background-color: black;
  }
  .booked-background h1 {
    margin-top: 3rem;
    margin-bottom: 3rem;
  }
  .booked-background p {
    font-size: 1.5rem;
    line-height: 2rem;
  }
  .booked-background button {
    background-color: white;
    color: black;
    border-radius: 0.5rem;
    padding: 0.125rem 2rem;
    width: 15%;
    height: 4%;
  }
  h1 {
    font-size: 1.75rem;
    line-height: 2rem;
    margin: 6rem 0;
  }
  .details-container {
    display: flex;
    width: 80%;
    height: 50%;
  }
  .details-container img {
    width: 300px;
    height: 300px;
    border-radius: 0.75rem;
  }
  .name {
    font-size: 1.25rem;
    font-weight: 500;
  }
  .other-details {
    width: 100%;
    padding: 0 2rem;
  }
  .description {
    margin-top: 1rem;
  }
  .details-container p {
    line-height: 2rem;
  }
  .misc-group {
    display: flex;
    justify-content: space-between;
    width: 75%;
  }
  .people-attending {
    width: 50%;
  }
  .vip, .people-attending {
    display: flex;
    margin-top: 2.5rem;
  }
  .vip p, .people-attending p {
    font-size: 1.125rem;
    font-weight: 500;
  }
  .attending-total {
    display: flex;
    margin-left: 1rem;
  }
  .people-attending-logo {
    width: 1.25rem !important;
    height: 1.25rem !important;
    margin: 0 0.375rem;
    align-self: center;
  }
  .background button {
    background-color: white;
    color: black;
    border-radius: 0.5rem;
    padding: 0.125rem 2rem;
    margin-left: 2rem;
  }
  .submit {
    background-color: white;
    color: black;
    border-radius: 0.5rem;
    padding: 0.5rem 1.5rem;
    width: 15%;
    margin-bottom: 8rem;
  }
  .booked-actions {
    display: flex;
    justify-content: center;
    width: 100%;
  }
  .loading {
    margin-bottom: auto;
  }
</style>

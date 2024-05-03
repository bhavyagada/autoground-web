<script lang="ts">
  import { browser } from "$app/environment";
  import { goto } from "$app/navigation";
  import { page } from "$app/stores";
  import { CloudFunctions } from "$lib/functions/all";
  import { callCloudFunction } from "$lib/functions/util";
  import { addToast } from "$lib/stores/auth";
  import { allResultList, bookedResultList } from "$lib/stores/events";
  import Loading from "../../../../components/Loading.svelte";

  const { type, eventId } = $page.params;
  const id = Number(eventId) - 1;
  if (browser) {
    if (id < 0) goto("/events");
    if (type === "all" && (!$allResultList.length || id >= $allResultList.length)) goto("/events");
    else if (type === "booked" && (!$bookedResultList.length || id >= $bookedResultList.length)) goto("/events");
  }
  let eventDetails: any;
  if (type === "all") eventDetails = $allResultList[id];
  else if (type === "booked") eventDetails = $bookedResultList[id].eventDescription;

  let booked: boolean = false;
  let isLoading: boolean = false;
  let clicked: boolean = false;

  const handleServerSideError = (errorMessage: string): boolean => {
    addToast("error", errorMessage);
    isLoading = false;
    return false;
  };

  const handleEventBooking = () => {}

  const handleCancelTicket = async () => {
    try {
      isLoading = true;
      const data = $bookedResultList[id];
      const res = await callCloudFunction(CloudFunctions.CANCEL_FREE_EVENT_TICKET, { ticketsBooked: data.ticketsBooked, bookingId: data.bookingId, eventId: data.eventId });
      if (res?.isError) return handleServerSideError("Error Loading Data! Try Again!");
      else {
        $bookedResultList = $bookedResultList.filter((_, index) => index !== id);
        isLoading = false;
        clicked = false;
        addToast("success", "Event Ticket Cancelled Successfully!");
        goto("/events");
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
    <button type="submit">Done</button>
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
      <Loading />
    {:else}
      {#if type === "all"}
        <button class="submit" on:click={handleEventBooking}>I am attending</button>
      {:else if type === "booked"}
        <div class="booked-actions">
          <button class="submit" on:click={() => { goto(`${$page.url.pathname}/ticket`); }}>View ticket</button>
          <button class="submit" on:click={() => { clicked = !clicked; }}>Cancel ticket</button>
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
  h1 {
    font-size: 1.75rem;
    line-height: 2rem;
    margin: 6rem 0;
  }
  .details-container {
    display: flex;
    width: 80%;
    height: 100vh;
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
  .background button, .booked-background button {
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
</style>

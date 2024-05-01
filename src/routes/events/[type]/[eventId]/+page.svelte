<script lang="ts">
  import { browser } from "$app/environment";
  import { goto } from "$app/navigation";
  import { page } from "$app/stores";
  import { allResultList, bookedResultList } from "$lib/stores/events";

  const { type, eventId } = $page.params;
  const id = Number(eventId);
  if (browser) {
    if (type === "all" && $allResultList.length === 0) goto("/events");
    else if (type === "booked" && $bookedResultList.length === 0) goto("/events");
  }
  let eventDetails: any;
  if (type === "all") eventDetails = $allResultList[id-1];
  else if (type === "booked") eventDetails = $bookedResultList[id-1].eventDescription;

  let booked: boolean = false; 

  const handleEventBooking = () => {
    console.log(eventDetails);
  }

  const handleAnnouncementsClick = () => {
    goto(`${$page.url.pathname}/announcements`);
  }
</script>

{#if booked}
  <div class="booked-background">
    <h1>Event Booked Successfully!</h1>
    <img src="/event-booked.svg" alt="Event Booked Confirmation">
    <p>Thank you for booking this event. We look forward to seeing you!</p>
    <button type="submit">Done</button>
  </div>
{:else}
  <div class="background">
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
    {#if type === "all"}
      <button class="submit" on:click={handleEventBooking}>I am attending</button>
    {:else if type === "booked"}
      <div class="booked-actions">
        <button class="submit">View ticket</button>
        <button class="submit">Cancel ticket</button>
        <button class="submit" on:click={handleAnnouncementsClick}>Announcements</button>
      </div>
    {/if}
  </div>
{/if}

<style>
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
  button {
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

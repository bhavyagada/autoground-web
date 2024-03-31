<script lang="ts">
  import { browser } from "$app/environment";
  import { goto } from "$app/navigation";
  import { page } from "$app/stores";
  import { allResultList } from "$lib/stores/events";

  if (browser) {
    if ($allResultList.length === 0) goto("/events");
  }
  const { eventId } = $page.params;
  const id = Number(eventId);
  const eventDetails = $allResultList[id-1];
</script>

<div class="background">
  <h1>Event Details</h1>
  <div class="details-container">
    <img src={eventDetails.eventPhoto} alt="Change this later">
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
      <div class="vip">
        <p>Vip List</p>
        <button>View</button>
      </div>
    </div>
  </div>
  <button class="submit">I am attending</button>
</div>

<style>
  .background {
    background-color: rgb(24, 24, 24);
    color: white;
    width: 100vw;
    height: 100vh;
    display: flex;
    flex-direction: column;
    justify-content: space-evenly;
    align-items: center;
    z-index: 1;
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
    padding: 0 2rem;
  }
  .description {
    margin-top: 1rem;
  }
  .details-container p {
    line-height: 2rem;
  }
  .vip {
    display: flex;
    margin-top: 2.5rem;
  }
  .vip p {
    font-size: 1.125rem;
    font-weight: 500;
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
    width: 20%;
    margin-bottom: 8rem;
  }
</style>
<script lang="ts">
  import { goto } from "$app/navigation";
  import { addToast, authData } from "$lib/stores/auth";
  import { selectedEventType } from "$lib/stores/events";

  export let result: any;
  export let index: number;
  let resultList: any;
  $: if ($selectedEventType === "all") {
    resultList = result;
  } else if ($selectedEventType === "booked") {
    resultList = result.eventDescription;
  }

  const handleEventClick = (e: any) => {
    const eventId = e.currentTarget.id;
    if ($authData.isLoggedIn) goto(`/events/${$selectedEventType}/${eventId}`);
    else {
      addToast("error", "Please Sign In to Book the Event");
      goto("/login");
    }
  }
</script>

<div>
  <button id={String(index+1)} class="event" on:click={handleEventClick}>
    <img alt="Event" src={resultList.eventPhoto || "/default-event.svg"}>
    <h1>{resultList.eventName}</h1>
    <p>{new Date(resultList.date).toDateString()} | {new Date(resultList.date).toLocaleTimeString()}</p>
    <p>{resultList.eventAddress || "Address Coming Soon"}</p>
  </button>
  {#if $selectedEventType === "all"}
    {#if resultList.tickets[0].freeTicket}
      <p class="free">Free</p>
    {:else}
      <p>From ${resultList.tickets[0].price}</p>
    {/if}
  {:else}
    <div class="view-ticket">
      <p>Ticket</p>
      <button class="submit" on:click={() => { goto(`/events/${$selectedEventType}/${String(index+1)}/ticket`); }}>View</button>
    </div>
  {/if}
</div>

<style>
  div {
    background-color: rgb(51, 55, 64);
    border-radius: 0.75rem;
    margin: 2rem;
    width: 340px;
  }
  div img {
    width: 340px;
    height: 340px;
    border-radius: 0.75rem;
  }
  div h1, div p {
    padding-bottom: 0.625rem;
    padding-left: 0.75rem;
    width: 100%;
    text-align: start;
  }
  div h1 {
    font-size: 1.25rem;
    font-weight: 500;
    margin-top: 0.5rem;
  }
  .free {
    color: rgb(57, 181, 74);
  }
  .view-ticket {
    display: flex;
    margin: 0;
    padding-left: 0.75rem;
  }
  .view-ticket p {
    width: 20%;
    padding: 0.5rem 0;
    padding-right: 0.25rem;
  }
  .submit {
    background-color: white;
    color: black;
    border-radius: 0.5rem;
    width: 20%;
    height: 20%;
    margin: 0.5rem 0.25rem;
  }
</style>
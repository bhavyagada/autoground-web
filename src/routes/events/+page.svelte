<script lang="ts">
  import { cloudFunctions } from "$lib/functions/all";
  import { callFunction } from "$lib/functions/util";
  import { addToast } from "$lib/stores/auth";
  import { onMount } from "svelte";
  import { writable } from "svelte/store";
  // import EventCard from "../../components/EventCard.svelte";
  
  const allEventData = writable<{batchSize: number, startAfter: string | null, afterDateEvent: number }>({ batchSize: 9, startAfter: null, afterDateEvent: Date.now() });
  const allHasMore = writable<boolean>(false);
  const allResultList = writable<any>([]);
  const bookedEventData = writable<{batchSize: number, startAfter: string | null }>({ batchSize: 9, startAfter: null });
  const bookedHasMore = writable<boolean>(false);
  const bookedResultList = writable<any>([]);

  let isLoading: boolean = false;
  let observer: IntersectionObserver;
  let results: any;
  let root: any;
  let selected = "all";
  let startAfter: string | null = null;

  const handleServerSideError = (errorMessage: string): boolean => {
    addToast("error", errorMessage);
    isLoading = false;
    return false;
  };

  onMount(() => {
    const getEvents = async () => {
      isLoading = true;
      try {
        const allResults = await callFunction(cloudFunctions.GET_EVENTS, $allEventData);
        if (allResults?.isError) {
          return handleServerSideError("Error Loading Data! Try Again!");
        } else {
          $allResultList = allResults?.result.events;
          $allHasMore = allResults?.result.hasMore;
          $allEventData = { ...$allEventData, startAfter: allResults?.result.startAfter };
        }
        const bookedResults = await callFunction(cloudFunctions.GET_BOOKED_EVENTS, $bookedEventData);
        if (bookedResults?.isError) {
          return handleServerSideError("Error Loading Data! Try Again!");
        } else {
          $bookedResultList = bookedResults?.result.events;
          $bookedHasMore = bookedResults?.result.hasMore;
          $bookedEventData = { ...$bookedEventData, startAfter: bookedResults?.result.startAfter };
        }
        isLoading = false;
        return true;
      } catch (err) {
        return handleServerSideError("Server Error! Please Try Again!");
      }
    }
    getEvents();
  });

  const handleAllEventsTabClick = () => {
    selected = "all";
    results = $allResultList;
  }
  
  const handleBookedEventsTabClick = () => {
    selected = "booked";
    results = $bookedResultList;
  }
</script>

<div class="background">
  <div class="headings">
    <button on:click={handleAllEventsTabClick} class={selected === "all" ? "selected" : ""} type="button"><h1>Events</h1></button>
    <button on:click={handleBookedEventsTabClick} class={selected === "booked" ? "selected" : ""} type="button"><h1>My Booked Events</h1></button>
  </div>
  <!-- <EventCard /> -->
  
</div>

<style>
  .background {
    background-color: rgb(24, 24, 24);
    color: white;
    width: 100vw;
    display: flex;
    flex-direction: column;
    align-items: center;
    z-index: 1;
  }
  .headings {
    display: flex;
    justify-content: space-evenly;
    width: 100%;
    margin-top: 2rem;
  }
  .selected {
    border-bottom: 1px solid white;
  }
  h1 {
    font-size: 1.5rem;
    line-height: 2rem;
    margin-top: 6rem;
    padding-bottom: 1rem;
  }
</style>
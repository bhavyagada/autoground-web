<script lang="ts">
  import { browser } from "$app/environment";
  import { CloudFunctions } from "$lib/functions/all";
  import { callCloudFunction } from "$lib/functions/util";
  import { addToast } from "$lib/stores/auth";
  import { onDestroy, onMount } from "svelte";
  import { writable } from "svelte/store";
  import { allResultList, bookedResultList } from "$lib/stores/events";
  import EventCard from "../../components/EventCard.svelte";
  import Loading from "../../components/Loading.svelte";

  const allEventData = writable<{batchSize: number, startAfter: string | null, afterDateEvent: number }>({ batchSize: 9, startAfter: null, afterDateEvent: Date.now() });
  const allHasMore = writable<boolean>(false);
  const bookedEventData = writable<{batchSize: number, startAfter: string | null }>({ batchSize: 9, startAfter: null });
  const bookedHasMore = writable<boolean>(false);

  let isLoading: boolean = false;
  let observer: IntersectionObserver;
  let results: any = [];
  let root: any;
  let selected = "all";
  let startAfter: string | null = null;

  const handleServerSideError = (errorMessage: string): boolean => {
    addToast("error", errorMessage);
    isLoading = false;
    return false;
  };

  const getEvents = async (type: string) => {
    isLoading = true;
    try {
      if (type === "all") {
        const allResults = await callCloudFunction(CloudFunctions.GET_EVENTS, $allEventData);
        if (allResults?.isError) {
          return handleServerSideError("Error Loading Data! Try Again!");
        } else {
          $allResultList = allResults?.result.data.events;
          $allHasMore = allResults?.result.data.hasMore;
          $allEventData = { ...$allEventData, startAfter: allResults?.result.data.startAfter };
        }
      } else if (type === "booked") {
        const bookedResults = await callCloudFunction(CloudFunctions.GET_BOOKED_EVENTS, $bookedEventData);
        if (bookedResults?.isError) {
          return handleServerSideError("Error Loading Data! Try Again!");
        } else {
          $bookedResultList = bookedResults?.result.data.events;
          $bookedHasMore = bookedResults?.result.data.hasMore;
          $bookedEventData = { ...$bookedEventData, startAfter: bookedResults?.result.data.startAfter };
        }
      }
      isLoading = false;
      return true;
    } catch (err) {
      return handleServerSideError("Server Error! Please Try Again!");
    }
  }

  onMount(() => {
    const storedAllResults = localStorage.getItem("allevents");
    const storedBookedResults = localStorage.getItem("bookedevents");
    $allResultList = storedAllResults ? JSON.parse(storedAllResults) : [];
    $bookedResultList = storedBookedResults ? JSON.parse(storedBookedResults) : [];
    const getResultsFirstTime = async () => {
      await getEvents("all");
      await getEvents("booked");
    }
    getResultsFirstTime();
  });

  $: if (selected === "all") {
    results = $allResultList;
    startAfter = $allEventData.startAfter;
  } else if (selected === "booked") {
    results = $bookedResultList;
    startAfter = $bookedEventData.startAfter;
  }

  $: if (browser) {
    observer = new IntersectionObserver(async (entries) => {
      for (const entry of entries) {
        if (entry.isIntersecting) {
          observer.disconnect();
          if (selected === "all") await getEvents("all");
          else if (selected === "booked") await getEvents("booked");
        }
      };
    });
  
    if ($allHasMore || $bookedHasMore) observer.observe(root);

    onDestroy(() => observer.disconnect());
  }
</script>

<div class="background">
  <div class="headings">
    <button on:click={() => selected = "all"} class={selected === "all" ? "selected" : ""} type="button"><h1>Events</h1></button>
    <button on:click={() => selected = "booked"} class={selected === "booked" ? "selected" : ""} type="button"><h1>My Booked Events</h1></button>
  </div>
  {#if isLoading}
    <Loading />
  {:else}
    <div class="all-results">
      {#each results as result, index}
        <div id={String(index+1)}>
          <EventCard {result} {selected} {index} />
        </div>
      {/each}
    </div>
  {/if}
  <div bind:this={root} class="results"></div>
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
  .all-results {
    display: flex;
    flex-wrap: wrap;
    justify-content: flex-start;
    align-items: center;
    width: 75%;
    margin-top: 4rem;
  }
  .all-results div {
    background: none;
    text-align: start;
  }
</style>

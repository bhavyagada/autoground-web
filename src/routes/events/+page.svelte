<script lang="ts">
  import { browser } from "$app/environment";
  import { CloudFunctions } from "$lib/functions/all";
  import { call_cloud_function } from "$lib/functions/util";
  import { add_toast, auth_store } from "$lib/stores/auth";
  import { onDestroy, onMount } from "svelte";
  import { writable } from "svelte/store";
  import { all_result_list, booked_result_list, selected_event_type } from "$lib/stores/events";
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
  let startAfter: string | null = null;

  const handleServerSideError = (errorMessage: string): boolean => {
    add_toast("error", errorMessage);
    isLoading = false;
    return false;
  };

  const getEvents = async (type: string) => {
    isLoading = true;
    try {
      if (type === "all") {
        const allResults = await call_cloud_function(CloudFunctions.GET_EVENTS, $allEventData);
        if (allResults?.isError) {
          return handleServerSideError("Error Loading Data! Try Again!");
        } else {
          $all_result_list = allResults?.result.data.events;
          $allHasMore = allResults?.result.data.hasMore;
          $allEventData = { ...$allEventData, startAfter: allResults?.result.data.startAfter };
        }
      } else if (type === "booked") {
        const bookedResults = await call_cloud_function(CloudFunctions.GET_BOOKED_EVENTS, $bookedEventData);
        if (bookedResults?.isError) {
          return handleServerSideError("Error Loading Data! Try Again!");
        } else {
          $booked_result_list = bookedResults?.result.data.events;
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
    // const storedAllResults = localStorage.getItem("allevents");
    // const storedBookedResults = localStorage.getItem("bookedevents");
    // $all_result_list = storedAllResults ? JSON.parse(storedAllResults) : [];
    // $booked_result_list = storedBookedResults ? JSON.parse(storedBookedResults) : [];
    const getResultsFirstTime = async () => {
      await getEvents("all");
      if ($auth_store.isLoggedIn) await getEvents("booked");
    }
    getResultsFirstTime();
  });

  $: if ($selected_event_type === "all") {
    results = $all_result_list;
    startAfter = $allEventData.startAfter;
  } else if ($selected_event_type === "booked") {
    results = $booked_result_list;
    startAfter = $bookedEventData.startAfter;
  }

  $: if (browser) {
    observer = new IntersectionObserver(async (entries) => {
      for (const entry of entries) {
        if (entry.isIntersecting) {
          observer.disconnect();
          if ($selected_event_type === "all") await getEvents("all");
          else if ($selected_event_type === "booked") await getEvents("booked");
        }
      };
    });
  
    if ($allHasMore || $bookedHasMore) observer.observe(root);

    onDestroy(() => observer.disconnect());
  }
</script>

<div class="background">
  <div class="headings">
    <button on:click={() => $selected_event_type = "all"} class={$selected_event_type === "all" ? "selected" : ""} type="button"><h1>Events</h1></button>
    {#if $auth_store.isLoggedIn}
      <button on:click={() => $selected_event_type = "booked"} class={$selected_event_type === "booked" ? "selected" : ""} type="button"><h1>My Booked Events</h1></button>
    {/if}
  </div>
  {#if isLoading}
    <Loading />
  {:else}
    <div class="all-results">
      {#each results as result, index}
        <div id={String(index+1)}>
          <EventCard {result} {index} />
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
    width: 80%;
    margin-top: 4rem;
  }
  .all-results div {
    background: none;
    text-align: start;
  }
</style>

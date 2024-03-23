<script lang="ts">
  import { cloudFunctions } from "$lib/functions/all";
  import { callFunction } from "$lib/functions/util";
  import { addToast } from "$lib/stores/auth";
  import { onDestroy, onMount } from "svelte";
  import { writable } from "svelte/store";
  import { fade } from "svelte/transition";

  interface SearchData {
    searchKeyword: string, 
    batchSize: number,
    startAfter: string | null
  }
  const searchData = writable<SearchData>({ searchKeyword: "", batchSize: 10, startAfter: null });
  const hasMore = writable<boolean>(false);
  const resultsList = writable<any>([]);

  // let loaded = false;
  let results: any = $resultsList;
  $: results = $resultsList;
  let root: any;

  if ($hasMore) {
    let observer = new IntersectionObserver(async (entries) => {
      for (const entry of entries) {
        if (entry.isIntersecting) {
          // loaded = true;
          observer.disconnect();
          await handleSearch();
        }
      };
    });
    onMount(() => {
      observer.observe(root);
    });
  
    onDestroy(() => {
      observer.disconnect();
    });
  }

  // let searchKeyword = "";
  let selectedOption = "people";
  let startAfter: string | null = null;

  $: console.log("search data:", $searchData);
  $: console.log("selected option: ", selectedOption);
  // $: searchKeyword = $searchData.searchKeyword;
  $: startAfter = $searchData.startAfter;

  const functions: any = {
    "people": cloudFunctions.SEARCH_USER_PROFILES,
    "cars": cloudFunctions.SEARCH_CAR_PROFILES,
    "events": cloudFunctions.SEARCH_EVENTS
  }

  const handleError = (errorMessage: string): boolean => {
    addToast("error", errorMessage);
    return false;
  };

  const handleSearch = async () => {
    if ($searchData.searchKeyword === "") {
      return handleError("Search Keyword cannot be Empty!")
    }

    try {
      const result = await callFunction(functions[selectedOption], $searchData);
      console.log(result);
      if (result?.isError) {
        return handleError("Server Error! Please Try Again!");
      } else {
        $hasMore = result?.result.hasMore;
        $searchData.startAfter = result?.result.startAfter;
        $resultsList = result?.result.data[selectedOption];
        console.log($resultsList);
      }
    } catch (err) {
      return handleError("Server Error! Please Try Again!");
    }
  }
</script>

<div class="background">
  <h1>Search</h1>
  <div class="options">
    <button class={selectedOption === "people" ? "selected" : ""} on:click={() => { selectedOption = "people" }}>People</button>
    <button class={selectedOption === "cars" ? "selected" : ""} on:click={() => { selectedOption = "cars" }}>Vehicles</button>
    <button class={selectedOption === "events" ? "selected" : ""} on:click={() => { selectedOption = "events" }}>Events</button>
  </div>
  <div class="search">
    <img src="/searchicon.svg" alt="Search Icon">
    <input bind:value={$searchData.searchKeyword} on:keyup={(e) => { if (e.key === "Enter") handleSearch() }} type="text" name="search" placeholder="Search people, vehicles, or events">
  </div>
  <div transition:fade class="lazy-results">
    {#each results as result}
      <div class="search-result">{result.data.name}</div>
    {/each}
  </div>
  <div bind:this={root} class="results"></div>
</div>

<style>
  h1 {
    font-size: 1.5rem;
    line-height: 2rem;
    margin-top: 6rem;
  }
  .background {
    background-color: rgb(24, 24, 24);
    color: white;
    width: 100vw;
    display: flex;
    flex-direction: column;
    align-items: center;
    z-index: 1;
  }
  .options {
    display: flex;
    justify-content: space-evenly;
    background-color: rgb(51, 55, 64);
    border-radius: 0.75rem;
    width: 95%;
    font-size: 1.125rem;
    line-height: 2rem;
    padding: 1rem;
    margin-top: 3rem;
  }
  .options button {
    flex: 30%;
    text-align: center;
    padding: 0.25rem 0;
  }
  .selected {
    background-color: rgba(217, 217, 217, 0.3);
    border-radius: 0.5rem;
  }
  .search {
    background-color: rgb(51, 55, 64);
    background-origin: content-box;
    width: 95%;
    padding: 0.25rem 0.75rem;
    border-radius: 0.75rem;
    line-height: 2rem;
    font-size: 1.125rem;
    margin-top: 3rem;
    display: flex;
    align-items: center;
  }
  .search input {
    width: 100%;
    background-color: rgb(51, 55, 64);
    margin-left: 0.5rem;
  }
  .search input:focus {
    outline: none;
  }
  @media all and (min-width:700px) {
    h1 {
      font-size: 2.25rem;
      line-height: 2.5rem;
      margin-top: 8rem;
      width: 100%;
      text-align: center;
    }
    .options {
      width: 40%;
      margin-top: 2rem;
    }
    .search {
      width: 70%;
      margin-top: 2rem;
    }
  }
</style>
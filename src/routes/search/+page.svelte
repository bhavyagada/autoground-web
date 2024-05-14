<script lang="ts">
  import { browser } from "$app/environment";
  import { goto } from "$app/navigation";
  import { CloudFunctions } from "$lib/functions/all";
  import { callCloudFunction } from "$lib/functions/util";
  import { addToast, otherUserStore, userStore } from "$lib/stores/auth";
  import { defaultCar, otherAllCarsStore } from "$lib/stores/car";
  import { onDestroy, onMount } from "svelte";
  import { writable } from "svelte/store";
  import { fade } from "svelte/transition";
  import Loading from "../../components/Loading.svelte";
  import { allResultList } from "$lib/stores/events";

  const vehicleIcons: any = {
    bike: "/bike.svg",
    car: "/car.svg",
    truck: "/truck.svg"
  }

  const searchData = writable<{searchKeyword: string, batchSize: number, startAfter: string | null, afterDateEvent?: number }>({ searchKeyword: "", batchSize: 6, startAfter: null });
  const hasMore = writable<boolean>(false);
  const resultList = writable<any>([]);

  let isLoading: boolean = false;
  let observer: IntersectionObserver;
  let results: any;
  let root: any;
  let selectedOption = "people";
  let startAfter: string | null = null;

  const functions: any = {
    "people": CloudFunctions.SEARCH_USER_PROFILES,
    "cars": CloudFunctions.SEARCH_CAR_PROFILES,
    "events": CloudFunctions.SEARCH_EVENTS
  }

  const handleOptionChange = (option: string) => {
    selectedOption = option;
    $searchData = { ...$searchData, startAfter: null };
    $resultList = [];
  }

  const handleError = (errorMessage: string): boolean => {
    addToast("error", errorMessage);
    return false;
  };

  const handleServerError = (errorMessage: string): boolean => {
    isLoading = false;
    addToast("error", errorMessage);
    return false;
  };

  const handleKeywordChange = () => {
    if ($resultList) $resultList = [];
  }

  const handleSearch = async () => {
    if ($searchData.searchKeyword === "") {
      return handleError("Search Keyword cannot be Empty!")
    }

    try {
      isLoading = true;
      let result;
      if (selectedOption !== "events") {
        result = await callCloudFunction(functions[selectedOption], $searchData);
      } else {
        $searchData = { ...$searchData, afterDateEvent: Date.now() };
        result = await callCloudFunction(functions[selectedOption], $searchData);
      }
      if (result?.isError) {
        return handleServerError("Server Error! Please Try Again!");
      } else {
        $hasMore = result?.result.data.hasMore;
        $searchData.startAfter = result?.result.data.startAfter;
        $resultList = results.concat(result?.result.data[selectedOption]);
        isLoading = false;
      }
    } catch (err) {
      return handleServerError("Server Error! Please Try Again!");
    }
  }

  const handleOtherCarOrUserClick = async (e: MouseEvent, type: string) => {
    const button = e.currentTarget as HTMLButtonElement;
    const id = button.id;
    if ($userStore.userId === id) return handleError("This is your Profile!");
    console.log("button id = user id:", id);
    try {
      isLoading = true;
      const result = await callCloudFunction(CloudFunctions.GET_ANOTHER_GARAGE_DATA, { searchUserId: id });
      const userresult = await callCloudFunction(CloudFunctions.GET_ANOTHER_USER_PROFILE, { searchUserId: id} );
      if (result?.isError || userresult?.isError) {
        return handleServerError("Server Error! Please Try Again!");
      } else {
        console.log(userresult?.result.data);
        $otherAllCarsStore = result?.result.data.cars;
        $otherUserStore = userresult?.result.data;
        isLoading = false;
        if (type === "car") goto(`/garage/other`);
        else if (type === "user") goto(`/user/other`);
      }
    } catch (err) {
      return handleServerError("Server Error! Please Try Again!");
    }
  }

  const handleEventClick = async (e: MouseEvent) => {
    const button = e.currentTarget as HTMLButtonElement;
    const id = button.id;
    console.log(id);
    const currentEventIndex = $allResultList.findIndex(event => event.eventId === id);
    if ($allResultList.length > 0) goto(`/events/all/${currentEventIndex + 1}`);
    // else {
    //   try {
    //     isLoading = true;
    //     const allResults = await callCloudFunction(CloudFunctions.GET_EVENTS, $allEventData);
    //     if (allResults?.isError) {
    //       return handleServerSideError("Error Loading Data! Try Again!");
    //     } else {
    //       $allResultList = allResults?.result.data.events;
    //       $allHasMore = allResults?.result.data.hasMore;
    //       $allEventData = { ...$allEventData, startAfter: allResults?.result.data.startAfter };
    //     }
    //   }
    // }
  }

  onMount(() => $otherAllCarsStore = [defaultCar]);

  $: results = $resultList;
  $: startAfter = $searchData.startAfter;

  $: if (browser) {
    observer = new IntersectionObserver(async (entries) => {
      for (const entry of entries) {
        if (entry.isIntersecting) {
          observer.disconnect();
          handleSearch();
        }
      };
    });
  
    if ($hasMore) observer.observe(root);

    onDestroy(() => observer.disconnect());
  }
</script>

<div class="background">
  <h1>Search</h1>
  <div class="options">
    <button class={selectedOption === "people" ? "selected" : ""} on:click={() => handleOptionChange("people")}>People</button>
    <button class={selectedOption === "cars" ? "selected" : ""} on:click={() => handleOptionChange("cars")}>Vehicles</button>
    <button class={selectedOption === "events" ? "selected" : ""} on:click={() => handleOptionChange("events")}>Events</button>
  </div>
  <div class="search">
    <img src="/searchicon.svg" alt="Search Icon">
    <input bind:value={$searchData.searchKeyword} on:keyup={(e) => { if (e.key === "Enter") handleSearch() }} on:change={handleKeywordChange} type="text" name="search" placeholder="Search people, vehicles, or events">
  </div>
  {#if selectedOption === "people"}
    <div transition:fade class="people-results-container">
      {#if isLoading}
        <Loading />
      {:else}
        {#each results as result}
          <button id={result.data.userId} class="user-results" on:click={(e) => { handleOtherCarOrUserClick(e, "user"); } }>
            <img src="/search-user-icon.svg" alt="User Icon">
            <img class="userphoto" src={result.data.userPhoto ? result.data.userPhoto : "/default-photo.svg"} alt="Profile">
            <p class="name">{result.data.name}</p>
            <p>@{result.data.userName}</p>
          </button>
        {/each}
      {/if}
    </div>
  {:else if selectedOption === "cars"}
    {#if isLoading}
      <Loading />
    {:else}
      <div transition:fade class="vehicle-results-container">
        {#each results as result}
          <button id={result.data.userId} class="vehicle-results" on:click={(e) => { handleOtherCarOrUserClick(e, "car"); } }>
            <div class="car-name">
              <img src={result.data.vehicleType ? vehicleIcons[result.data.vehicleType] : vehicleIcons["car"]} alt="Vehicle Type">
              <p>{result.data.name}</p>
            </div>
            <img class="cover-photo" src={result.data.coverPhoto ? result.data.coverPhoto : "/default-photo.svg"} alt="Vehicle Cover">
            <div class="car-make">
              <p>{result.data.year}</p>
              <p>{result.data.make}</p>
              <p>{result.data.model}</p>
            </div>
            <div class="car-username">
              <img src="/search-user-icon.svg" alt="User Icon">
              <p class="name">@{result.data.userName}</p>
            </div>
          </button>
        {/each}
      </div>
    {/if}
  {:else if selectedOption === "events"}
    {#if isLoading}
      <Loading />
    {:else}
      <div transition:fade class="event-results-container">
        {#each results as result}
          <button id={result.id} class="event-results" on:click={handleEventClick}>
            <img src={result.data.eventPhoto} alt="Event Cover">
            <p class="event-name">{result.data.eventName}</p>
            <p>{new Date(result.data.eventStartTime).toDateString()} | {new Date(result.data.eventStartTime).toLocaleTimeString()}</p>
            <p>{result.data.location.address}</p>
          </button>
        {/each}
      </div>
    {/if}
  {/if}
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
    padding: 0.25rem 1rem;
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
  .people-results-container {
    display: flex;
    flex-direction: column;
    width: 95%;
    margin-top: 3rem;
  }
  .user-results {
    background-color: rgba(51, 55, 64, 0.7);
    border-radius: 0.5rem;
    display: flex;
    align-items: center;
    width: 100%;
    padding: 1rem;
    margin-bottom: 1.5rem;
  }
  .user-results img {
    margin-right: 1rem;
    border-radius: 2rem;
  }
  .userphoto {
    width: 55px;
    height: 55px;
  }
  .name {
    font-size: 1.125rem;
    font-weight: 500;
    margin-right: 3rem;
  }
  .vehicle-results-container, .event-results-container {
    display: flex;
    flex-wrap: wrap;
    width: 95%;
    margin-top: 3rem;
  }
  .vehicle-results {
    background-color: rgba(51, 55, 64, 0.7);
    border-radius: 0.75rem;
    width: 95%;
    margin: 0.875rem;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
  }
  .cover-photo {
    width: 225px;
    height: 150px;
    border-radius: 0.5rem;
    margin-top: 0.25rem;
  }
  .car-name {
    display: flex;
    align-items: center;
    margin-top: 0.25rem;
  }
  .car-name img {
    width: 30px;
    height: 25px;
    margin-right: 0.25rem;
  }
  .car-make, .car-username {
    display: flex;
    justify-content: center;
  }
  .car-make p, .car-username > * {
    margin: 0 0.25rem;
  }
  .car-make p {
    font-size: 0.875rem;
  }
  .car-make {
    margin-top: 0.25rem;
  }
  .car-username {
    margin-top: 1rem;
    margin-bottom: 0.5rem;
  }
  .event-results {
    background-color: rgb(51, 55, 64);
    border-radius: 0.75rem;
    margin: 0.875rem;
    display: flex;
    flex-direction: column;
    width: 95%;
  }
  .event-results img {
    width: 100%;
    height: 300px;
    border-radius: 0.75rem;
  }
  .event-results p {
    margin: 0.5rem 0.75rem;
  }
  .event-name {
    font-size: 1.5rem;
    line-height: 2rem;
    margin: 0;
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
    .people-results-container, .vehicle-results-container, .event-results-container {
      width: 70%;
    }
    .vehicle-results, .event-results {
      width: 40%;
    }
  }
  @media all and (min-width: 1200px) {
    .vehicle-results, .event-results {
      width: 30%;
    }
  }
</style>
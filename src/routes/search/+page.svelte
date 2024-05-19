<script lang="ts">
  import { onMount, onDestroy } from "svelte";
  import { writable } from "svelte/store";
  import { fade } from "svelte/transition";
  import { browser } from "$app/environment";
  import { afterNavigate, goto } from "$app/navigation";
  import { CloudFunctions } from "$lib/functions/all";
  import { call_cloud_function } from "$lib/functions/util";
  import { add_toast, other_user_store, user_store } from "$lib/stores/auth";
  import { default_car, other_all_cars_store } from "$lib/stores/car";
  import { all_result_list } from "$lib/stores/events";
  import Loading from "../../components/Loading.svelte";
  import { navigating } from "$app/stores";
  
  const searchData = writable<{searchKeyword: string, batchSize: number, startAfter: string | null, afterDateEvent?: number }>({ searchKeyword: "", batchSize: 6, startAfter: null });
  const hasMore = writable<boolean>(false);
  const resultList = writable<any>([]);

  const vehicleIcons: any = { bike: "/bike.svg", car: "/car.svg", truck: "/truck.svg" }
  let isLoading: boolean = false;
  let results: any;
  let root: any;
  let selectedOption = "people";
  let searchRef: HTMLInputElement;
  let current: boolean = true;

  const handleOptionChange = (option: string) => {
    selectedOption = option;
    $searchData = { ...$searchData, startAfter: null };
    $resultList = [];
  }

  const handleKeywordChange = () => {
    $searchData = { ...$searchData, startAfter: null };
    $resultList = [];
  }

  const getCloudFunction = (option: string): any => {
    if (option === "people") return CloudFunctions.SEARCH_USER_PROFILES;
    if (option === "cars") return CloudFunctions.SEARCH_CAR_PROFILES;
    if (option === "events") {
      $searchData = { ...$searchData, afterDateEvent: Date.now() };
      return CloudFunctions.SEARCH_EVENTS;
    }
  }

  const handleSearch = async () => {
    if ($searchData.searchKeyword === "") { add_toast("error", "Search Keyword cannot be Empty!"); return; }
    try {
      isLoading = true;
      const result = await call_cloud_function(getCloudFunction(selectedOption), $searchData);
      if (result?.isError) { add_toast("error", "Server Error! Please Try Again!"); return; }
      $hasMore = result?.result.data.hasMore;
      $searchData.startAfter = result?.result.data.startAfter;
      $resultList = results.concat(result?.result.data[selectedOption]);
    } catch (err) {
      add_toast("error", "Server Error! Please Try Again!"); return;
    } finally {
      isLoading = false;
    }
  }

  const handleOtherCarOrUserClick = async (e: MouseEvent, type: string) => {
    const button = e.currentTarget as HTMLButtonElement;
    const id = button.id;
    if ($user_store.userId === id) { add_toast("error", "This is your Profile!"); return; }
    try {
      isLoading = true;
      const result = await call_cloud_function(CloudFunctions.GET_ANOTHER_GARAGE_DATA, { searchUserId: id });
      const userresult = await call_cloud_function(CloudFunctions.GET_ANOTHER_USER_PROFILE, { searchUserId: id} );
      if (result?.isError || userresult?.isError) { add_toast("error", "Server Error! Please Try Again!"); return; }
      $other_all_cars_store = result?.result.data.cars;
      $other_user_store = userresult?.result.data;
      if ($navigating?.type === "popstate" || $navigating?.type === "link") return;
      if (type === "car") goto(`/garage/other`);
      else if (type === "user") goto(`/user/other`);
    } catch (err) {
      add_toast("error", "Server Error! Please Try Again!"); return;
    } finally {
      isLoading = false;
    }
  }

  const handleEventClick = async (e: MouseEvent) => {
    const button = e.currentTarget as HTMLButtonElement;
    const id = button.id;
    console.log(id);
    const currentEventIndex = $all_result_list.findIndex(event => event.eventId === id);
    if ($all_result_list.length > 0) goto(`/events/all/${currentEventIndex + 1}`);
    // else {
    //   try {
    //     isLoading = true;
    //     const allResults = await call_cloud_function(CloudFunctions.GET_EVENTS, $allEventData);
    //     if (allResults?.isError) {
    //       return handleServerSideError("Error Loading Data! Try Again!");
    //     } else {
    //       $all_result_list = allResults?.result.data.events;
    //       $allHasMore = allResults?.result.data.hasMore;
    //       $allEventData = { ...$allEventData, startAfter: allResults?.result.data.startAfter };
    //     }
    //   }
    // }
  }

  onMount(() => {
    $other_all_cars_store = [default_car];
    searchRef.focus();
  });

  afterNavigate(({type}) => {
    
    current = false;
  })

  $: if (browser) {
    results = $resultList;

    const observer: IntersectionObserver = new IntersectionObserver(async (entries) => {
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

<div class="bg-[#181818] w-screen flex flex-col items-center text-white">
  <h1 class="text-2xl md:text-4xl mt-28 md:mt-32">Search</h1>
  <div class="bg-[#333740] flex justify-evenly rounded-xl w-11/12 md:w-2/5 text-lg md:text-xl py-2 md:py-3 px-4 mt-8">
    <button class={selectedOption === "people" ? "bg-[#d9d9d94d] flex-[0_0_30%] rounded-lg py-1" : "flex-[0_0_30%] py-1"} on:click={() => handleOptionChange("people")}>People</button>
    <button class={selectedOption === "cars" ? "bg-[#d9d9d94d] flex-[0_0_30%] rounded-lg py-1" : "flex-[0_0_30%] py-1"} on:click={() => handleOptionChange("cars")}>Vehicles</button>
    <button class={selectedOption === "events" ? "bg-[#d9d9d94d] flex-[0_0_30%] rounded-lg py-1" : "flex-[0_0_30%] py-1"} on:click={() => handleOptionChange("events")}>Events</button>
  </div>
  <div class="bg-[#333740] flex items-center w-11/12 md:w-2/3 py-2 px-4 rounded-xl text-xl leading-8 mt-4 md:mt-8">
    <img class="w-4 md:w-5 h-4 md:h-5" src="/searchicon.svg" alt="Search Icon">
    <input class="bg-[#333740] text-base w-full ml-2 focus:outline-none" bind:this={searchRef} bind:value={$searchData.searchKeyword} on:keyup={(e) => { if (e.key === "Enter") handleSearch() }} on:change={handleKeywordChange} type="text" name="search" placeholder="Search people, vehicles, or events">
  </div>
  {#if selectedOption === "people"}
    <div transition:fade class="flex flex-col w-11/12 md:w-2/3 mt-12">
      {#if isLoading}
        <Loading />
      {:else}
        {#each results as result}
          <button id={result.data.userId} class="bg-[#333740b3] flex justify-start items-center w-full rounded-lg p-4 mb-6" on:click={(e) => { handleOtherCarOrUserClick(e, "user"); } }>
            <div class="flex flex-1 items-center">
              <img class="mr-4 w-4 h-4" src="/search-user-icon.svg" alt="User Icon">
              <img class="rounded-full w-10 h-10 md:w-14 md:h-14 mr-4" src={result.data.userPhoto ? result.data.userPhoto : "/default-photo.svg"} alt="Profile">
              <p class="text-sm md:text-lg font-medium mr-12">{result.data.name}</p>
            </div>
            <div class="flex-1 text-left w-full">@{result.data.userName}</div>
          </button>
        {/each}
      {/if}
    </div>
  {:else if selectedOption === "cars"}
    {#if isLoading}
      <Loading />
    {:else}
      <div transition:fade class="flex flex-wrap w-11/12 md:w-2/3 mt-12">
        {#each results as result}
          <button id={result.data.userId} class="bg-[#333740] flex flex-col justify-center items-center w-full md:w-1/2 lg:w-1/3 rounded-xl" on:click={(e) => { handleOtherCarOrUserClick(e, "car"); } }>
            <div class="flex items-center mt-1">
              <img class="w-8 h-6 mr-1" src={result.data.vehicleType ? vehicleIcons[result.data.vehicleType] : vehicleIcons["car"]} alt="Vehicle Type">
              <p>{result.data.name}</p>
            </div>
            <img class="w-56 h-36 rounded-lg mt-2" src={result.data.coverPhoto ? result.data.coverPhoto : "/default-photo.svg"} alt="Vehicle Cover">
            <div class="flex justify-center mt-2">
              <p class="mx-1 text-sm">{result.data.year}</p>
              <p class="mx-1 text-sm">{result.data.make}</p>
              <p class="mx-1 text-sm">{result.data.model}</p>
            </div>
            <div class="flex justify-centere mt-4 mb-2">
              <img class="mx-1" src="/search-user-icon.svg" alt="User Icon">
              <p class="mx-1">@{result.data.userName}</p>
            </div>
          </button>
        {/each}
      </div>
    {/if}
  {:else if selectedOption === "events"}
    {#if isLoading}
      <Loading />
    {:else}
      <div transition:fade class="flex flex-wrap justify-between w-11/12 md:w-2/3 mt-12">
        {#each results as result}
          <button id={result.id} class="bg-[#333740] flex flex-col w-full md:w-1/2 lg:w-1/3 rounded-xl" on:click={handleEventClick}>
            <img class="w-full h-80 rounded-xl" src={result.data.eventPhoto} alt="Event Cover">
            <p class="text-2xl text-left my-2 mx-3">{result.data.eventName}</p>
            <p class="text-left my-2 mx-3">{new Date(result.data.eventStartTime).toDateString()} | {new Date(result.data.eventStartTime).toLocaleTimeString()}</p>
            <p class="text-lg text-left my-2 mx-3">{result.data.eventAddress}</p>
          </button>
        {/each}
      </div>
    {/if}
  {/if}
  <div bind:this={root}></div>
</div>
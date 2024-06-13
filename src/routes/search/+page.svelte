<script lang="ts">
  import { onMount, onDestroy } from "svelte";
  import { writable } from "svelte/store";
  import { fade } from "svelte/transition";
  import { browser } from "$app/environment";
  import { goto } from "$app/navigation";
  import { navigating } from "$app/stores";
  import { CloudFunctions } from "$lib/functions/all";
  import { call_cloud_function } from "$lib/functions/util";
  import { add_toast, other_user_store, user_store } from "$lib/stores/auth";
  import { default_car, other_all_cars_store } from "$lib/stores/car";
  import { all_result_list } from "$lib/stores/events";
  import Loading from "../../components/Loading.svelte";

  const search_data = writable<{searchKeyword: string, batchSize: number, startAfter: string | null, afterDateEvent?: number }>({ searchKeyword: "", batchSize: 6, startAfter: null });
  const has_more = writable<boolean>(false);
  const result_list = writable<any>([]);
  const all_events_data = writable<{batchSize: number, startAfter: string | null, afterDateEvent: number }>({ batchSize: 9, startAfter: null, afterDateEvent: Date.now() });
  const all_events_has_more = writable<boolean>(false);

  const vehicle_icons: any = { bike: "/bike.svg", car: "/car.svg", truck: "/truck.svg" }
  let is_loading: boolean = false;
  let root: any;
  let selected_option = "people";
  let search_ref: HTMLInputElement;

  const handle_option_change = (option: string) => {
    selected_option = option;
    $search_data = { ...$search_data, startAfter: null };
    $result_list = [];
  }

  const handle_keyword_change = () => {
    $search_data = { ...$search_data, startAfter: null };
    $result_list = [];
  }

  const get_cloud_function = (option: string): any => {
    if (option === "people") return CloudFunctions.SEARCH_USER_PROFILES;
    if (option === "cars") return CloudFunctions.SEARCH_CAR_PROFILES;
    if (option === "events") {
      $search_data = { ...$search_data, afterDateEvent: Date.now() };
      return CloudFunctions.SEARCH_EVENTS;
    }
  }

  const handle_search = async () => {
    if ($search_data.searchKeyword === "") { add_toast("error", "Search Keyword cannot be Empty!"); return; }
    try {
      is_loading = true;
      const result = await call_cloud_function(get_cloud_function(selected_option), $search_data);
      if (result?.isError) { add_toast("error", "Server Error! Please Try Again!"); return; }
      $has_more = result?.result.data.has_more;
      $search_data.startAfter = result?.result.data.startAfter;
      $result_list = $result_list.concat(result?.result.data[selected_option]);
    } catch (err) {
      add_toast("error", "Server Error! Please Try Again!"); return;
    } finally {
      is_loading = false;
    }
  }

  const handle_other_car_or_user_click = async (e: MouseEvent, type: string) => {
    const button = e.currentTarget as HTMLButtonElement;
    const id = button.id;
    if ($user_store.userId === id) { add_toast("error", "This is your Profile!"); return; }
    try {
      is_loading = true;
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
      is_loading = false;
    }
  }

  const handle_event_click = async (e: MouseEvent) => {
    const button = e.currentTarget as HTMLButtonElement;
    const id = button.id;

    const current_event_index = $all_result_list.findIndex((event: any) => event.eventId === id);
    if ($all_result_list.length > current_event_index) goto(`/events/all/${current_event_index + 1}`);
    else {
      try {
        is_loading = true;
        const all_results = await call_cloud_function(CloudFunctions.GET_EVENTS, $all_events_data);
        if (all_results?.isError) {
          add_toast("error", "Error Loading Data! Try Again!");
        } else {
          $all_result_list = all_results?.result.data.events;
          $all_events_has_more = all_results?.result.data.hasMore;
          $all_events_data = { ...$all_events_data, startAfter: all_results?.result.data.startAfter };
          if ($navigating?.type === "popstate" || $navigating?.type === "link") return;
          const event_index = $all_result_list.findIndex((event: any) => event.eventId === id);
          if ($all_result_list > event_index) goto(`/events/all/${event_index + 1}`);
          else add_toast("error", "Error Loading data! Try Again!");
        }
      } catch (err) {
        add_toast("error", "Server Error! Please Try Again!");
      } finally {
        is_loading = false;
      }
    }
  }

  onMount(() => {
    $other_all_cars_store = [default_car];
    search_ref.focus();
  });

  $: if (browser) {
    const observer: IntersectionObserver = new IntersectionObserver(async (entries) => {
      for (const entry of entries) {
        if (entry.isIntersecting) {
          observer.disconnect();
          handle_search();
        }
      };
    });
  
    if ($has_more) observer.observe(root);

    onDestroy(() => observer.disconnect());
  }
</script>

<div class="bg-[#181818] w-screen flex flex-col items-center text-white">
  <h1 class="text-2xl md:text-4xl mt-28 md:mt-32">Search</h1>
  <div class="bg-[#333740] flex justify-evenly rounded-xl w-11/12 md:w-2/5 text-lg md:text-xl py-2 md:py-3 px-4 mt-8">
    <button class={selected_option === "people" ? "bg-[#d9d9d94d] flex-[0_0_30%] rounded-lg py-1" : "flex-[0_0_30%] py-1"} on:click={() => handle_option_change("people")}>People</button>
    <button class={selected_option === "cars" ? "bg-[#d9d9d94d] flex-[0_0_30%] rounded-lg py-1" : "flex-[0_0_30%] py-1"} on:click={() => handle_option_change("cars")}>Vehicles</button>
    <button class={selected_option === "events" ? "bg-[#d9d9d94d] flex-[0_0_30%] rounded-lg py-1" : "flex-[0_0_30%] py-1"} on:click={() => handle_option_change("events")}>Events</button>
  </div>
  <div class="bg-[#333740] flex items-center w-11/12 md:w-2/3 py-2 px-4 rounded-xl text-xl leading-8 mt-4 md:mt-8">
    <img class="w-4 md:w-5 h-4 md:h-5" src="/searchicon.svg" alt="Search Icon">
    <input class="bg-[#333740] text-base w-full ml-2 focus:outline-none" bind:this={search_ref} bind:value={$search_data.searchKeyword} on:keyup={(e) => { if (e.key === "Enter") handle_search() }} on:change={handle_keyword_change} type="text" name="search" placeholder="Search people, vehicles, or events">
  </div>
  {#if selected_option === "people"}
    <div transition:fade class="flex flex-col w-11/12 md:w-2/3 mt-12">
      {#if is_loading}
        <Loading />
      {:else}
        {#each $result_list as result}
          <button id={result.data.userId} class="bg-[#333740b3] flex justify-start items-center w-full rounded-lg p-4 mb-6" on:click={(e) => { handle_other_car_or_user_click(e, "user"); } }>
            <div class="flex flex-1 items-center">
              <img class="mr-4 w-4 h-4" src="/search-user-icon.svg" alt="User Icon">
              <img class="rounded-full w-10 h-10 md:w-14 md:h-14 mr-4" src={result.data.userPhoto || "/default-photo.svg"} alt="Profile">
              <p class="text-sm md:text-lg font-medium mr-12">{result.data.name}</p>
            </div>
            <div class="flex-1 text-left w-full">@{result.data.userName}</div>
          </button>
        {/each}
      {/if}
    </div>
  {:else if selected_option === "cars"}
    {#if is_loading}
      <Loading />
    {:else}
      <div transition:fade class="flex flex-wrap w-11/12 md:w-2/3 mt-12">
        {#each $result_list as result}
          <button id={result.data.userId} class="bg-[#333740] flex flex-col justify-between items-center m-2 w-full md:w-1/2 lg:w-1/3 rounded-xl" on:click={(e) => { handle_other_car_or_user_click(e, "car"); } }>
            <div class="flex items-center mt-1">
              <img class="w-8 h-6 mr-1" src={result.data.vehicleType ? vehicle_icons[result.data.vehicleType] : vehicle_icons["car"]} alt="Vehicle Type">
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
  {:else if selected_option === "events"}
    {#if is_loading}
      <Loading />
    {:else}
      <div transition:fade class="flex flex-wrap justify-start gap-4 w-11/12 md:w-2/3 mt-12">
        {#each $result_list as event}
          <button id={event.id} class="bg-[#333740] flex flex-col w-full md:w-1/2 lg:w-1/3 rounded-xl" on:click={handle_event_click}>
            {#if event.data.eventPhoto}
              <img class="w-full h-full rounded-xl" src={event.data.eventPhoto} alt="Event Cover" />
            {:else}
              <img class="w-full h-full rounded-xl" src="/default-event.svg" alt="Event Cover" />
            {/if}
            <p class="text-2xl text-left my-2 mx-3">{event.data.eventName}</p>
            <p class="text-left my-2 mx-3">{new Date(event.data.eventStartTime).toDateString()} | {new Date(event.data.eventStartTime).toLocaleTimeString()}</p>
            <p class="text-lg text-left my-2 mx-3">{event.data.eventAddress}</p>
          </button>
        {/each}
      </div>
    {/if}
  {/if}
  <div bind:this={root}></div>
</div>
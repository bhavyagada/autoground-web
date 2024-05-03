<script lang="ts">
  import { CloudFunctions } from "$lib/functions/all";
  import { callCloudFunction } from "$lib/functions/util";
  import { addToast } from "$lib/stores/auth";
  import { onMount } from "svelte";
  import { writable } from "svelte/store";
  import Loading from "../../../../../components/Loading.svelte";
  import { page } from "$app/stores";
  import { bookedResultList } from "$lib/stores/events";
  import { browser } from "$app/environment";
  import { goto } from "$app/navigation";

  interface EventAnnouncement {
    id: string,
    title: string,
    description: string,
    created: number,
    createdBy: string
  }
  const announcementData = writable<EventAnnouncement[]>([]);

  const { eventId } = $page.params;
  const id = Number(eventId) - 1;
  if (browser) {
    if (id < 0 || id >= $bookedResultList.length) goto("/events");
  }
  let isLoading: boolean = false;

  const handleServerSideError = (errorMessage: string): boolean => {
    addToast("error", errorMessage);
    isLoading = false;
    return false;
  };

  const getAnnouncements = async () => {
    try {
      isLoading = true;
      const results = await callCloudFunction(CloudFunctions.GET_EVENT_ANNOUNCEMENTS, { eventId: $bookedResultList[id].eventId });
      if (results?.isError) return handleServerSideError("Error Loading Data! Try Again!");
      else {
        $announcementData = results?.result.data.announcements;;
        isLoading = false;
        return true;
      }
    } catch (err) {
      return handleServerSideError("Server Error! Please Try Again!");
    }
  }

  onMount(() => (async () => await getAnnouncements())() );
</script>

<div class="background">
  <h1>Event Announcements</h1>
  {#if isLoading}
    <Loading />
  {:else}
    {#if $announcementData.length > 0}
      <div class="results">
        {#each $announcementData as announcement, index}
          <div id={String(index+1)} class="announcement">
            <p>{announcement.title}</p>
            <p>{announcement.description}</p>
            <p class="date">{new Date(announcement.created).toDateString()}, {new Date(announcement.created).toLocaleTimeString()}</p>
          </div>
        {/each}
      </div>
    {:else}
      <p class="no-announcement">No new announcements!</p>
    {/if}
  {/if}
</div>

<style>
  .background {
    background-color: black;
    color: white;
    width: 100vw;
    min-height: 100vh;
    display: flex;
    flex-direction: column;
    align-items: center;
    overflow: auto;
  }
  h1 {
    font-size: 1.75rem;
    line-height: 2rem;
    margin-top: 8rem;
    margin-bottom: 2rem;
  }
  .no-announcement {
    font-size: 1.25rem;
    line-height: 2rem;
    margin-top: 4rem;
  }
  .results {
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items: center;
    width: 100%;
    min-height: 100vh;
  }
  .results .announcement {
    background-color: rgb(70, 70, 70);
    width: 75%;
    margin: 1rem 0;
    border-radius: 0.75rem;
    display: flex;
    flex-direction: column;
    justify-content: center;
  }
  .results .announcement > * {
    margin: 0.5rem;
  }
  .results .announcement .date {
    align-self: flex-end;
  }
</style>
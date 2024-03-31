<script lang="ts">
  export let selected: string;
  export let result: any;
  let resultList: any;
  $: if (selected === "all") {
    resultList = result;
  } else if (selected === "booked") {
    resultList = result.eventDescription;
  }
</script>

<div>
  <img alt="Event" src={resultList.eventPhoto || "/default-event.svg"}>
  <h1>{resultList.eventName}</h1>
  <p>{new Date(resultList.date).toDateString()} | {new Date(resultList.date).toLocaleTimeString()}</p>
  <p>{resultList.eventAddress || "Address Coming Soon"}</p>
  {#if resultList.tickets[0].freeTicket}
    <p class="free">Free</p>
  {:else}
    <p>From ${resultList.tickets[0].price}</p>
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
  }
  div h1 {
    font-size: 1.25rem;
    font-weight: 500;
    margin-top: 0.5rem;
  }
  .free {
    color: rgb(57, 181, 74);
  }
</style>
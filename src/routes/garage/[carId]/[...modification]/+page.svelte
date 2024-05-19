<script lang="ts">
  import { page } from "$app/stores";
  import { all_cars_store } from "$lib/stores/car";
  import AddModification from "../../../../components/AddModification.svelte";
  import type { CarData, CarModificationData } from "$lib/types";

  const { carId, modification } = $page.params;
  const id = Number(carId);
  console.log(`modification clicked: ${modification}`);

  const modificationIcons: any = {
    "Power": "/power-icon.svg",
    "Exterior": "/exterior-icon.svg",
    "Interior": "/interior-icon.svg",
    "Wheels/Suspension": "/wheels-icon.svg"
  }

  let add: boolean = false;
  let thisCar: CarData = $all_cars_store[id-1];
  let mods: CarModificationData[] = [];

  $: thisCarMods = thisCar.modifications ? thisCar.modifications : [];
  $: mods = thisCarMods.filter(m => m.category === modification);
</script>

{#if add}
  <svelte:component this={AddModification} bind:add />
{:else}
  <div class="background">
    <div class="heading">
      <button class="back" on:click={() => history.back()}>
        <img src="/back-icon.svg" alt="Back Icon">
        Back to Car details
      </button>
      <h1>{modification}</h1>
    </div>
    <div class="category">
      <div class="category-totalmods">
        <img src={modificationIcons[modification]} alt="{modification} Modification Icon">
        <p class="totalmods">{thisCarMods.filter(m => m.category === modification).length} Modifications</p>
      </div>
      <div class="points">
        <p>{thisCarMods.filter(m => m.category === modification).reduce((sum, item) => sum + (item.points ? item.points : 0), 0)} Points</p>
      </div>
    </div>
    <div class="category-list">
      {#each mods as mod}
        <div class="mod">
          <p>{mod.part}</p>
          <p>{mod.brand}</p>
          <p>{mod.points} Points</p>
        </div>
        <hr>
      {/each}
    </div>
    <button class="submit" type="submit" on:click={() => add = true}>+ Add Modification</button>
  </div>
{/if}

<style>
  .background {
    background-color: rgb(24, 24, 24);
    color: white;
    width: 100vw;
    height: 100vh;
    position: absolute;
    display: flex;
    flex-direction: column;
    justify-content: space-evenly;
    z-index: 1;
  }
  .back {
    display: flex;
    align-items: center;
    margin-left: 1rem;
  }
  .back img {
    margin-right: 0.5rem;
    width: 30px;
    height: 30px;
  }
  h1 {
    font-size: 1.5rem;
    line-height: 2rem;
    text-align: center;
  }
  .category {
    display: flex;
    justify-content: space-between;
    align-items: center;
    align-self: center;
    width: 75%;
    border: 1px solid white;
    border-radius: 0.5rem;
    padding: 0.75rem 0.5rem;
    margin: 0.5rem;
  }
  .category .category-totalmods {
    display: flex;
    align-items: center;
  }
  .category-totalmods img, .category .points {
    margin: 0 0.5rem;
  }
  .category-list {
    align-self: center;
    width: 75%;
  }
  .mod {
    display: flex;
    justify-content: space-between;
    align-items: center;
    align-self: center;
    font-size: 1.125rem;
    line-height: 2rem;
    margin: 0.75rem 0;
  }
  .submit {
    background-color: white;
    color: black;
    border-radius: 0.5rem;
    line-height: 2rem;
    font-size: 1.25rem;
    width: 90%;
    align-self: center;
  }
  @media all and (min-width: 1200px) {
    .submit {
      width: 30%;
    }
  }
</style>
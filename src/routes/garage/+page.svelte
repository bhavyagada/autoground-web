<script lang="ts">
  import { goto } from "$app/navigation";
  import { cloudFunctions } from "$lib/functions/all";
  import { callFunction } from "$lib/functions/util";
  import { addToast } from "$lib/stores/auth";
  import { carStore } from "$lib/stores/car";
  import { onMount } from "svelte";
  import Loading from "../../components/Loading.svelte";

  let isLoading: boolean = true;
  let coverPhotos: Array<string | null> = [];
  let photosLength: number;
  let years: Array<number | null> = [];
  let makes: Array<string | null> = [];
  let models: Array<string | null> = [];
  let modificationCounts: Array<number | undefined> = [];
  let points: Array<number | null> = [];
  let index: number = 0;

  onMount(() => {
    const getGarageData = async () => {
      try {
        const result = await callFunction(cloudFunctions.GET_GARAGE_DATA, {});
        console.log(result);
        if (result) {
          isLoading = false;
          if (result.isError) {
            addToast("error", "Server Error! Try reloading the page!");
          } else {
            $carStore = result.result.data.cars;
            $carStore.forEach(car => coverPhotos.push(car.coverPhoto));
            $carStore.forEach(car => years.push(car.year));
            $carStore.forEach(car => makes.push(car.make));
            $carStore.forEach(car => models.push(car.model));
            $carStore.forEach(car => modificationCounts.push(car.modifications?.length));
            $carStore.forEach(car => points.push(car.points));
            console.log(`cover photos ${coverPhotos}`);
            photosLength = coverPhotos.length;
            console.log(`cover photos length ${photosLength}`);
            sessionStorage.setItem("user", JSON.stringify($carStore));
          }
        }
      } catch (err) {
        isLoading = false;
        addToast("error", "Server Error! Try reloading the page!");
      }
    }
    getGarageData();
  });

  const onPrev = () => {
    index = index > 0 ? index - 1 : photosLength - 1;
    console.log(`prev index ${index}`);
  }

  const onNext = () => {
    index = index < photosLength - 1 ? index + 1 : 0;
    console.log(`next index ${index}`);
  }
</script>

<div class="background mygarage">
  {#if isLoading}
    <Loading />
  {:else}
    <div class="car-container">
      <div class="carwitharrows">
        <button class="arrow" on:click={onPrev}><img src="/chevron-left.svg" alt="Left Arrow" class="lefticon"></button>
        <img src={coverPhotos[index]} alt="My Garage Example Car" class="car">
        <button class="arrow" on:click={onNext}><img src="/chevron-right.svg" alt="Right Arrow" class="righticon"></button>
      </div>
      <div class="car-details">
        <p class="car-name">{years[index]} {makes[index]} {models[index]}</p>
        <div class="stats">
          <p>{modificationCounts[index] === 1 ? modificationCounts[index] + " Modification" : modificationCounts[index] + " Modifications"}</p>
          <p>{points[index]} points</p>
        </div>
      </div>
    </div>
    <button on:click|preventDefault={() => goto("garage/add")}>+ Add Vehicle</button>
  {/if}
</div>

<style>
  button {
    background-color: black;
    border: 1px solid white;
    border-radius: 1rem;
    padding: 0.5rem 3rem;
    margin-bottom: auto;
  }
  .background {
    width: var(--bgwidth);
    height: var(--bgheight);
    position: relative;
    z-index: 1; 
    color: white;
  }
  .mygarage {
    background: var(--homebg3) center / var(--bgsize) var(--bgrepeat);
    display: flex;
    flex-direction: column;
    justify-content: space-evenly;
    align-items: center;
    height: 100vh;
  }
  .car-container {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    width: 100%;
    height: 75%;
  }
  .carwitharrows {
    display: flex;
    justify-content: center;
    height: 50%;
  }
  .arrow {
    background: none;
    border: none;
    padding: 0;
    margin: 0;
  }
  .car {
    width: 85%;
    height: 85%;
    align-self: flex-end;
  }
  .lefticon, .righticon {
    width: 1.25rem;
    height: 1.25rem;
    align-self: center;
  }
  .car-name {
    font-size: 1.25rem;
    line-height: 2rem;
  }
  .car-details {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    width: 100%;
  }
  .stats {
    display: flex;
    justify-content: space-evenly;
    font-size: 1.125rem;
    width: 100vw;
  }
  @media all and (min-width: 700px) {
    .car-container {
      width: 100vw;
      height: 50%;
      margin-top: auto;
      justify-content: space-evenly;
    }
    .carwitharrows {
      width: 50%;
      justify-content: space-between;
    }
    .car {
      max-width: 320px;
      max-height: 240px;
      width: auto;
      height: auto;
      aspect-ratio: 4 / 3;
    }
    .lefticon, .righticon {
      width: 1.5rem;
      height: 1.5rem;
      margin-bottom: 4rem;
    }
    .car-name {
      font-size: 1.5rem;
    }
    .car-details {
      width: 40%;
    }
    .stats {
      width: 60%;
    }
  }
</style>

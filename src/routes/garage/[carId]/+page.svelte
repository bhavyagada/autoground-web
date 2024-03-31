<script lang="ts">
  import { goto } from "$app/navigation";
  import { page } from "$app/stores";
  import { allCarsStore, carStore, defaultCar } from "$lib/stores/car";
  import EditVehicle from "../../../components/EditVehicle.svelte";
  import type { CarData } from "$lib/types";
  import bikeParts from "/src/data/bikeParts.json";
  import carParts from "/src/data/carParts.json";
  import truckParts from "/src/data/truckParts.json";
  import { browser } from "$app/environment";

  if (browser) {
    if ($allCarsStore.length === 0) goto("/garage");
  }
  let edit: boolean = false;
  const { carId } = $page.params;
  const id = Number(carId);
  console.log(`car id: ${carId}`);

  let thiscar: CarData = $allCarsStore[id-1] !== undefined ? $allCarsStore[id-1] : defaultCar;
  let photos: any = thiscar.photos !== undefined ? $allCarsStore[id-1] : [];
  console.log("this car after edit nav: ", thiscar);
  $: thiscar = $allCarsStore[id-1] !== undefined ? $allCarsStore[id-1] : defaultCar;
  $: photos = thiscar.photos !== undefined ? thiscar.photos : [];
  console.log(photos);

  const parts = {
    "bike": bikeParts,
    "car": carParts,
    "truck": truckParts
  }
  const modificationIcons: any = {
    "Power": "/power-icon.svg",
    "Exterior": "/exterior-icon.svg",
    "Interior": "/interior-icon.svg",
    "Wheels/Suspension": "/wheels-icon.svg"
  }
  const modifications = parts[thiscar.vehicleType];
  const categories = Object.keys(modifications["Categories"]);

  const handleModification = (modification: string) => {
    goto(`/garage/${carId}/${modification}`);
  }

  const handleCarEdit = () => {
    $carStore = $allCarsStore[id-1];
    edit = true;
  }
</script>

{#if edit}
  <svelte:component this={EditVehicle} bind:edit />
{:else}
  <div class="background">
    <div class="photos">
      <img src={thiscar.coverPhoto} alt="Cover">
      {#each photos as photo}
        <img src={photo} alt="Car">
      {/each}
    </div>
    <div class="banner">
      <div class="carname">
        <p>{thiscar.name}</p>
        <p>{thiscar.year} {thiscar.make} {thiscar.model}</p>
      </div>
      <div class="not-name">
        <div class="modifications">
          <img src="/modifications-icon.svg" alt="Modification Icon">
          <p>{thiscar.modifications?.length} Modifications</p>
        </div>
        <div class="points">
          <img src="/points-icon.svg" alt="Points Icon">
          <p>{thiscar.points} Points</p>
        </div>
        <img class="qrcode" alt="Username QR Code" src="https://api.qrserver.com/v1/create-qr-code/?size=150x150&data={thiscar.userName}">
      </div>
    </div>
    <div class="modification-container">
      {#each categories as category}
        <button class="category" on:click={() => handleModification(category)}>
          <div class="category-totalmods">
            <img src={modificationIcons[category]} alt="{category} Modification Icon">
            <p class="type">{category} | </p>
            <p class="totalmods">{thiscar.modifications?.filter(m => m.category === category).length} Modifications</p>
          </div>
          <div class="points">
            <p>{thiscar.modifications?.filter(m => m.category === category).reduce((sum, item) => sum + (item.points ? item.points : 0), 0)} Points</p>
          </div>
        </button>
      {/each}
    </div>
    <button class="submit" type="submit" on:click={handleCarEdit}>Edit</button>
  </div>
{/if}

<style>
  .background {
    background-color: rgb(24, 24, 24);
    width: 100vw;
    height: 100vh;
    position: absolute;
    display: flex;
    flex-direction: column;
    justify-content: space-evenly;
    z-index: 1;
  }
  .photos {
    display: flex;
    justify-content: center;
    align-items: center;
    margin-top: 5rem;
  }
  .photos img {
    width: 200px;
    height: 125px;
    border-radius: 1rem;
  }
  .banner {
    color: white;
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    margin: 0.5rem;
    width: 90%;
    align-self: center;
  }
  .banner .carname {
    display: flex;
    flex-direction: column;
  }
  .not-name {
    display: flex;
  }
  .banner .modifications, .banner .points {
    display: flex;
    flex-direction: column;
    align-items: center;
    margin: 0 1.25rem;
  }
  .banner .qrcode {
    width: 75px;
    height: 75px;
    margin-left: 1.25rem;
  }
  .modification-container {
    display: flex;
    flex-direction: column;
    justify-content: space-evenly;
    align-items: center;
    width: 100%;
    color: white;
  }
  .category {
    display: flex;
    justify-content: space-between;
    align-items: center;
    width: 90%;
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
  .category-totalmods .type {
    margin: 0 0.25rem; 
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
  @media all and (min-width: 700px) {
    .carname {
      width: 20%;
    }
    .banner {
      align-items: center;
    }
    .banner .modifications, .banner .points {
      flex-direction: row;
    }
    .banner .modifications img {
      margin-right: 0.5rem;
    }
    .banner .points img {
      margin-right: 0.25rem;
    }
    .banner .qrcode {
      width: 65px;
      height: 65px;
    }
  }
  @media all and (min-width: 1200px) {
    .photos {
      justify-content: space-evenly;
    }
    .photos img {
      width: 360px;
      height: 210px;
      border-radius: 1rem;
    }
    .banner {
      width: 75%;
      padding: 0 4rem;
    }
    .carname p:last-child {
      font-size: 1.25rem;
    }
    .modification-container {
      flex-direction: row;
      flex-wrap: wrap;
      align-self: center;
      width: 75%;
    }
    .category {
      flex: 35%;
      margin: 1rem 4rem;
    }
    .submit {
      width: 30%;
    }
  }
</style>
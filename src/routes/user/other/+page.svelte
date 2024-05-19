<script lang="ts">
  import { other_user_store } from "$lib/stores/auth";
  import { other_all_cars_store } from "$lib/stores/car";
  import { fade } from "svelte/transition";
  
  const vehicleIcons: any = {
    bike: "/bike.svg",
    car: "/car.svg",
    truck: "/truck.svg"
  }
</script>

<div class="bg-[#181818] flex flex-col items-center w-screen h-screen text-white ">
  <div class="flex flex-col md:flex-row justify-center items-center w-full md:w-1/2 xl:w-1/3 2xl:w-1/4 mt-32">
    <img class="w-16 h-16 rounded-full" alt="Profile" src={$other_user_store.userPhoto}>
    <div class="flex justify-evenly md:justify-between w-full my-4">
      <div class="md:ml-4">
        <p class="text-lg font-bold md:py-1">{$other_user_store.name}</p>
        <p class="text-white/60 md:py-1">@{$other_user_store.userName}</p>
      </div>
      <div class="flex justify-center items-center md:mr-4">
        <img class="w-6 h-6 self-center mr-2" alt="Points Icon" src="/points-icon.svg">
        <p>{$other_user_store.points} points</p>
      </div>
    </div>
    <img class="qr" alt="Username QR Code" src="https://api.qrserver.com/v1/create-qr-code/?size=150x150&data={$other_user_store.userName}">
  </div>
  <!-- .vehicles {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    width: 95%;
    margin-top: 3rem;
  } -->
  <div class="vehicles">
    <h1 class="text-2xl">Vehicles</h1>
    <div transition:fade class="vehicle-results-container">
      {#each $other_all_cars_store as result}
        <div id={result.userId} class="vehicle-results">
          <div class="car-name">
            <img src={result.vehicleType ? vehicleIcons[result.vehicleType] : vehicleIcons["car"]} alt="Vehicle Type">
            <p>{result.name}</p>
          </div>
          <img class="cover-photo" src={result.coverPhoto ? result.coverPhoto : "/default-photo.svg"} alt="Vehicle Cover">
          <div class="car-make">
            <p>{result.year}</p>
            <p>{result.make}</p>
            <p>{result.model}</p>
          </div>
          <div class="car-modification">
            <img src="/modifications-icon.svg" alt="Modifications Icon">
            <p class="name">{result.modifications?.length} Modifications</p>
          </div>
          <div class="points">
            <img alt="Points Icon" src="/points-icon.svg">
            <p>{$other_user_store.points} points</p>
          </div>
        </div>
      {/each}
    </div>
  </div>
</div>

<style>
  /* .vehicles {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    width: 95%;
    margin-top: 3rem;
  } */
  .vehicle-results-container {
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
  .car-make, .car-modification {
    display: flex;
    justify-content: center;
  }
  .car-make p, .car-modification > * {
    margin: 0 0.25rem;
  }
  .car-make p {
    font-size: 0.875rem;
  }
  .car-make {
    margin-top: 0.25rem;
  }
  .car-modification {
    margin-top: 1rem;
    margin-bottom: 0.5rem;
  }
  .car-modification img {
    width: 20px;
    height: 20px;
  }
  .qr {
    width: 65px;
    height: 65px;
  }
  @media all and (min-width: 900px) {
    .vehicles {
      width: 90%;
    }
    .vehicle-results-container {
      justify-content: space-evenly;
    }
    .vehicle-results {
      width: 30%;
    }
  }
  @media all and (min-width: 1200px) {
    h1 {
      margin: 0;
    }
    .vehicle-results {
      padding: 0.75rem;
      width: 25%;
    }
    .vehicle-results-container {
      margin: 0;
    }
  }
</style>
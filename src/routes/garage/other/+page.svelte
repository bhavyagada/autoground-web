<script lang="ts">
  import { otherUserStore } from "$lib/stores/auth";
  import { otherAllCarsStore } from "$lib/stores/car";
  import { fade } from "svelte/transition";
  
  const vehicleIcons: any = {
    bike: "/bike.svg",
    car: "/car.svg",
    truck: "/truck.svg"
  }
</script>
<div class="background">
  <div class="banner">
    <img class="banner-photo" alt="Profile" src={$otherUserStore.userPhoto}>
    <div class="name-username">
      <p>{$otherUserStore.name}</p>
      <p>@{$otherUserStore.userName}</p>
    </div>
    <div class="points">
      <img alt="Points Icon" src="/points-icon.svg">
      <p>{$otherUserStore.points} points</p>
    </div>
    <img class="qr" alt="Username QR Code" src="https://api.qrserver.com/v1/create-qr-code/?size=150x150&data={$otherUserStore.userName}">
  </div>
  <div class="vehicles">
    <h1>Vehicles</h1>
    <div transition:fade class="vehicle-results-container">
      {#each $otherAllCarsStore as result}
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
            <p>{$otherUserStore.points} points</p>
          </div>
        </div>
      {/each}
    </div>
  </div>
</div>

<style>
  .background {
    width: var(--bgwidth);
    height: var(--bgheight);
    background-color: rgb(24, 24, 24);
    color: white;
    width: 100vw;
    height: 100vh;
    display: flex;
    justify-content: space-evenly;
    flex-direction: column;
    align-items: center;
  }
  .banner {
    background-color: rgb(24, 24, 24);
    border-radius: 1rem;
    padding: 1rem 0;
    width: 90vw;
    display: flex;
    justify-content: space-evenly;
    align-items: center;
    position: relative;
  }
  .banner-photo {
    width: 4rem;
    height: 4rem;
    border-radius: 3rem;
    align-self: center;
  }
  .points {
    display: flex;
    flex-direction: column;
    justify-content: center;
  }
  .points img {
    width: 1.5rem;
    height: 1.5rem;
    align-self: center;
  }
  h1 {
    font-size: 1.5rem;
    line-height: 2rem;
    margin-top: 4rem;
  }
  .vehicles {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    width: 95%;
    margin-top: 3rem;
  }
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
  @media all and (min-width: 600px) {
    .background {
      display: flex;
      flex-direction: column;
      justify-content: flex-start;
      align-items: center;
    }
  }
  @media all and (min-width: 900px) {
    .banner {
      width: 50%;
      margin-top: 8rem;
    }
    .points {
      flex-direction: row;
    }
    .points > p {
      padding: 0 0.5rem;
    }
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
    .banner {
      width: 40%;
    }
    .points {
      flex-direction: row;
    }
    .points > p {
      padding: 0 0.5rem;
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
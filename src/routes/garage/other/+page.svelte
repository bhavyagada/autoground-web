<script lang="ts">
  import { other_user_store } from "$lib/stores/auth";
  import { other_all_cars_store } from "$lib/stores/car";
  import { fade } from "svelte/transition";

  const vehicle_icons: any = { bike: "/bike.svg", car: "/car.svg", truck: "/truck.svg" }
</script>

<div class="bg-[#181818] flex flex-col items-center w-screen h-screen text-white">
  <div class="flex flex-col md:flex-row justify-center items-center w-full md:w-1/2 xl:w-1/3 2xl:w-1/4 mt-32">
    <img class="w-16 h-16 rounded-full" src={$other_user_store.userPhoto} alt="Profile">
    <div class="flex justify-evenly md:justify-between w-full my-4">
      <div class="md:ml-4">
        <p class="text-lg font-bold md:py-1">{$other_user_store.name}</p>
        <p class="text-white/60 md:py-1">@{$other_user_store.userName}</p>
      </div>
      <div class="flex justify-center items-center md:mr-4">
        <img class="w-6 h-6 self-center mr-2" src="/points-icon.svg" alt="Points Icon">
        <p>{$other_user_store.points} points</p>
      </div>
    </div>
    <img class="w-16 h-16 border border-solid border-white border-8 rounded-lg" alt="Username QR Code" src="https://api.qrserver.com/v1/create-qr-code/?size=150x150&data={$other_user_store.userName}">
  </div>
  <div class="flex flex-col justify-center items-center w-11/12 mt-12">
    <h1 class="text-2xl">Vehicles</h1>
    <div transition:fade class="flex flex-wrap w-11/12 mt-10 md:justify-evenly">
      {#each $other_all_cars_store as vehicle}
        <div id={vehicle.userId} class="bg-[#333740b3] flex flex-col justify-center items-center rounded-xl w-full md:w-1/4 m-3">
          <div class="flex items-center my-1">
            <img class="w-8 h-6 mr-1" src={vehicle_icons[vehicle.vehicleType || "car"]} alt="Vehicle Type">
            <p class="text-xl font-semibold">{vehicle.name}</p>
          </div>
          <img class="w-10/12 h-40 rounded-lg my-2" src={vehicle.coverPhoto || "/default-photo.svg"} alt="Vehicle Cover">
          <div class="flex text-sm">
            <p class="mx-1">{vehicle.year}</p>
            <p class="mx-1">{vehicle.make}</p>
            <p class="mx-1">{vehicle.model}</p>
          </div>
          <div class="flex md:mr-4 my-3">
            <img class="w-5 h-5 self-center mr-2" src="/modifications-icon.svg" alt="Modifications Icon">
            <p>{vehicle.modifications?.length} Modifications</p>
          </div>
          <div class="flex md:mr-4 mb-2">
            <img class="w-6 h-6 self-center mr-2" src="/points-icon.svg" alt="Points Icon">
            <p>{$other_user_store.points} points</p>
          </div>
        </div>
      {/each}
    </div>
  </div>
</div>
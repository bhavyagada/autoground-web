<script lang="ts">
  import { goto } from "$app/navigation";
  import { base } from "$app/paths";
  import { otherAllCarsStore } from "$lib/stores/car";

  let coverPhotos: Array<string | null> = [];
  let photosLength: number;
  let years: Array<number | null> = [];
  let makes: Array<string | null> = [];
  let models: Array<string | null> = [];
  let modificationCounts: Array<number | undefined> = [];
  let points: Array<number | null> = [];
  let index: number = 0;

  console.log($otherAllCarsStore);
  $otherAllCarsStore.forEach(car => coverPhotos.push(car.coverPhoto));
  $otherAllCarsStore.forEach(car => years.push(car.year));
  $otherAllCarsStore.forEach(car => makes.push(car.make));
  $otherAllCarsStore.forEach(car => models.push(car.model));
  $otherAllCarsStore.forEach(car => modificationCounts.push(car.modifications?.length));
  $otherAllCarsStore.forEach(car => points.push(car.points));
  photosLength = coverPhotos.length;

  const onPrev = () => {
    index = index > 0 ? index - 1 : photosLength - 1;
    console.log(`prev index ${index}`);
  }

  const onNext = () => {
    index = index < photosLength - 1 ? index + 1 : 0;
    console.log(`next index ${index}`);
  }

  const handleCarClick = () => {
    goto(`/garage/other/${index+1}`);
  }
</script>

<div class="background mygarage">
  <div class="car-container">
    <div class="carwitharrows">
      <button class="arrow" on:click={onPrev}><img src="/chevron-left.svg" alt="Left Arrow" class="lefticon"></button>
      <button class="car" on:click={handleCarClick}><img src={coverPhotos[index]} alt="My Garage Example Car"></button>
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
    width: 35%;
    height: 35%;
    align-self: center;
    background: none;
    border: none;
    padding: 0;
    margin: 0;
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
      width: 60%;
    }
    .stats {
      width: 60%;
    }
  }
</style>

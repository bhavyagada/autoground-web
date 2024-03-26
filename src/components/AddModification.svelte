<script lang="ts">
  import { page } from "$app/stores";
  import { addToast } from "$lib/stores/auth";
  import { allCarsStore, allModificationStore, defaultCarModification, modificationStore } from "$lib/stores/car";
  import bikeParts from "/src/data/bikeParts.json";
  import carParts from "/src/data/carParts.json";
  import truckParts from "/src/data/truckParts.json";
  import Loading from "./Loading.svelte";
  import { callFunction } from "$lib/functions/util";
  import { cloudFunctions } from "$lib/functions/all";

  export let add: boolean = true;
  let size: string = "60"; 
  let isLoading: boolean = false;

  const { carId, modification } = $page.params;
  const id = Number(carId);
  console.log(`modification clicked: ${modification}`);

  let selectedCategory: any = "";
  let selectedPart: any = "";
  let brand: string = "";
  let selectedCategories: string[] = [];
  $: selectedCategories = [selectedCategory];
  let subCategory: any;
  let parts: any;
  const thiscar = $allCarsStore[id-1];

  const partsList = {
    "bike": bikeParts,
    "car": carParts,
    "truck": truckParts
  }

  const extractParts = (obj: any): any => {
    let parts = {};
    for (const key in obj) {
      if (key === "Parts") {
        parts = { ...parts, ...obj[key] };
      } else if (typeof obj[key] === "object") {
        selectedCategories.push(key);
        parts = { ...parts, ...extractParts(obj[key]) };
      }
    }
    return parts;
  }

  const categoryList = Object.keys(partsList[thiscar.vehicleType]["Categories"][modification]);
  const isCategoryParts = categoryList[0] === "Parts";
  const categories = categoryList;
  console.log(`categories: ${categories}`);

  $: if (isCategoryParts) {
    parts = Object.keys(extractParts(partsList[thiscar.vehicleType]["Categories"][modification]));
  } else {
    parts = Object.keys(extractParts(partsList[thiscar.vehicleType]["Categories"][modification][selectedCategory]));
  }
  $: console.log(`parts: ${JSON.stringify(parts)}`);

  $: if (selectedCategories.length > 0) {
    subCategory = selectedCategories[selectedCategories.length - 1];
  }

  $: console.log(`selected category ${selectedCategory}`);
  $: console.log(`selected part ${selectedPart}`);
  $: console.log(`entered brand name ${brand}`);
  $: console.log(`selected categories ${selectedCategories}`);

  const handleClientSideError = (errorMessage: string): boolean => {
    addToast("error", errorMessage);
    return false;
  };

  const handleServerSideError = (errorMessage: string): boolean => {
    addToast("error", errorMessage);
    isLoading = false;
    return false;
  };

  const handleAddModification = async () => {
    if (!selectedCategory) {
      return handleClientSideError("No Category Selected!");
    } else if (!selectedPart) {
      return handleClientSideError("No Part Selected!");
    }

    $modificationStore = { ...$modificationStore, category: modification, part: selectedPart, categories: selectedCategories, brand, subCategory };
    const carId = thiscar.carId;
    const vehicleType = thiscar.vehicleType;
    const carName = thiscar.name;
    const addModificationData = { carId, vehicleType, carName, modificationData: $modificationStore };
    console.log(`final modification data sent: ${addModificationData}`);
    try {
      isLoading = true;
      const result = await callFunction(cloudFunctions.ADD_MODIFICATION_IN_CAR, addModificationData);
      console.log(result);
      if (result?.isError) {
        return handleServerSideError("Server Error! Please Try Again!");
      } else {
        addToast("success", "Modification Added Successfully!");
        $allCarsStore[id-1].modifications?.push(result?.result.data);
        $allModificationStore[id-1].push($modificationStore);
        sessionStorage.setItem("cars", JSON.stringify($allCarsStore));
        sessionStorage.setItem("mods", JSON.stringify($allModificationStore));
        $modificationStore = defaultCarModification;
        isLoading = false;
        history.back();
        return true;
      }
    } catch (err) {
      return handleServerSideError("Server Error! Please Try Again!")
    }
  }
</script>

<div class="background">
  <div class="heading">
    <button class="back" on:click={() => add = false}>
      <img src="/back-icon.svg" alt="Back Icon">
      Back to Modifications
    </button>
    <h1>{modification}</h1>
  </div>
  <form>
    <div class="select-category">
      <label for="category">Select Category</label>
      <select bind:value={selectedCategory} name="category" on:change={() => selectedPart = ""} disabled={isCategoryParts}>
        {#each categories as category}
          <option value={category}>{category}</option>
        {/each}
      </select>
    </div>
    <div class="select-part">
      <label for="part">Select Part</label>
      <select bind:value={selectedPart} name="category">
        {#each parts as part}
          <option value={part}>{part}</option>
        {/each}
      </select>
    </div>
    <div class="select-brand">
      <label for="brand">Enter Brand</label>
      <input bind:value={brand} name="brand">
    </div>
  </form>
  {#if isLoading}
    <Loading {size} />
  {:else}
    <button class="submit" type="submit" on:click={handleAddModification}>Add Modification</button>
  {/if}
</div>

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
  form {
    display: flex;
    justify-content: space-evenly;
    align-self: center;
    width: 75%;
    height: 35%;
  }
  .select-category, .select-part, .select-brand {
    display: flex;
    flex-direction: column;
    margin: 0.125rem 0;
    width: 100%;
  }
  form label {
    color: white;
  }
  form select, input {
    background-color: rgb(51, 55, 64);
    color: white;
    border-radius: 0.5rem;
    padding: 0.5rem 0.5rem;
    margin: 0.125rem 0;
    width: 47%;
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
  @media all and (min-width:700px) {
    form {
      width: 75%;
    }
  }
  @media all and (min-width: 1200px) {
    form {
      width: 75%;
      align-self: center;
    }
    .select-category, .select-part, .select-brand {
      margin: 2rem 0;
      width: 90%;
    }
    form label {
      margin-bottom: 0.25rem;
      width: 90%;
    }
    form select, form input {
      padding: 0.5rem 0.5rem;
      width: 90%;
    }
    .submit {
      width: 30%;
    }
  }
</style>
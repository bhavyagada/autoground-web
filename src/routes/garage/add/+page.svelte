<script lang="ts">
  import { uploadPic } from "$lib/functions/util";

  let selectedType: any = "car";
  let vehicleImage: any = "";
  let selectedYear: any;
  let years: any = [{id: 0, text: ""}, {id: 1, text: 2024}, {id: 2, text: 2023}, {id: 2, text: 2022}];
  let selectedMake: any;
  let makes: any = [{id: 0, text: ""}, {id: 1, text: 2024}, {id: 2, text: 2023}, {id: 2, text: 2022}];
  let selectedModel: any;
  let models: any = [{id: 0, text: ""}, {id: 1, text: 2024}, {id: 2, text: 2023}, {id: 2, text: 2022}];

  $: console.log(selectedYear);
  $: console.log(selectedMake);
  $: console.log(selectedModel);

  let profilePhoto: HTMLElement;
  const handleFileUpload = () => {
    console.log("add vehicle clicked");
    profilePhoto.click();
  }

  const loadFile = async (e: any) => {
    const imageFile: any = e.target.files[0];
    vehicleImage = await uploadPic(imageFile, `UsersProfilePhoto/uid`);
    // $userStore = { ...$userStore, userPhoto };
  }
</script>

<div class="background">
  <h1>Add Vehicle to Garage</h1>
  <div class="types">
    <button class={selectedType === "car" ? "car selected" : "car"} on:click={() => selectedType = "car"}>
      <img alt="Car Icon Type" src="/car.svg">
      <p>Car</p>
    </button>
    <button class={selectedType === "truck" ? "truck selected" : "truck"} on:click={() => selectedType = "truck"}>
      <img alt="Truck Icon Type" src="/truck.svg">
      <p>Truck</p>
    </button>
    <button class={selectedType === "bike" ? "bike selected" : "bike"} on:click={() => selectedType = "bike"}>
      <img alt="Bike Icon Type" src="/bike.svg">
      <p>Bike</p>
    </button>
  </div>
  <form>
    <button on:click={handleFileUpload} class="photo">
      <input bind:this={profilePhoto} bind:value={vehicleImage} on:change={loadFile} type="file" class="hidden" name="photo" accept="image/*">
      <img alt="" src={vehicleImage}>
      <p>Add Cover Photo</p>
      <p>+</p>
    </button>
    <div class="details">
      <div class="year">
        <label for="year">Select Year</label>
        <select bind:value={selectedYear} name="year">
          {#each years as year}
            <option value={year}>
              {year.text}
            </option>
          {/each}
        </select>
      </div>
      <div class="make">
        <label for="make">Select Make</label>
        <select bind:value={selectedMake} name="make">
          {#each makes as make}
            <option value={make}>
              {make.text}
            </option>
          {/each}
        </select>
      </div>
      <div class="model">
        <label for="model">Select Model</label>
        <select bind:value={selectedModel} name="model">
          {#each models as model}
            <option value={model}>
              {model.text}
            </option>
          {/each}
        </select>
      </div>
    </div>
    <div class="nickname">
      <label for="nickname">Vehicle Nickname</label>
      <input type="text" name="nickname">
    </div>
    <input type="submit" name="submit" value="Add Vehicle">
  </form>
</div>

<style>
  h1 {
    font-size: 1.5rem;
    line-height: 2rem;
    margin-top: 5rem;
    color: white;
  }
  .background {
    background-color: rgb(24, 24, 24);
    width: 100vw;
    height: 100vh;
    position: absolute;
    display: flex;
    flex-direction: column;
    justify-content: space-evenly;
    align-items: center;
    z-index: 1;
  }
  .types {
    background-color: rgb(51, 55, 64);
    color: white;
    width: 95%;
    height: 15%;
    display: flex;
    flex-direction: row;
    justify-content: space-evenly;
    align-items: center;
    border-radius: 1rem;
  }
  .types img {
    width: 5rem;
    height: 3rem;
  }
  .car, .truck, .bike {
    display: flex;
    flex-direction: column;
    justify-content: space-around;
    align-items: center;
    font-weight: 700;
    cursor: pointer;
    padding: 0.5rem 1rem;
  }
  .selected {
    background-color: rgba(217, 217, 217, 0.3);
    border-radius: 0.5rem;
    padding: 0.5rem 1rem;
  }
  form {
    width: 100%;
    display: flex;
    flex-direction: column;
    justify-content: space-evenly;
    align-items: center;
  }
  form button {
    background-color: rgb(51, 55, 64);
    color: white;
    border-radius: 0.5rem;
    padding: 2.5rem;
  }
  .details {
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
  }
  .year, .make, .model {
    display: flex;
    flex-direction: column;
    justify-content: center;
    width: 90%;
    margin: 0.125rem 0;
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
  }
  input[type="submit"] {
    background-color: white;
    color: black;
    width: 50%;
    margin-top: 1rem;
    font-weight: 500;
  }
  .nickname {
    display: flex;
    flex-direction: column;
    justify-content: center;
    width: 90%;
    margin: 0.25rem 0;
  }
  @media all and (min-width:700px) {
    h1 {
      font-size: 2.25rem;
      line-height: 2.5rem;
      margin-top: 8rem;
      color: white;
      flex-grow: 1;
      width: 100%;
      text-align: center;
    }
    .background {
      flex-direction: row;
      flex-wrap: wrap;
      justify-content: space-evenly;
      align-items: flex-start;
    }
    .types {
      width: 20%;
      height: 50%;
      flex-direction: column;
      justify-content: space-evenly;
    }
    .types img {
      width: 6rem;
      height: 4rem;
    }
    .car, .truck, .bike {
      flex-direction: column;
      justify-content: space-around;
      margin: 1rem;
    }
    form {
      width: 75%;
    }
    form button {
      align-self: flex-start;
      margin-left: 2rem;
      margin-bottom: 0.5rem;
    }
  }
  @media all and (min-width:700px) {
    form button {
      margin-left: 2.5rem;
    }
  }
  @media all and (min-width:1200px) {
    .types {
      width: 15%;
      height: 45%;
    }
    .selected {
      padding: 0.5rem 2rem;
    }
    form {
      width: 65%;
    }
    form button {
      margin-left: 0;
      padding: 3.75rem;
      font-size: 1.5rem;
    }
    .details {
      flex-direction: row;
      justify-content: space-between;
    }
    .year, .make, .model {
      margin: 2rem 0;
    }
    form label {
      margin-bottom: 0.25rem;
    }
    form select {
      padding: 0.5rem 0.5rem;
    }
    .nickname {
      width: 100%
    }
    input[type="submit"] {
      margin-top: 5rem;
    }
  }
</style>
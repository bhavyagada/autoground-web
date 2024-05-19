<script lang="ts">
  import { call_cloud_function, upload_image } from "$lib/functions/util";
  import cars from "/src/data/cars.json";
  import bikes from "/src/data/bikes.json";
  import trucks from "/src/data/trucks.json";
  import Cropper from 'svelte-easy-crop';
  import { add_toast } from "$lib/stores/auth";
  import { all_cars_store, car_store, default_car } from "$lib/stores/car";
  import { CloudFunctions } from "$lib/functions/all";
  import Loading from "./Loading.svelte";
  import { VehicleType } from "$lib/types";
  import { user_store } from "$lib/stores/auth";
  import { goto, replaceState } from "$app/navigation";

  let isLoading: boolean = false;

  let photos: string[] = [];
  let otherPhoto1: any = null;
  let otherPhoto2: any = null;
  let otherPhoto3: any = null;
  let coverPhoto: any = null;
  let pixelCrop: any;
  let image: any;
  let crop = { x: 0, y: 0 };
  let zoom = 1;

  let selectedType: string = "car";
  let selectedYear: string | number = "";
  let selectedMake: string = "";
  let selectedModel: string = "";
  let name: string = "";

  const getYears = () => {
    const startYear = 1900;
    let currentYear = new Date().getFullYear();
    let yearList: Array<number> = [];
    while (currentYear >= startYear) {
      yearList.push(currentYear--);
    }
    return yearList;
  }

  let years: number[] = getYears();

  let makes: { [key: string]: string[]; };
  $: makes = {
    "bike": Object.keys(bikes),
    "car": Object.keys(cars),
    "truck": Object.keys(trucks)
  }

  let models: { [key: string]: any; };
  $: models = {
    "bike": bikes[selectedMake],
    "car": cars[selectedMake],
    "truck": trucks[selectedMake]
  };

  const resetSelectedModel = () => {
    selectedModel = "";
  }

  $: console.log(selectedYear);
  $: console.log(selectedMake);
  $: console.log(selectedModel);

  let mainPhotoElement: HTMLElement;
  const handleMainFileUpload = () => mainPhotoElement.click();
  let otherPhotoElement1: HTMLElement;
  const handleOtherFileUpload1 = () => otherPhotoElement1.click();
  let otherPhotoElement2: HTMLElement;
  const handleOtherFileUpload2 = () => otherPhotoElement2.click();
  let otherPhotoElement3: HTMLElement;
  const handleOtherFileUpload3 = () => otherPhotoElement3.click();

  const loadFile = async (e: any) => {
    const imageFile: any = e.target.files[0];
    let reader = new FileReader();
		reader.onload = e => {
      if (!e.target) return null;
			image = e.target.result;
		};
		reader.readAsDataURL(imageFile);
    document.addEventListener('click', (e: any) => {
      if (!e.target.closest('.crop-container')) {
        image = null;
        if (coverPhoto && coverPhoto.includes("C:\\fakepath")) coverPhoto = null;
        if (otherPhoto1 && otherPhoto1.includes("C:\\fakepath")) otherPhoto1 = null;
        if (otherPhoto2 && otherPhoto2.includes("C:\\fakepath")) otherPhoto2 = null;
        if (otherPhoto3 && otherPhoto3.includes("C:\\fakepath")) otherPhoto3 = null;
      }
    });
  }

  const previewCrop = (e: any) => {
		pixelCrop = e.detail.pixels;
  }

  const cropImage = (imageSrc: any, pixelCrop: { x: number, y: number, width: number, height: number }) => {
    return new Promise((resolve, reject) => {
      const image = new Image();
      image.src = imageSrc;

      image.onload = () => {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          reject(null);
          return;
        }
        canvas.width = pixelCrop.width;
        canvas.height = pixelCrop.height;

        // Draw cropped image on the canvas
        ctx.drawImage(image, pixelCrop.x, pixelCrop.y, pixelCrop.width, pixelCrop.height, 0, 0, pixelCrop.width, pixelCrop.height);

        const dataURL = canvas.toDataURL('image/jpeg');
        if (coverPhoto !== null && otherPhoto1 === null && otherPhoto2 === null && otherPhoto3 === null) coverPhoto = dataURL;
        if (otherPhoto1 !== null && otherPhoto2 === null && otherPhoto3 === null) otherPhoto1 = dataURL;
        if (otherPhoto2 !== null && otherPhoto3 === null) otherPhoto2 = dataURL;
        if (otherPhoto3 !== null) otherPhoto3 = dataURL;
        resolve(dataURItoFile(dataURL));
      };

      image.onerror = (error) => {
        reject(error);
      };
    });
  }

  const dataURItoFile = (dataURI: string) => {
    var byteString = atob(dataURI.split(',')[1]);

    var mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0];

    var ab = new ArrayBuffer(byteString.length);
    var ia = new Uint8Array(ab);
    for (var i = 0; i < byteString.length; i++) {
        ia[i] = byteString.charCodeAt(i);
    }

    image = null;
    const blob = new Blob([ab], { type: mimeString });
    return new File([blob], "image.jpeg", { type: mimeString });
  }

  $: console.log(photos);
  $: console.log($car_store);

  const handleTypeChange = (type: string) => {
    selectedType = type;
    selectedYear = "";
    selectedMake = "";
    selectedModel = "";
  }

  const handleClientSideError = (errorMessage: string): boolean => {
    add_toast("error", errorMessage);
    return false;
  };

  const handleServerSideError = (errorMessage: string): boolean => {
    add_toast("error", errorMessage);
    isLoading = false;
    return false;
  };

  const handleCloudUploadPhoto = async (photo: any) => {
    const imageFile = dataURItoFile(photo);
    return await upload_image(imageFile, `Users/${$user_store.userId}/CarPhotos/${Date.now()}`);
  }

  const handleSubmit = async () => {
    if (!selectedYear || (typeof Number(selectedYear) !== "number") || (Number(selectedYear) < 1900 && Number(selectedYear) > new Date().getFullYear())) {
      return handleClientSideError("Enter a valid year!");
    } else if (!selectedMake) {
      return handleClientSideError("Enter a car make!");
    } else if (!selectedModel) {
      return handleClientSideError("Enter a car model!");
    }
    
    isLoading = true;
    if (coverPhoto) {
      coverPhoto = await handleCloudUploadPhoto(coverPhoto);
      $car_store = { ...$car_store, coverPhoto };
    }
    if (otherPhoto1) {
      otherPhoto1 = await handleCloudUploadPhoto(otherPhoto1);
      photos.push(otherPhoto1);
    }
    if (otherPhoto2) {
      otherPhoto2 = await handleCloudUploadPhoto(otherPhoto2);
      photos.push(otherPhoto2);
    }
    if (otherPhoto3) {
      otherPhoto3 = await handleCloudUploadPhoto(otherPhoto3);
      photos.push(otherPhoto3);
    }

    if (selectedYear && selectedMake && selectedModel) {
      let vehicleType: VehicleType = VehicleType.car;
      if (selectedType === "bike") vehicleType = VehicleType.bike;
      else if (selectedType === "car") vehicleType = VehicleType.car;
      else if (selectedType === "truck") vehicleType = VehicleType.truck;
      const year = Number(selectedYear);
      const make = selectedMake;
      const model = selectedModel;
      $car_store = { ...$car_store, year, make, model, vehicleType, name, userId: $user_store.userId, userName: $user_store.userName, photos }
    }
    try {
      const result = await call_cloud_function(CloudFunctions.ADD_CAR_TO_GARAGE, { carData: $car_store });
      if (result?.isError) {
        return handleServerSideError("Server Error! Please Try Again!");
      } else {
        add_toast("success", "Vehicle Added Successfully!");
        $car_store = default_car;
        $all_cars_store = [ ...$all_cars_store, result?.result.data];
        isLoading = false;
        replaceState('', { addVehicleModal: false, editVehicleModal: false });
        goto("/garage");
        location.reload();
        return true;
      }
    } catch (err) {
      return handleServerSideError("Server Error! Please Try Again!");
    }
  }
</script>

<div class="background">
  <h1>Add Vehicle to Garage</h1>
  <div class="types">
    <button class={selectedType === "car" ? "car selected" : "car"} on:click={() => handleTypeChange("car")}>
      <img alt="Car Icon Type" src="/car.svg">
      <p>Car</p>
    </button>
    <button class={selectedType === "truck" ? "truck selected" : "truck"} on:click={() => handleTypeChange("truck")}>
      <img alt="Truck Icon Type" src="/truck.svg">
      <p>Truck</p>
    </button>
    <button class={selectedType === "bike" ? "bike selected" : "bike"} on:click={() => handleTypeChange("bike")}>
      <img alt="Bike Icon Type" src="/bike.svg">
      <p>Bike</p>
    </button>
  </div>
  <form enctype="multipart/form-data">
    {#if image}
      <div class="crop-container">
        <div class="cropper">
          <Cropper {image} bind:crop bind:zoom on:cropcomplete={previewCrop} />
        </div>
        <button class="crop-submit" type="button" name="submit" on:click={async () => {await cropImage(image, pixelCrop)}}>Set Photo</button>
      </div>
    {/if}
    <div class="photos">
      <button on:click={handleMainFileUpload} class={coverPhoto ? "photo" : ""} type="button">
        <input bind:this={mainPhotoElement} bind:value={coverPhoto} on:change={loadFile} type="file" class="hidden" name="photo" accept="image/*">
        <img alt="" src={coverPhoto} class={coverPhoto ? "photo" : ""}>
        <p class={coverPhoto ? "none" : ""}>Add Cover Photo</p>
        <p class={coverPhoto ? "none" : ""}>+</p> 
      </button>
        <button on:click={handleOtherFileUpload1} class={otherPhoto1 ? "photo" : ""} type="button">
          <input bind:this={otherPhotoElement1} bind:value={otherPhoto1} on:change={loadFile} type="file" class="hidden" name="photo" accept="image/*">
          <img alt="" src={otherPhoto1} class={otherPhoto1 ? "photo" : ""}>
          <p class={otherPhoto1 ? "none" : ""}>Add Photo</p>
          <p class={otherPhoto1 ? "none" : ""}>+</p> 
        </button>
        <button on:click={handleOtherFileUpload2} class={otherPhoto2 ? "photo" : ""} type="button">
          <input bind:this={otherPhotoElement2} bind:value={otherPhoto2} on:change={loadFile} type="file" class="hidden" name="photo" accept="image/*">
          <img alt="" src={otherPhoto2} class={otherPhoto2 ? "photo" : ""}>
          <p class={otherPhoto2 ? "none" : ""}>Add Photo</p>
          <p class={otherPhoto2 ? "none" : ""}>+</p> 
        </button>
        <button on:click={handleOtherFileUpload3} class={otherPhoto3 ? "photo" : ""} type="button">
          <input bind:this={otherPhotoElement3} bind:value={otherPhoto3} on:change={loadFile} type="file" class="hidden" name="photo" accept="image/*">
          <img alt="" src={otherPhoto3} class={otherPhoto3 ? "photo" : ""}>
          <p class={otherPhoto3 ? "none" : ""}>Add Photo</p>
          <p class={otherPhoto3 ? "none" : ""}>+</p> 
        </button>
    </div>
    <div class="details">
      <div class="year">
        <label for="year">Select Year</label>
        <div>
          <select bind:value={selectedYear} name="year">
            <option value={selectedYear}>{selectedYear}</option>
            {#each years as year}
              <option value={year}>{year}</option>
            {/each}
          </select>
        </div>
      </div>

      <div class="make">
        <label for="make">Select Make</label>
        <div>
          <select bind:value={selectedMake} name="make" on:change={resetSelectedModel}>
            <option value={selectedMake}>{selectedMake}</option>
            {#each makes[selectedType] as make}
              <option value={make}>{make}</option>
            {/each}
          </select>
        </div>
      </div>

      <div class="model">
        <label for="model">Select Model</label>
        <div>
          <select bind:value={selectedModel} name="model">
            <option value={selectedModel}>{selectedModel}</option>
            {#if models[selectedType]}
              {#each models[selectedType] as model}
                <option value={model.model}>{model.model}</option>
              {/each}
            {/if}
          </select>
        </div>
      </div>
    </div>
    <div class="nickname">
      <label for="nickname">Vehicle Nickname</label>
      <input bind:value={name} type="text" name="nickname">
    </div>
    {#if isLoading}
      <Loading />
    {:else}
      <input on:click|preventDefault={handleSubmit} type="submit" name="submit" value="Add Vehicle">
    {/if}
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
  .crop-container {
    position: absolute;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    align-items: center;
    width: 100%;
    height: 100%;
  }
  .cropper {
    background-color: black;
    position: absolute;
    width: 100%;
    height: 95%;
    z-index: 2;
  }
  .crop-submit {
    position: absolute;
    background-color: white;
    color: black;
    width: 100%;
    height: 8%;
    font-size: 1.125rem;
    line-height: 2.25rem;
    bottom: 0;
    z-index: 2;
    padding: 0;
    margin: 0;
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
    position: relative;
    width: 100%;
    display: flex;
    flex-direction: column;
    justify-content: space-evenly;
    align-items: center;
  }
  .photos {
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
  }
  .photos > button {
    flex: 20%;
    margin: 0.5rem;
  }
  form button {
    background-color: rgb(51, 55, 64);
    color: white;
    border-radius: 0.5rem;
    width: 160px;
    height: 120px;
  }
  .photo {
    width: 100%;
    height: 120px;
    border-radius: 0.5rem;
    padding: 0;
  }
  .none {
    display: none;
  }
  .details {
    width: 100%;
    display: flex;
    flex-direction: column;
  }
  .year, .make, .model {
    display: flex;
    flex-direction: column;
    margin: 0.125rem 0;
  }
  .year {
    margin-right: 10px;
  }
  .model {
    margin-left: 10px;
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
      width: 200px;
      height: 150px;
    }
    .photos {
      width: 100%;
      justify-content: space-between;
      flex-wrap: nowrap;
    }
    .photos button:first-child {
      margin-left: 0;
    }
    .photos button:last-child {
      margin-right: 0;
    }
    .photo {
      align-self: flex-start;
      width: 100%;
      height: 150px;
      border-radius: 0.5rem;
      padding: 0;
    }
    .details {
      flex-direction: row;
      justify-content: space-between;
      width: 100%;
    }
    .year, .make, .model {
      margin: 2rem 0;
      width: 100%;
    }
    .year div, .make div, .model div {
      width: 100%;
    }
    .year {
      margin-right: 10px;
    }
    .model {
      margin-left: 10px;
    }
    form label {
      margin-bottom: 0.25rem;
      width: 90%;
    }
    form select, form input {
      padding: 0.5rem 0.5rem;
      width: 100%;
    }
    .nickname {
      width: 100%
    }
    .nickname input {
      width: 100%;
    }
    input[type="submit"] {
      margin-top: 5rem;
    }
  }
</style>
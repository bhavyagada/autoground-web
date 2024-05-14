<script lang="ts">
  import { CloudFunctions } from "$lib/functions/all";
  import { callCloudFunction } from "$lib/functions/util";
  import { addToast } from "$lib/stores/auth";
  import { userStore } from "$lib/stores/auth";
  import { onMount } from "svelte";
  import Loading from "./Loading.svelte";

  export let type: string;
  export let clicked: boolean = false;
  export let toggleModal: any;

  $: clicked = clicked ? true : false;

  const errorMap = ["Invalid Phone Number", "Invalid Country Code", "Phone Number is too short", "Phone Number is too long", "Invalid Phone Number"];
  const usernameRegex = /^[^\s]{2,20}$/;
  const emailRegex = /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/g;

  let name: string = $userStore.name ? $userStore.name : "";
  let userName: string = $userStore.userName ? $userStore.userName : "";
  let bio: string = $userStore.bio ? $userStore.bio : "" ;
  let phone: string = $userStore.phone ? $userStore.phone : "";
  let email: string = $userStore.email ? $userStore.email : "";
  let isLoading = false;
  let size = '60';
  let isValidName: boolean = false;
  let isValidUsername: boolean = false;
  let isValidBio: boolean = false;
  let isValidEmail: boolean = false;
  let phoneElement: Element = undefined!;
  let ref: any = null;

  $: isValidName = name.trim().length > 0 && name.trim().length < 51;
  $: isValidUsername = userName.trim().length > 2 && userName.trim().length < 21 && usernameRegex.test(userName);
  $: isValidBio = bio.length < 1000;
  $: isValidEmail = email.trim().length > 0 && emailRegex.test(email);

  onMount(() => { ref.focus(); });

  let iti: intlTelInput.Plugin;
  $: if (type === phone) {
    phoneElement = document.querySelector("#phone")!;

    iti = window.intlTelInput(phoneElement, {
      initialCountry: "us",
      autoInsertDialCode: true,
      utilsScript: "https://cdn.jsdelivr.net/npm/intl-tel-input@19.5.5/build/js/utils.js"
    });
  } else {
    if (iti !== undefined) iti.destroy();
  }

  const handleClientSideError = (errorMessage: string): boolean => {
    addToast("error", errorMessage);
    return false;
  };

  const handleServerSideError = (errorMessage: string): boolean => {
    addToast("error", errorMessage);
    isLoading = false;
    return false;
  };

  const handleToggleModal = (input: string) => {
    addToast("success", `${input} updated successfully!`);
    isLoading = false;
    toggleModal();
  }

  const handleUpdate = async (input: string, valid: boolean, validMessage: string, cloudFunction: string) => {
    let same;
    if (input === "name") same = name === $userStore.name;
    else if (input === "userName") same = userName === $userStore.userName;
    else if (input === "bio") same = bio === $userStore.bio;
    else if (input === "phone") same = phone === $userStore.phone;
    else if (input === "email") same = email === $userStore.email;
    if (!valid) {
      return handleClientSideError(validMessage);
    } else if (same) {
      return handleClientSideError(`Enter a different ${input} to update!`);
    } else {
      isLoading = true;
      let update: object = {};
      if (input === "name") update = { name: name };
      else if (input === "userName") update = { userName: userName };
      else if (input === "bio") update = { bio: bio };
      else if (input === "phone") update = { phone: phone };
      else if (input === "email") update = { email: email };
      try {
        const result = await callCloudFunction(cloudFunction, update);
        if (result?.isError) {
          return handleServerSideError("Server Error! Please Try Again!");
        } else {
          if (input === "name") $userStore = { ...$userStore, name };
          else if (input === "userName") $userStore = { ...$userStore, userName };
          else if (input === "bio") $userStore = { ...$userStore, bio };
          else if (input === "phone") $userStore = { ...$userStore, phone: iti.getNumber(), countryCode: iti.getSelectedCountryData().dialCode };
          else if (input === "email") $userStore = { ...$userStore, email };
          handleToggleModal(input.charAt(0).toUpperCase() + input.slice(1));
        }
      } catch (err) {
        return handleServerSideError("Server Error! Please Try Again!");
      }
    }
  }

  const handleNameUpdate = async () => {
    return await handleUpdate("name", isValidName, "Name required with less than 50 characters!", CloudFunctions.UPDATE_USER_PROFILE_NAME);
  }
  
  const handleUserNameUpdate = async () => {
    return await handleUpdate("userName", isValidUsername, "Username required with 3-20 characters & no whitespace!", CloudFunctions.UPDATE_USER_NAME);
  }

  const handleBioUpdate = async () => {
    return await handleUpdate("bio", isValidBio, "Bio should be less than 1000 characters!", CloudFunctions.UPDATE_USER_BIO);
  }

  const handlePhoneUpdate = async () => {
    let isValidPhone = true;
    let validMessage = "";
    if (!iti.isValidNumber()) {
      isValidPhone = false;
      const errorCode = iti.getValidationError();
      validMessage = errorMap[errorCode] || "Invalid number";
    }
    return await handleUpdate("phone", isValidPhone, validMessage, CloudFunctions.UPDATE_USER_PHONE);
  }

  const handleEmailUpdate = async () => {
    return await handleUpdate("email", isValidEmail, "Invalid Email", CloudFunctions.UPDATE_USER_EMAIL);
  }

  const updateHandlers: any = {
    "name": handleNameUpdate,
    "username": handleUserNameUpdate,
    "bio": handleBioUpdate,
    "phone": handlePhoneUpdate,
    "email": handleEmailUpdate
  }
</script>

<form class={!clicked ? "hide" : ""}>
  <button on:click={toggleModal}><img src="/close-icon.svg" alt="Close Modal"></button>
  <h1>Update</h1>
  <div class="update">
    {#if type === "name"}
      <label for="name">Name</label>
      <input bind:value={name} type="text" name="name" maxlength="50" bind:this={ref}>
    {:else if type === "username"}
      <label for="">Username</label>
      <input bind:value={userName} type="text" name="username" minlength="3" maxlength="20" bind:this={ref}>
    {:else if type === "bio"}
      <label for="bio">Bio</label>
      <textarea bind:value={bio} name="bio" maxlength="1000" bind:this={ref}></textarea>
    {:else if type === "phone"}
      <div class="phonenumber">
        <label for="phone">Phone Number</label>
        <input bind:value={phone} id="phone" type="tel" name="phone" bind:this={ref}>
      </div>
    {:else if type === "email"}
      <label for="email">Email</label>
      <input bind:value={email} type="email" name="email" bind:this={ref}>
    {/if}
  </div>

  {#if isLoading}
    <Loading {size} />
  {:else}
    <input on:click|preventDefault={updateHandlers[type]} class="submit" type="submit" name="submit" value="Update">
  {/if}
</form>

<style>
  form {
    position: absolute;
    background-color: black;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    width: 85%;
    height: 35%;
    z-index: 2;
    padding: 1.5rem;
    border-radius: 0.5rem;
  }
  form label {
    color: white;
  }
  .hide {
    display: none;
  }
  img {
    position: absolute;
    top: -25px;
    right: -25px;
    z-index: 4;
  }
  h1 {
    font-size: 2.25rem;
    line-height: 2.5rem;
    margin-bottom: 2rem;
    color: white;
    align-self: center;
  }
  .update {
    margin: auto 0;
  }
  input, textarea {
    background-color: rgb(51, 55, 64);
    width: 100%;
    padding: 0.5rem;
    margin: 1rem 0;
    border-radius: 0.5rem;
    color: white;
  }
  .phonenumber {
    display: flex;
    flex-direction: column;
    width: 100%;
  }
  .phonenumber label {
    font-size: 1rem;
    line-height: 1rem;
    padding: 0.5rem 0;
    margin: 1rem 0;
  }
  .phonenumber input {
    background-color: rgb(51, 55, 64);
    color: white;
  }
  .submit {
    align-self: center;
    background-color: white;
    color: black;
    border-radius: 0.5rem;
    width: 100%;
    font-weight: 700;
    padding: 0.125rem 0.5rem;
    margin: 2rem;
  }

  @media all and (min-width: 600px) {
    form {
      justify-content: space-evenly;
      height: 40%;
    }
    h1 {
      margin-bottom: 4rem;
    }
    .submit {
      width: 65%;
    }
  }
  @media all and (min-width: 1200px) {
    form {
      width: 45%;
      padding: 1.5rem 5rem;
    }
    h1 {
      margin-bottom: 2rem;
    }
    .submit {
      font-size: 1.125rem;
      width: 60%;
    }
  }
</style>
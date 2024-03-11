<script lang="ts">
  import { addToast, authData } from "$lib/stores/auth";
  import { onMount } from "svelte";
  import { AuthProviderId, AuthenticationType } from "../types";
  import { userStore } from "$lib/stores/user";
  import { callFunction } from "$lib/functions/util";
  import { cloudFunctions } from "$lib/functions/all";
  import { goto } from "$app/navigation";
  import Loading from "./Loading.svelte";

	let size = '60';
  let form: string = "login";
  let isLoading: boolean = false;

  const errorMap = ["Invalid Phone Number", "Invalid Country Code", "Phone Number is too short", "Phone Number is too long", "Invalid Phone Number"];
  const usernameRegex = /^(?!.*\.\.)(?!.*\.$)[^\W][\w.]{2,20}$/igm;
  const emailRegex = /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/g;

  let userPhoto: any = $authData.user?.photoURL ? $authData.user?.photoURL : "/default-photo.svg";
  let name: string = $authData.user?.displayName ? $authData.user?.displayName : "";
  let userName: string = "";
  let phoneNumber: string = $authData.user?.phoneNumber ? $authData.user?.phoneNumber : "";
  let email: string = $authData.user?.email ? $authData.user?.email : "" ;
  let bio: string = "";
  let selectedUserName: boolean = false;
  let isValidName: boolean = false;
  let isValidUsername: boolean = false;
  let isValidEmail: boolean = false;
  let isValidBio: boolean = false;
  let phoneElement: Element = undefined!;

  let iti: intlTelInput.Plugin;
  onMount(() => {
    phoneElement = document.querySelector("#phone")!;

    iti = window.intlTelInput(phoneElement, {
      initialCountry: "us",
      autoInsertDialCode: true,
      utilsScript: "https://cdn.jsdelivr.net/npm/intl-tel-input@19.5.5/build/js/utils.js"
    });
  });

  let profilePhoto: HTMLElement;
  const handleFileUpload = () => {
    profilePhoto.click();
  }

  const loadFile = (e: any) => {
    const file: any = e.target.files[0]
    userPhoto = URL.createObjectURL(file);
  }

  $: isValidName = name.trim().length > 0 && name.trim().length < 51;
  $: isValidUsername = userName.trim().length > 2 && userName.trim().length < 21 && usernameRegex.test(userName);
  $: isValidEmail = email.trim().length > 0 && emailRegex.test(email);
  $: isValidBio = bio.length < 1000;

  // generate a unique username if the user doesn't provide one
  const createUniqueUsername = () => {
    const dateTime: number = new Date().getTime();
    const randomNumber: number = Math.floor(Math.random() * 100);
    const userName: string = `user${dateTime}${randomNumber}`;
    console.log(userName);
  }
  createUniqueUsername();

  const handleSubmit = async () => {
    if (userName && !(isValidUsername)) {
      addToast("error", "Username required with 3-20 characters & no whitespace!");
      return false;
    }

    console.log(email);
    if (email.length > 0) {
      if (!isValidEmail) {
        addToast("error", "Invalid Email!");
        return false;
      }
    } else if (phoneNumber) {
      if (!iti.isValidNumber()) {
        const errorCode = iti.getValidationError();
        addToast("error", errorMap[errorCode] || "Invalid number");
        return false;
      }
    }

    if (!isValidName) {
      addToast("error", "Name required with less than 50 characters!");
      return false;
    } else if (!isValidBio) {
      addToast("error", "Bio should be less than 1000 characters!");
    } else {
      if (userName.length > 0) {
        selectedUserName = true;
      }
      let authenticationType = "";
      if ($authData.user?.providerData[0].providerId === AuthProviderId.PHONE) {
        authenticationType = AuthenticationType.phone;
      } else if ($authData.user?.providerData[0].providerId === AuthProviderId.GOOGLE) {
        authenticationType = AuthenticationType.google;
      } else {
        authenticationType = AuthenticationType.email;
      }
      $userStore = { 
        ...$userStore,
        userPhoto,
        name,
        userName,
        email,
        bio,
        authenticationType,
        phone: iti.getNumber(),
        countryCode: iti.getSelectedCountryData().dialCode,
      };
      const createUserData = { user: $userStore, selectedUserName: selectedUserName };
      console.log(createUserData);
      try {
        isLoading = true;
        const result = await callFunction(cloudFunctions.CREATE_USER_PROFILE, createUserData);
        if (result?.isError) {
          addToast("error", "Server Error! Please Try Again!");
          isLoading = false;
          return false;
        } else {
          addToast("success", "Account Created Successfully!");
          isLoading = false;
          goto("/");
          return true;
        }
      } catch (err) {
        addToast("error", "Server Error! Please Try Again!");
        return false;
      }
    }
  }
</script>

<div class="background home">
  <form>
    <h1>Create Account</h1>
    <div class="form-top">
      <button on:click={handleFileUpload} class="photo">
        <input bind:this={profilePhoto} bind:value={userPhoto} on:change={loadFile} type="file" class="hidden" name="photo" accept="image/*">
        <img alt="Upload Profile" src={$authData.user?.photoURL || userPhoto ? $authData.user?.photoURL || userPhoto : "/default-photo.svg"}>
      </button>
      <div class="name-phone-container">
        <label for="name">Name</label>
        <input bind:value={name} type="text" name="name" maxlength="50" required>
        <div class="name-phone">
          <div class="username">
            <label for="">Username</label>
            <input bind:value={userName} type="text" name="username" minlength="3" maxlength="20">
          </div>
          <div class="phonenumber">
            <label for="phone">Phone Number</label>
            <input bind:value={phoneNumber} id="phone" class="phone" type="tel" name="phonenumber" disabled={$authData.user?.providerData[0].providerId === AuthProviderId.PHONE}>
          </div>
        </div>
      </div>
    </div>
    <div class="email">
      <label for="email">Email</label>
      <input bind:value={email} type="email" name="email" disabled={$authData.user?.providerData[0].providerId === AuthProviderId.GOOGLE || $authData.user?.providerData[0].providerId === AuthProviderId.APPLE}>
    </div>
    <div class="bio">
      <label for="bio">Bio</label>
      <textarea bind:value={bio} name="bio" maxlength="1000"></textarea>
    </div>
    {#if isLoading}
      <Loading {size} />
    {:else}
      <input on:click|preventDefault={handleSubmit} class="submit" type="submit" name="submit" value="Create">
    {/if}
  </form>
</div>

<style>
  .background {
    width: var(--bgwidth);
    height: var(--bgheight);
    position: relative;
    z-index: 1; 
  }
  .home {
    background-color: rgb(24, 24, 24);
    width: 100vw;
    height: 100vh;
  }
  h1 {
    font-size: 2.25rem;
    line-height: 2.5rem;
    margin-top: auto;
    margin-bottom: 2rem;
    color: white;
  }
  form {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    height: 100%;
    width: 100%;
    padding: 1rem;
  }
  form label {
    font-size: 1rem;
    line-height: 1rem;
    margin: 0.5rem 0;
    color: white;
  }
  input, textarea {
    background-color: rgb(51, 55, 64);
    width: 100%;
    border-radius: 0.5rem;
    padding: 0.5rem;
    color: white;
  }
  textarea {
    height: 150px;
  }
  .form-top, .name-phone-container, .name-phone, .username, .phonenumber, .email, .bio {
    display: flex;
    flex-direction: column;
    width: 100%;
  }
  .photo img {
    width: 6rem;
    height: 6rem;
    border-radius: 3rem;
    align-self: center;
  }
  .name-phone-container label * {
    align-self: flex-start;
  }
  .submit {
    align-self: center;
    background-color: white;
    color: black;
    border-radius: 1rem;
    width: 100%;
    font-weight: 700;
    padding: 0.5rem;
    margin: 2rem 0;
  }
  *:disabled {
    background-color: dimgrey;
    opacity: 0.9;
  }

  @media all and (min-width: 600px) {
    .home {
      display: flex;
      flex-direction: column;
      align-items: center;
    }
    h1 {
      margin: 4rem 0;
    }
    form {
      align-items: center;
    }
    .form-top {
      flex-direction: row;
      justify-content: space-between;
    }
    .photo {
      width: 7rem;
      height: 7rem;
    }
    .form-top button {
      margin: 0.25rem;
    }
    .name-phone-container {
      width: 75%;
      margin: 0.25rem;
    }
    .username, .phonenumber {
      display: flex;
      flex-direction: column;
      width: 50%;
      margin: 0.25rem;
    }
    .name-phone {
      flex-direction: row;
    }
    .email, .bio {
      padding: 0.125rem;
    }
    input, textarea {
      padding: 0.25rem;
      border-radius: 0.75rem;
    }
  }
  @media all and (min-width: 900px) {
    form {
      justify-content: center;
      align-items: center;
      width: 60%;
    }
    input, textarea {
      padding: 0.5rem;
    }
  }
  @media all and (min-width: 1200px) {
    h1 {
      margin-bottom: 2rem;
    }
    form label {
      font-size: 1.25rem;
      line-height: 1rem;
      margin: 0.5rem 0;
    }
    .form-top button {
      margin: auto;
    }
    .submit {
      margin-top: 4rem;
      font-size: 1.125rem;
      width: 50%;
    }
    input {
      font-size: 1.25rem;
      padding: 0.5rem 0.75rem;
    }
  }
</style>

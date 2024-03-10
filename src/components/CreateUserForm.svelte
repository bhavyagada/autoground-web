<script lang="ts">
  import { addToast, authData } from "$lib/stores/auth";
  import { onMount } from "svelte";
  import { AuthProviderId } from "../types";

  const errorMap = ["Invalid Phone Number", "Invalid Country Code", "Phone Number is too short", "Phone Number is too long", "Invalid Phone Number"];
  const usernameRegex = /^[a-zA-Z0-9]+/;
  const emailRegex = /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/g;

  let name: string = $authData.user?.displayName ? $authData.user?.displayName : "";
  let username: string = "";
  let phoneNumber: string = $authData.user?.phoneNumber ? $authData.user?.phoneNumber : "";
  let email: string = $authData.user?.email ? $authData.user?.email : "" ;
  let bio: string = "";
  let selectedUsername: boolean = false;
  let isValidName: boolean = false;
  let isValidUsername: boolean = false;
  let isValidPhone: boolean = false;
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
  const handleFileUpload = (e: Event) => {
    profilePhoto.click();
  }

  $: isValidName = name.trim().length > 0 && name.trim().length < 50;
  $: isValidUsername = username.length > 2 && username.length < 21 && usernameRegex.test(username);
  $: isValidEmail = email.trim().length === 0 || emailRegex.test(email);
  $: isValidBio = bio.length < 1000;

  const handleSubmit = () => {
    if (!isValidName) {
      addToast("error", "Name required with less than 50 characters!");
    }
    if (!isValidUsername) {
      addToast("error", "Username required with 3 - 20 characters & no whitespace!");
    }
    if (!isValidEmail && !iti.isValidNumber()) {
      isValidPhone = false;
      const errorCode = iti.getValidationError();
      addToast("error", errorMap[errorCode] || "Invalid Phone Number"); 
    } else {
      isValidPhone = true;
    }
    if (!isValidEmail) {
      addToast("error", "Invalid Email");
    }
    if (!isValidBio) {
      addToast("error", "Bio should be less than 1000 characters");
    }
    if (isValidName && isValidUsername && (isValidPhone || isValidEmail) && isValidBio) {
      if (isValidUsername) {
        selectedUsername = true;
      }
      console.log("valid form");
      return;
    }
  }
</script>

<div class="background home">
  <form>
    <h1>Create Account</h1>
    <div class="form-top">
      <button on:click={handleFileUpload} class="photo">
        <input bind:this={profilePhoto} type="file" class="hidden" name="photo" accept="image/png, image/jpeg">
        <img alt="Upload Profile" src={$authData.user?.photoURL ? $authData.user?.photoURL : "/profile-photo.svg"}>
      </button>
      <div class="name-phone-container">
        <label for="name">Name</label>
        <input bind:value={name} type="text" name="name" maxlength="50" required>
        <div class="name-phone">
          <div class="username">
            <label for="">Username</label>
            <input bind:value={username} type="text" name="username" minlength="3" maxlength="20">
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
      <textarea bind:value={bio} name="bio"></textarea>
    </div>
    <input on:click|preventDefault={handleSubmit} class="submit" type="submit" name="submit" value="Create">
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
  .photo {
    width: 6rem;
    height: 6rem;
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

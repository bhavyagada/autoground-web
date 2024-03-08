<script lang="ts">
  import { onMount } from "svelte";
  import intlTelInput from "intl-tel-input";
  import { userStore } from "../../stores/userStore";
  import { goto } from "$app/navigation";
  import { 
    confirmationResultStore, 
    phoneSignup, 
    googleSignup, 
    authStore,

    appleSignup

  } from "../../stores/authStore";
  import { browser } from "$app/environment";

  const errorMap = ["Invalid number", "Invalid country code", "Too short", "Too long", "Invalid number"];

  let phone: string = ""
  let isError: boolean = false;
  let errorMessage: string = "";
  let phoneElement: Element = undefined!;
  let iti: intlTelInput.Plugin;

  // don't allow users to visit if already signed in
  // redirect to home
  $: if (browser) {
    if ($authStore) {
      console.log("inside login onMount");
      goto("/")
    }
  }

  onMount(() => {
    phoneElement = document.querySelector("#phone")!;

    iti = window.intlTelInput(phoneElement, {
      initialCountry: "us",
      autoInsertDialCode: true,
      utilsScript: "https://cdn.jsdelivr.net/npm/intl-tel-input@19.5.5/build/js/utils.js"
    });
  });


  $: console.log(phone);

  function init(el: HTMLElement){
    el.focus()
  }

  async function handleAuth(e: Event) {
    console.log("Phone auth continue button clicked!");
    e.preventDefault();

    // validate phone number before submitting
    if (!iti.isValidNumber()) {
      isError = true;
      const errorCode = iti.getValidationError();
      errorMessage = errorMap[errorCode] || "Invalid number";
    } else {
      isError = false;
      const phoneNumber = iti.getNumber();
      const dialCode = iti.getSelectedCountryData().dialCode;
      console.log("Valid Phone Number", phoneNumber);
      iti.getSelectedCountryData().dialCode
      // update phone number in user store
      userStore.update((curr) => {
        return {
          ...curr,
          phone: phoneNumber.replace(dialCode, ""),
          countryCode: dialCode,
        }
      });

      // try sign in and goto verification page if it works
      try {
        await phoneSignup(phoneNumber);
        if ($confirmationResultStore) {
          goto("/verify");
        }
      } catch (err) {
        console.log(err);
        isError = true;
        errorMessage = "Internal Error! Please try again!"
      }
    }
  }

  async function handleProviderAuth(e: Event, provider: string) {
    console.log("Google auth button clicked");
    e.preventDefault();

    try {
      let user: any;
      if (provider === "google") {
        user = await googleSignup();
      }
      if (provider === "apple") {
        user = await appleSignup();
      }
      console.log(user);
      if (user) {
        // update email in user store
        userStore.update((curr) => {
          return {
            ...curr,
            email: user.email,
          }
        });
        // update user auth information in authStore
        authStore.set(user);
        goto("/");
      }
    } catch (err) {
      console.log(err);
      isError = true;
      errorMessage = "Internal Error! Please try again!"
    }
  }
</script>

<div class="background home">
  <div class="login">
    <h1>Sign In/Up</h1>
    <form method="POST" action="">
      <label for="phone">Phone</label>
      <input bind:value={phone} use:init id="phone" name="phone" type="tel" placeholder="8005550101" required>
      <div id="recaptcha-container" class="recaptcha"></div>
      {#if isError}
        <p class="error">{errorMessage}</p>
      {/if}
      <button type="button" on:click={handleAuth} class="submit">Continue</button>
      <div class="separator">OR</div>
      <div class="providers">
        <button type="button" on:click={(event) => handleProviderAuth(event, "google")}>
          <img src="/logo-google.svg" alt="Google Logo">
        </button>
        <button type="button" on:click={(event) => handleProviderAuth(event, "apple")}>
          <img src="/logo-apple.svg" alt="Apple Logo">
        </button>
      </div>
    </form>
  </div>
</div>

<style>
  .background {
    width: var(--bgwidth);
    height: var(--bgheight);
    position: relative;
    z-index: 1; 
  }
  .home {
    background: var(--homebg1) center / var(--bgsize) var(--bgrepeat);
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    height: 100vh;
  }
  .login {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    width: 600px;
    height: 600px;
    border-radius: 1rem;
    background-color: rgb(59 59 59 / 0.9);
  }
  h1 {
    font-size: 2.25rem;
    line-height: 2.5rem;
  }
  form {
    display: flex;
    flex-direction: column;
    justify-content: center;
    width: 500px;
    height: 500px;
    gap: 0.5rem;
  }
  form label {
    font-size: 1.5rem;
    line-height: 2rem;
  }
  form input {
    background-color: white;
    color: black;
    border-radius: 0.5rem;
    width: 100%;
    padding: 0.5rem;
  }
  .recaptcha {
    display: flex;
    justify-content: center;
  }
  .error {
    font-size: 1.125rem;
    font-weight: 600;
    line-height: 1.75rem;
    text-align: center;
    color: rgb(239, 68, 68);
  }
  .submit {
    align-self: center;
    background-color: white;
    color: black;
    border-radius: 1rem;
    width: 100%;
    font-weight: 700;
    padding: 0.5rem;
    margin: 2.5rem 0;
  }
  .separator {
    display: flex;
    align-items: center;
    text-align: center;
    color: white;
  }
  .separator::before,
  .separator::after {
    content: '';
    flex: 1;
    border-bottom: 1px solid white;
  }
  .separator:not(:empty)::before {
    margin-right: .25em;
  }
  .separator:not(:empty)::after {
    margin-left: .25em;
  }
  .providers {
    display: flex;
    justify-content: space-evenly;
    padding: 1rem;
    margin: 1rem;
  }
</style>

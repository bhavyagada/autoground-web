<script lang="ts">
  import { onMount } from "svelte";
  import { 
    phoneConfirmationStore, 
    phoneSignup, 
    googleSignup, 
    appleSignup,
    authData,
    addToast,
  } from "$lib/stores/auth";
  import { callFunction } from "$lib/functions/util";
  import { cloudFunctions } from "$lib/functions/all";
  import VerifyPhoneForm from "../../components/VerifyPhoneForm.svelte"
  import CreateUserForm from "../../components/CreateUserForm.svelte"
  import { goto } from "$app/navigation";
  import Loading from "../../components/Loading.svelte";
  import { userStore } from "$lib/stores/user";
  import { allCarsStore } from "$lib/stores/car";

  const errorMap = ["Invalid number", "Invalid country code", "Number is too short", "Number is too long", "Invalid number"];

	let size = '60';
  let form: string = "login";
  let isLoading: boolean = false;

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

  async function handleAuth() {
    const phoneNumber = iti.getNumber();
    if (!iti.isValidNumber()) {
      const errorCode = iti.getValidationError();
      addToast("error", errorMap[errorCode] || "Invalid number");
    } else {
      // try sign in and goto verification page if it works
      try {
        await phoneSignup(phoneNumber);
        if ($phoneConfirmationStore?.confirmation) {
          addToast("success", "Great! Now please verify your contact!");
          form = "verify"
        }
      } catch (err) {
        addToast("error", "Server Error! Please try again!");
      }
    }
  }

  async function handleGoogleAuth() {
    try {
      isLoading = true;
      const newUser = await googleSignup();
      console.log(`Google new sign in: ${JSON.stringify(newUser)}`);
      $authData = { user: newUser?.user, isLoggedIn: false };
      console.log($authData.user);
      await getUserProfile();
      isLoading = false;
    } catch (err) {
      addToast("error", "Server Error! Please try again!");
    }
  }

  async function handleAppleAuth() {
    try {
      const newUser = await appleSignup();
      console.log(`Apple new sign in: ${JSON.stringify(newUser)}`);
      $authData = { user: newUser?.user, isLoggedIn: false };
      await getUserProfile();
    } catch (err) {
      addToast("error", "Server Error! Please try again!");
    }
  }

  async function getUserProfile() {
    try {
      const userResult = await callFunction(cloudFunctions.GET_USER_PROFILE, {});
      const carsResult = await callFunction(cloudFunctions.GET_GARAGE_DATA, {});
      console.log(`user result: ${userResult}`);
      console.log(`cars result: ${carsResult}`);
      if (userResult?.isError || carsResult?.isError) {
        if (userResult?.errorType === "[user_not_exists]") {
          addToast("success", "Welcome! Please create your account!");
          form = "create";
        } else {
          addToast("error", "Server Error! Please try again!");
          form = "login";
        }
      } else {
        $authData = { ...$authData, isLoggedIn: true };
        $userStore = userResult?.result.data;
        $allCarsStore = carsResult?.result.data.cars;
        sessionStorage.setItem("user", JSON.stringify($userStore));
        sessionStorage.setItem("loggedin", "true");
        sessionStorage.setItem("cars", JSON.stringify($allCarsStore));
        sessionStorage.setItem("mods", JSON.stringify($allCarsStore.map(car => car.modifications ? car.modifications : [])));
        console.log(`logged in user data ${JSON.stringify($userStore)}`);
        console.log(`logged in user cars data ${JSON.stringify($allCarsStore)}`);
        console.log(`logged in user auth data ${JSON.stringify($authData)}`);
        goto("/account");
        addToast("success", "Successfully Signed In!");
      }
    } catch (err) {
      addToast("error", "Server Error! Please try again!");
    }
  }
</script>

<div class="background home">
  {#if form === "login"}
    <div class="login">
      <h1>Sign In/Up</h1>
      <form>
        <label for="phone">Phone</label>
        <input id="phone" name="phone" type="tel" placeholder="8005550101" required>
        <div id="recaptcha-container" class="recaptcha"></div>
        {#if isLoading}
          <Loading {size} />
        {:else}
          <button type="button" on:click|preventDefault={handleAuth} class="submit">Continue</button>
          <div class="separator">OR</div>
          <div class="providers">
            <button type="button" on:click|preventDefault={handleGoogleAuth}>
              <img src="/logo-google.svg" alt="Google Logo">
            </button>
            <button type="button" on:click|preventDefault={handleAppleAuth}>
              <img src="/logo-apple.svg" alt="Apple Logo">
            </button>
          </div>
        {/if}
      </form>
    </div>
  {:else if form === "verify"}
    <svelte:component this={VerifyPhoneForm} bind:form />
  {:else if form === "create"}
    <svelte:component this={CreateUserForm} />
  {/if}
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
    color: white;
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
    color: white;
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

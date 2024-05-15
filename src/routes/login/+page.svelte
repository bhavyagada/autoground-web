<script lang="ts">
  import { onMount, onDestroy } from "svelte";
  import { goto } from "$app/navigation";
  import { CloudFunctions } from "$lib/functions/all";
  import { callCloudFunction } from "$lib/functions/util";
  import { userStore } from "$lib/stores/auth";
  import { addToast, authData, phoneConfirmationStore, phoneSignup, googleSignup, appleSignup, phoneVerify, resendCodeSignUp } from "$lib/stores/auth";
  import { allCarsStore } from "$lib/stores/car";
  import Loading from "../../components/Loading.svelte";
  import OtpForm from "../../components/OtpForm.svelte";
  import CreateUserForm from "../../components/CreateUserForm.svelte";

  let form: string = "login";
  let isLoading: boolean = false;

  let numOfInputs: number = 6;
	let value: string = '';
	let numberOnly: boolean = true;

  let phoneRef: HTMLInputElement;
  let iti: intlTelInput.Plugin;

  onMount(() => {
    iti = window.intlTelInput(document.querySelector("#phone")!, {
      initialCountry: "us",
      autoInsertDialCode: true,
      utilsScript: "https://cdn.jsdelivr.net/npm/intl-tel-input@19.5.5/build/js/utils.js"
    });
    phoneRef.focus();
  });

  // login
  const handlePhoneAuth = async () => {
    if (!iti.isValidNumber()) {
      const errorMap = ["Invalid number", "Invalid country code", "Number is too short", "Number is too long", "Invalid number"];
      addToast("error", errorMap[iti.getValidationError()] || "Invalid number");
      return;
    }
    try {
      isLoading = true;
      await phoneSignup(iti.getNumber());
      if ($phoneConfirmationStore?.confirmation) {
        addToast("success", "Great! Now please verify your contact!");
        form = "verify"
      }
    } catch (err) {
      addToast("error", "Server Error! Please try again!");
    } finally {
      isLoading = false;
    }
  }

  const handleProviderAuth = async (providerSignUpFunction: Function) => {
    try {
      isLoading = true;
      const newUser = await providerSignUpFunction();
      $authData = { user: newUser?.user, isLoggedIn: false };
      const userResult = await callCloudFunction(CloudFunctions.GET_USER_PROFILE, {});
      if (userResult.isError) {
        if (userResult.errorType === "[user_not_exists]") {
          addToast("success", "Welcome! Please create your account!");
          form = "create";
        } else {
          addToast("error", "Server Error! Please try again!");
          form = "login";
        }
      } else {
        $authData = { ...$authData, isLoggedIn: true };
        $userStore = userResult.result.data;
        const carsResult = await callCloudFunction(CloudFunctions.GET_GARAGE_DATA, {});
        if (carsResult.isError) addToast("error", "Server Error in fetching Garage Data!");
        else $allCarsStore = carsResult.result.data.cars;
        goto("/");
        addToast("success", "Successfully Signed In!");
      }
    } catch (err) {
      addToast("error", "Server Error! Please try again!");
    } finally {
      isLoading = false;
    }
  }

  // verify
  const handleResendCode = async () => {
    if (!$phoneConfirmationStore) return;
    if ($phoneConfirmationStore.confirmation) {
      try {
        await resendCodeSignUp($phoneConfirmationStore.phoneNumber);
      } catch (err) {
        addToast("error", "Server Error! Please try again!");
      }
    }
  }

  const handleVerify = async () => {
    if (!/[0-9]{6}/.test(value)) return;
    try {
      isLoading = true;
      const newUser: any = await phoneVerify(value);
      $authData = { user: newUser?.user, isLoggedIn: false };
      try {
        const userResult = await callCloudFunction(CloudFunctions.GET_USER_PROFILE, {});
        if (userResult.isError) {
          if (userResult.errorType === "[user_not_exists]") {
            addToast("success", "Welcome! Please create your account!");
            form = "create";
          } else {
            addToast("error", "Server Error! Please try again!");
            form = "login";
          }
        } else {
          $userStore = userResult.result.data;
          const carsResult = await callCloudFunction(CloudFunctions.GET_GARAGE_DATA, {});
          if (carsResult.isError) addToast("error", "Server Error in fetching Garage Data!");
          else $allCarsStore = carsResult.result.data.cars;
          $authData = { ...$authData, isLoggedIn: true };
          goto("/");
          addToast("success", "Successfully Signed In!");
        }
      } catch (err) {
        addToast("error", "Server Error! Please try again!");
        form = "login";
      }
    } catch (err) {
      addToast("error", "Incorrect Verification Code! Please Try Again!");
    } finally {
      isLoading = false;
    }
  }

  onDestroy(() => phoneConfirmationStore.set(null));
</script>

<div class="bg-[url('/bg-home.jpg')] bg-[length:100%_100%] bg-center bg-no-repeat w-screen h-screen flex flex-col justify-center items-center">
  {#if form === "login"}
    <div class="flex flex-col justify-center items-center rounded-2xl w-5/6 md:w-4/6 lg:w-1/2 xl:w-2/5 h-3/5 xl:h-4/6 bg-[#3b3b3be6]">
      <h1 class="text-white text-3xl">Sign In/Up</h1>
      <form class="flex flex-col justify-center w-4/5 h-4/5 gap-2">
        <label class="text-white text-xl" for="phone">Phone</label>
        <input class="w-full rounded-lg p-2" id="phone" name="phone" type="tel" placeholder="8005550101" bind:this={phoneRef} required>
        <div class="self-center" id="recaptcha-container"></div>
        {#if isLoading}
          <Loading />
        {:else}
          <button class="rounded-2xl text-black bg-white font-bold py-2 my-10" type="button" on:click={handlePhoneAuth}>Continue</button>
          <div class="flex items-center">
            <div class="grow border-t border-white"></div>
            <span class="mx-2 text-white">OR</span>
            <div class="grow border-t border-white"></div>
          </div>
          <div class="flex justify-evenly py-8">
            <button type="button" on:click={() => handleProviderAuth(googleSignup)}>
              <img src="/logo-google.svg" alt="Google Logo">
            </button>
            <button type="button" on:click={() => handleProviderAuth(appleSignup)}>
              <img src="/logo-apple.svg" alt="Apple Logo">
            </button>
          </div>
        {/if}
      </form>
    </div>
  {:else if form === "verify"}
    <form class="flex flex-col justify-evenly items-center rounded-2xl w-5/6 md:w-4/6 lg:w-1/2 xl:w-2/5 h-3/5 xl:h-4/6 bg-[#3b3b3be6] text-white p-4 md:p-12">
      <h1 class="text-3xl text-center">Verification Code</h1>
      <p class="text-center mt-4">Please enter the code that we have sent to your phone number</p>
      <p>{$userStore.phone}</p>
      <div class="py-8">
        {#key numOfInputs}
          <OtpForm {numOfInputs} {numberOnly} bind:value />
        {/key}
      </div>
      {#if isLoading}
        <Loading />
      {:else}
        <div class="w-full text-center">
          <button class="hover:underline" on:click|preventDefault={handleResendCode}>Resend Code</button>
          <div class="self-center" id="verify-recaptcha-container"></div>
          <button class="w-full rounded-2xl text-black bg-white font-bold py-2 my-10" on:click|preventDefault={handleVerify}>Submit</button>
        </div>
      {/if}
    </form>
  {:else if form === "create"}
    <svelte:component this={CreateUserForm} />
  {/if}
</div>
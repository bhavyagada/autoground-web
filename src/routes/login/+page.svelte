<script lang="ts">
  import { onMount, onDestroy } from "svelte";
  import { goto } from "$app/navigation";
  import { CloudFunctions } from "$lib/functions/all";
  import { call_cloud_function } from "$lib/functions/util";
  import { user_store } from "$lib/stores/auth";
  import { add_toast, auth_store, phone_confirmation_store, phone_sign_up, google_sign_up, apple_sign_up, phone_verify, resend_code_sign_up } from "$lib/stores/auth";
  import { all_cars_store } from "$lib/stores/car";
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
      add_toast("error", errorMap[iti.getValidationError()] || "Invalid number");
      return;
    }
    try {
      isLoading = true;
      await phone_sign_up(iti.getNumber());
      if ($phone_confirmation_store?.confirmation) {
        add_toast("success", "Great! Now please verify your contact!");
        form = "verify"
      }
    } catch (err) {
      add_toast("error", "Server Error! Please try again!");
    } finally {
      isLoading = false;
    }
  }

  const handleProviderAuth = async (providerSignUpFunction: Function) => {
    try {
      isLoading = true;
      const newUser = await providerSignUpFunction();
      $auth_store = { user: newUser?.user, isLoggedIn: false };
      const userResult = await call_cloud_function(CloudFunctions.GET_USER_PROFILE, {});
      if (userResult.isError) {
        if (userResult.errorType === "[user_not_exists]") {
          add_toast("success", "Welcome! Please create your account!");
          form = "create";
        } else {
          add_toast("error", "Server Error! Please try again!");
          form = "login";
        }
      } else {
        $auth_store = { ...$auth_store, isLoggedIn: true };
        $user_store = userResult.result.data;
        const carsResult = await call_cloud_function(CloudFunctions.GET_GARAGE_DATA, {});
        if (carsResult.isError) add_toast("error", "Server Error in fetching Garage Data!");
        else $all_cars_store = carsResult.result.data.cars;
        goto("/");
        add_toast("success", "Successfully Signed In!");
      }
    } catch (err) {
      add_toast("error", "Server Error! Please try again!");
    } finally {
      isLoading = false;
    }
  }

  // verify
  const handleResendCode = async () => {
    if (!$phone_confirmation_store) return;
    if ($phone_confirmation_store.confirmation) {
      try {
        await resend_code_sign_up($phone_confirmation_store.phoneNumber);
      } catch (err) {
        add_toast("error", "Server Error! Please try again!");
      }
    }
  }

  const handleVerify = async () => {
    if (!/[0-9]{6}/.test(value)) return;
    try {
      isLoading = true;
      const newUser: any = await phone_verify(value);
      $auth_store = { user: newUser?.user, isLoggedIn: false };
      try {
        const userResult = await call_cloud_function(CloudFunctions.GET_USER_PROFILE, {});
        if (userResult.isError) {
          if (userResult.errorType === "[user_not_exists]") {
            add_toast("success", "Welcome! Please create your account!");
            form = "create";
          } else {
            add_toast("error", "Server Error! Please try again!");
            form = "login";
          }
        } else {
          $user_store = userResult.result.data;
          const carsResult = await call_cloud_function(CloudFunctions.GET_GARAGE_DATA, {});
          if (carsResult.isError) add_toast("error", "Server Error in fetching Garage Data!");
          else $all_cars_store = carsResult.result.data.cars;
          $auth_store = { ...$auth_store, isLoggedIn: true };
          goto("/");
          add_toast("success", "Successfully Signed In!");
        }
      } catch (err) {
        add_toast("error", "Server Error! Please try again!");
        form = "login";
      }
    } catch (err) {
      add_toast("error", "Incorrect Verification Code! Please Try Again!");
    } finally {
      isLoading = false;
    }
  }

  onDestroy(() => phone_confirmation_store.set(null));
</script>

<div class="bg-[url('src/lib/assets/bg-home.avif')] bg-[length:100%_100%] bg-center bg-no-repeat w-screen h-screen flex flex-col justify-center items-center">
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
            <button type="button" on:click={() => handleProviderAuth(google_sign_up)}>
              <img src="/logo-google.svg" alt="Google Logo">
            </button>
            <button type="button" on:click={() => handleProviderAuth(apple_sign_up)}>
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
      <p>{$user_store.phone}</p>
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
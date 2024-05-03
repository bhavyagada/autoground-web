<script lang="ts">
  import { goto } from "$app/navigation";
  import { CloudFunctions } from "$lib/functions/all";
  import { callCloudFunction } from "$lib/functions/util";
  import { addToast, authData, phoneConfirmationStore, phoneVerify, resendCodeSignUp } from "$lib/stores/auth";
  import { userStore } from "$lib/stores/auth";
  import OtpForm from "./OtpForm.svelte";
  import { onDestroy } from "svelte";
  import Loading from "./Loading.svelte";
  import { allCarsStore } from "$lib/stores/car";

  export let form: string = "login";

  let isLoading: boolean = false;
  let numOfInputs = 6;
	let value = '';
	let numberOnly = true;

  async function handleVerify() {
    console.log("Verification Code", value);
    if (/[0-9]{6}/.test(value)) {
      try {
        isLoading = true;
        const newUser: any = await phoneVerify(value);
        $authData = { user: newUser?.user, isLoggedIn: false };
        console.log(`Phone new sign in: ${JSON.stringify(newUser)}`);
        try {
          const userResult = await callCloudFunction(CloudFunctions.GET_USER_PROFILE, {});
          const carsResult = await callCloudFunction(CloudFunctions.GET_GARAGE_DATA, {});
          if (userResult?.isError || carsResult?.isError) {
            if (userResult?.errorType === "[user_not_exists]") {
              addToast("success", "Welcome! Please create your account!");
              isLoading = false;
              form = "create";
            } else {
              addToast("error", "Server Error! Please try again!");
              isLoading = false;
              form = "login";
            }
          } else {
            $authData = { ...$authData, isLoggedIn: true }
            $userStore = userResult?.result.data;
            $allCarsStore = carsResult?.result.data.cars;
            goto("/");
            addToast("success", "Successfully Signed In!");
            isLoading = false;
          }
        } catch (err) {
          addToast("error", "Server Error! Please try again!");
          isLoading = false;
          form = "login";
        }
      } catch (err) {
        addToast("error", "Incorrect Verification Code! Please Try Again!");
        isLoading = false;
      }
    }
  }

  async function handleResendCode() {
    if ($phoneConfirmationStore?.confirmation) {
      console.log($phoneConfirmationStore.phoneNumber)
      try {
        await resendCodeSignUp($phoneConfirmationStore.phoneNumber);
      } catch (err) {
        addToast("error", "Server Error! Please try again!");
      }
    }
  }

  onDestroy(() => {
    phoneConfirmationStore.set(null);
  });
</script>

<div class="background home">
  <form>
    <h1>Verification Code</h1>
    <p>Please enter the code that we have sent to your phone number</p>
    <p>{$userStore.phone}</p>
    <div class="otpinputs">
      {#key numOfInputs}
        <OtpForm 
          {numOfInputs}
          {numberOnly}
          bind:value
        />
      {/key}
    </div>
    <button class="reverify" on:click|preventDefault={handleResendCode}>Resend Code</button>
    <div id="verify-recaptcha-container" class="recaptcha"></div>
    {#if isLoading}
      <Loading />
    {:else}
      <button on:click|preventDefault={handleVerify} class="submit">Submit</button>
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
    background: var(--homebg1) center / var(--bgsize) var(--bgrepeat);
    display: flex;
    justify-content: space-evenly;
    align-items: center;
    height: 100vh;
    width: 100vw;
    /* height: 600px; */
    overflow: hidden;
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
    align-items: center;
    width: 600px;
    height: 600px;
    gap: 0.5rem;
    background-color: rgb(59 59 59 / 0.9);
    bottom: 0;
    margin-top: 6rem;
    padding: 3rem;
  }
  p:first-of-type {
    margin-top: 2rem;
  }
  p {
    text-align: center;
    color: white;
  }
  .otpinputs {
    display: flex;
    justify-content: center;
    padding: 2rem 0;
  }
  .reverify {
    color: white;
  }
  .reverify:hover {
    text-decoration: underline;
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
</style>

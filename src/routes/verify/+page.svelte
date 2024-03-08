<script lang="ts">
  import { goto } from "$app/navigation";
  import { authStore, confirmationResultStore, phoneVerify } from "../../stores/authStore";
  import { userStore } from "../../stores/userStore";
  import OtpForm from "../../components/OtpForm.svelte";
  import { browser } from "$app/environment";
  import { onDestroy } from "svelte";
  
  let error: boolean = false;
  let errorMessage: string = "";
  let numOfInputs = 6;
	let value = '';
	let numberOnly = true;

  // don't allow users to visit directly
  // if signed in, redirect to home
  // else, redirect to login
  $: if (browser) {
    if ($authStore) {
      goto("/");
    } 

    if (!$confirmationResultStore) {
      goto("/login");
    }
  }

  async function handleVerify(e: Event) {
    e.preventDefault();
    console.log("Verification Code", value);
    if (/[0-9]{6}/.test(value)) {
      try {
        const user = await phoneVerify(value);
        console.log(user);
        if (user !== undefined) {
          // update user auth information in authStore
          authStore.set(user);
          goto("/");
        } else {
          error = true;
          errorMessage = "Incorrect Verification Code! Try Again!"
        }
      } catch (err) {
        error = true;
        console.log(err);
        errorMessage = "Internal Error! Please Try Again!"
      } 
    }
  }

  onDestroy(() => {
    confirmationResultStore.set(null);
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
    {#if error}
      <p class="error">{errorMessage}</p>
    {/if}
    <button class="reverify">Resend Code</button>
    <button on:click={handleVerify} class="submit">Submit</button>
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
  }
  .otpinputs {
    display: flex;
    justify-content: center;
    padding: 2rem 0;
  }
  .error {
    font-size: 1.125rem;
    font-weight: 600;
    line-height: 1.75rem;
    text-align: center;
    color: rgb(239, 68, 68);
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

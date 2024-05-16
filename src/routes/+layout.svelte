<script lang="ts">
  import "../app.css";
  import { page } from "$app/stores";
  import { logout, authData, toast, addToast, defaultUser, otherUserStore } from "$lib/stores/auth";
  import { goto } from "$app/navigation";
  import { userStore } from "$lib/stores/auth";
  import { allCarsStore, carStore, defaultCar, defaultCarModification, modificationStore, otherAllCarsStore } from "$lib/stores/car";
  import { allResultList, bookedResultList } from "$lib/stores/events";
  import { fade } from "svelte/transition";
  import { browser } from "$app/environment";

  /** make navigation collapsible on smaller devices */
  let clicked: boolean = false;
  let smallScreen: boolean = false;
  $: if (browser) window.onresize = () => { smallScreen = window.screen.width < 768; }

  const hangleSignOut = async () => {
    toggleNav();
    await logout();
    $authData = { user: null, isLoggedIn: false };
    $userStore = defaultUser;
    $carStore = defaultCar;
    $modificationStore = defaultCarModification;
    $allCarsStore = [];
    $otherAllCarsStore = [];
    $otherUserStore = null;
    $allResultList = [];
    $bookedResultList = [];
    goto("/login");
    addToast("success", "Do visit us again :)");
  }

  const toggleNav = () => {
    if (smallScreen) {
      const navbar = document.getElementById('navbar-container');
      clicked = !clicked;
      if (clicked) navbar?.classList.remove('hidden');
      else navbar?.classList.add('hidden');
      return true;
    }
  }
</script>

<!-- Insert title and meta content for SEO -->
<svelte:head>
  <title>{$page.data.title}</title>
  <meta name="description" content={$page.data.content}>
</svelte:head>

<!-- Navigation Bar -->
<nav class="fixed bg-inherit z-10">
  <div class="w-screen flex flex-wrap items-center justify-between mx-auto p-4">
    <a href="/" class="p-2 m-2"><img class="w-16 h-16" src="/logo-xcelerate.svg" alt="Logo"></a>
    <button class="inline-flex items-center p-2 m-2 w-10 h-10 justify-center text-sm text-gray-500 rounded-lg md:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600" type="button" on:click={toggleNav}>
      <svg class="w-5 h-5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 17 14"><path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M1 1h15M1 7h15M1 13h15"/></svg>
    </button>
    <div class="hidden w-full md:block md:w-auto" id="navbar-container">
      <ul class="text-lg flex flex-col justify-around md:w-auto md:items-center p-4 md:p-0 border border-white-100 rounded-lg md:flex-row md:space-x-8 rtl:space-x-reverse md:mt-0 md:border-0 bg-black md:bg-inherit">
        {#if $authData.isLoggedIn}
          <li class="w-full">
            <a class="block py-2 px-3 text-gray-900 rounded hover:bg-gray-100 md:hover:bg-transparent md:border-0 md:hover:text-blue-700 md:p-0 dark:text-white md:dark:hover:text-blue-500 dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent" href="/search" on:click={toggleNav}>Search</a>
            <!-- <div class="inline-grid grid-cols-2 items-center">
              <img class="w-5 h-5" src="/searchicon.svg" alt="Search Icon">
              <p>Search</p>
            </div> -->
          </li>
          <li class="w-full">
            <a class="block py-2 px-3 text-gray-900 rounded hover:bg-gray-100 md:hover:bg-transparent md:border-0 md:hover:text-blue-700 md:p-0 dark:text-white md:dark:hover:text-blue-500 dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent" href="/events" on:click={toggleNav}>Events</a>
          </li>
          <li class="w-full whitespace-nowrap">
            <a class="block py-2 px-3 text-gray-900 rounded hover:bg-gray-100 md:hover:bg-transparent md:border-0 md:hover:text-blue-700 md:p-0 dark:text-white md:dark:hover:text-blue-500 dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent" href="/garage" on:click={toggleNav}>My Garage</a>
          </li>
          {#if smallScreen}
            <li class="w-full">
              <a class="block py-2 px-3 text-gray-900 rounded hover:bg-gray-100 md:hover:bg-transparent md:border-0 md:hover:text-blue-700 md:p-0 dark:text-white md:dark:hover:text-blue-500 dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent" href="/account" on:click={toggleNav}>Account</a>
            </li>
            <li class="w-full"> 
              <a class="block py-2 px-3 text-gray-900 rounded hover:bg-gray-100 md:hover:bg-transparent md:border-0 md:hover:text-blue-700 md:p-0 dark:text-white md:dark:hover:text-blue-500 dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent" href="/" on:click|preventDefault={hangleSignOut}>Logout</a>
            </li>
          {:else}
            <li class="w-full"> 
              <a class="block py-2 px-3 text-gray-900 rounded hover:bg-gray-100 md:hover:bg-transparent md:border-0 md:hover:text-blue-700 md:p-0 dark:text-white md:dark:hover:text-blue-500 dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent" href="/" on:click|preventDefault={hangleSignOut}>Logout</a>
            </li>
            <li class="w-full">
              <button on:click={() => {toggleNav(); goto("/account"); }}>
                <img class="rounded-3xl w-12 h-12" src={$userStore.userPhoto ? $userStore.userPhoto : "/default-photo.svg"} alt="Account Page Button">
              </button>
            </li>
          {/if}
        {:else}
          <li class="w-full">
            <a class="block py-2 px-3 text-gray-900 rounded hover:bg-gray-100 md:hover:bg-transparent md:border-0 md:hover:text-blue-700 md:p-0 dark:text-white md:dark:hover:text-blue-500 dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent" href="/events" on:click={toggleNav}>Events</a>
          </li>
          <li class="w-full whitespace-nowrap">
            <a class="block py-2 px-3 text-gray-900 rounded hover:bg-gray-100 md:hover:bg-transparent md:border-0 md:hover:text-blue-700 md:p-0 dark:text-white md:dark:hover:text-blue-500 dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent" href="/login" on:click={toggleNav}>Sign In/Up</a>
          </li>
        {/if}
      </ul>
    </div>
  </div>
</nav>

<!-- Toast -->
{#if $toast}
  <div class="absolute w-full my-20">
    {#if $toast.type === "success"}
      <article class="bg-[#3cb371] text-white flex items-center rounded-lg mx-auto my-6 lg:my-auto py-3 px-6 w-5/6 md:w-2/5" role="alert" transition:fade>
        <img src="/success-icon.svg" alt="Success" />
        <div class="ml-7">{$toast.message}</div>
      </article>
    {:else if $toast.type === "error"}
      <article class="bg-[#cd5c5c] text-white flex items-center rounded-lg mx-auto my-6 lg:my-auto py-3 px-6 w-5/6 md:w-2/5" role="alert" transition:fade>
        <img src="/error-icon.svg" alt="Error" />
        <div class="ml-7">{$toast.message}</div>
      </article>
    {/if}
  </div>
{/if}

<!-- Page Content will be automatically filled in the slot -->
<slot />
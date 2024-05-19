<script lang="ts">
  import logo from "$lib/assets/logo-xcelerate.svg";
  import success_icon from "$lib/assets/success-icon.svg";
  import error_icon from "$lib/assets/error-icon.svg";
  import "../app.css";
  import { page } from "$app/stores";
  import { goto } from "$app/navigation";
  import { browser } from "$app/environment";
  import { fade } from "svelte/transition";
  import { logout, auth_store, user_store, toast, add_toast, default_user, other_user_store } from "$lib/stores/auth";
  import { all_cars_store, car_store, default_car, default_car_modification, modification_store, other_all_cars_store } from "$lib/stores/car";
  import { all_result_list, booked_result_list } from "$lib/stores/events";

  /** make navigation collapsible on smaller devices */
  let clicked: boolean = false;
  $: small_screen = browser && window.screen.width < 768;
  const toggle_nav = () => {
    if (small_screen) {
      clicked = !clicked;
      document.getElementById('navbar-container')?.classList.toggle('hidden', clicked);
    }
  }

  const reset_all_stores = () => {
    $auth_store = { user: null, isLoggedIn: false };
    $user_store = default_user;
    $car_store = default_car;
    $modification_store = default_car_modification;
    $all_cars_store = [];
    $other_all_cars_store = [];
    $other_user_store = null;
    $all_result_list = [];
    $booked_result_list = [];
  }

  const handle_sign_out = async () => {
    toggle_nav();
    await logout();
    reset_all_stores();
    goto("/login");
    add_toast("success", "Do visit us again :)");
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
    <a href="/" class="p-2 m-2"><img class="w-16 h-16" src={logo} alt="Logo"></a>
    <button class="inline-flex items-center p-2 m-2 w-10 h-10 justify-center text-sm text-gray-500 rounded-lg md:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600" type="button" on:click={toggle_nav}>
      <svg class="w-5 h-5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 17 14"><path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M1 1h15M1 7h15M1 13h15"/></svg>
    </button>
    <div class="hidden w-full md:block md:w-auto" id="navbar-container">
      <ul class="text-lg flex flex-col justify-around md:w-auto md:items-center p-4 md:p-0 border border-white-100 rounded-lg md:flex-row md:space-x-8 rtl:space-x-reverse md:mt-0 md:border-0 bg-black md:bg-inherit">
        {#if $auth_store.isLoggedIn}
          <li class="w-full">
            <a class="block py-2 px-3 text-gray-900 rounded hover:bg-gray-100 md:hover:bg-transparent md:border-0 md:hover:text-blue-700 md:p-0 dark:text-white md:dark:hover:text-blue-500 dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent" href="/search" on:click={toggle_nav}>Search</a>
          </li>
          <li class="w-full">
            <a class="block py-2 px-3 text-gray-900 rounded hover:bg-gray-100 md:hover:bg-transparent md:border-0 md:hover:text-blue-700 md:p-0 dark:text-white md:dark:hover:text-blue-500 dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent" href="/events" on:click={toggle_nav}>Events</a>
          </li>
          <li class="w-full whitespace-nowrap">
            <a class="block py-2 px-3 text-gray-900 rounded hover:bg-gray-100 md:hover:bg-transparent md:border-0 md:hover:text-blue-700 md:p-0 dark:text-white md:dark:hover:text-blue-500 dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent" href="/garage" on:click={toggle_nav}>My Garage</a>
          </li>
          {#if small_screen}
            <li class="w-full">
              <a class="block py-2 px-3 text-gray-900 rounded hover:bg-gray-100 md:hover:bg-transparent md:border-0 md:hover:text-blue-700 md:p-0 dark:text-white md:dark:hover:text-blue-500 dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent" href="/account" on:click={toggle_nav}>Account</a>
            </li>
            <li class="w-full"> 
              <a class="block py-2 px-3 text-gray-900 rounded hover:bg-gray-100 md:hover:bg-transparent md:border-0 md:hover:text-blue-700 md:p-0 dark:text-white md:dark:hover:text-blue-500 dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent" href="/" on:click|preventDefault={handle_sign_out}>Logout</a>
            </li>
          {:else}
            <li class="w-full"> 
              <a class="block py-2 px-3 text-gray-900 rounded hover:bg-gray-100 md:hover:bg-transparent md:border-0 md:hover:text-blue-700 md:p-0 dark:text-white md:dark:hover:text-blue-500 dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent" href="/" on:click|preventDefault={handle_sign_out}>Logout</a>
            </li>
            <li class="w-full">
              <button on:click={() => {toggle_nav(); goto("/account"); }}>
                <img class="rounded-3xl w-12 h-12" src={$user_store.userPhoto ? $user_store.userPhoto : "/default-photo.svg"} alt="Account Page Button">
              </button>
            </li>
          {/if}
        {:else}
          <li class="w-full">
            <a class="block py-2 px-3 text-gray-900 rounded hover:bg-gray-100 md:hover:bg-transparent md:border-0 md:hover:text-blue-700 md:p-0 dark:text-white md:dark:hover:text-blue-500 dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent" href="/events" on:click={toggle_nav}>Events</a>
          </li>
          <li class="w-full whitespace-nowrap">
            <a class="block py-2 px-3 text-gray-900 rounded hover:bg-gray-100 md:hover:bg-transparent md:border-0 md:hover:text-blue-700 md:p-0 dark:text-white md:dark:hover:text-blue-500 dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent" href="/login" on:click={toggle_nav}>Sign In/Up</a>
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
        <img src={success_icon} alt="Success" />
        <div class="ml-7">{$toast.message}</div>
      </article>
    {:else if $toast.type === "error"}
      <article class="bg-[#cd5c5c] text-white flex items-center rounded-lg mx-auto my-6 lg:my-auto py-3 px-6 w-5/6 md:w-2/5" role="alert" transition:fade>
        <img src={error_icon} alt="Error" />
        <div class="ml-7">{$toast.message}</div>
      </article>
    {/if}
  </div>
{/if}

<!-- Page Content will be automatically filled in the slot -->
<slot />
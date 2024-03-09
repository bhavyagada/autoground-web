<script lang="ts">
  import "../app.css";
  import { page } from "$app/stores";
  import { logout, user } from "$lib/stores/auth";

  /** To make navigation collapsible on smaller devices */
  let clicked = false;
  function toggleNav(e: Event) {
    e.preventDefault();
    clicked = !clicked;
  }
</script>

<!-- Insert title and meta content for SEO -->
<svelte:head>
  <title>{$page.data.title}</title>
  <meta name="description" content={$page.data.content}>
</svelte:head>

<!-- Navigation Bar -->
<nav class={clicked ? "responsive" : ""}>
  <a href="/" class="logo">
    <img src="/logo-xcelerate.svg" alt="Logo">
  </a>
  <ul>
    <li>
      <a href="/search">
        <div class="search">
          <p>Search</p>
          <img src="/searchicon.svg" alt="Search Icon">
        </div>
      </a>
    </li>
    {#if $user}
      <li>
        <a href="/garage">My Garage</a>
      </li>
      <li>
        <a href="/events">Events</a>
      </li>
      <li> 
        <a href="/" on:click={logout}>Logout</a>
      </li>
    {:else}
      <li>
        <a href="/login">Sign In/Up</a>
      </li>
      <li>
        <a href="/events">Events</a>
      </li>
    {/if}
  </ul>
  <button class="icon" on:click={toggleNav}>
    <img alt="Menu Icon" src="/menu-icon.svg">
  </button>
</nav>

<!-- Page Content will be automatically filled in the slot -->
<slot />

<style>
  .logo {
    padding: 0.5rem;
    margin: 0.5rem;
  }
  .logo img {
    width: 4rem;
    height: 4rem;
  }
  nav {
    overflow: hidden;
    position: absolute;
    width: 100%;
    display: flex;
    justify-content: space-between;
    align-items: center;
    z-index: 10;
    max-height: 23vh;
  }
  nav ul {
    width: 75%;
  }
  nav ul li {
    padding: 0;
    float: right;
    list-style: none;
    display: inline;
    text-align: center;
    padding: 0.75rem 1rem;
    font-size: 1.25rem;
    line-height: 1.75rem;
  }
  nav ul li a {
    text-decoration: none;
    color: white;
  }
  nav .icon {
    display: none;
    background: none;
    border: none;
    margin: 1rem;
  }
  nav .icon img {
    width: 1.5rem;
    height: 1.5rem;
  }
  @media screen and (max-width: 600px) {
    nav ul {
      width: 40%;
    }
    nav li a {
      display: none;
    }
    nav ul li {
      margin: 0;
      padding: 0.25rem 0.5rem;
      font-size: 1.25rem;
      line-height: 1.5rem;
    }
    nav button.icon {
      display: block;
      padding: 0.25rem;
    }
    nav button:hover {
      outline: 1px solid white;
    }
  }

  @media screen and (max-width: 600px) {
    nav.responsive {
      position: absolute;
      flex-wrap: wrap;
      margin-bottom: auto;
    }
    nav.responsive :nth-child(1) {order: 1;}
    nav.responsive :nth-child(2) {order: 3;}
    nav.responsive :nth-child(3) {order: 2;}

    nav.responsive ul li:nth-child(1) {order: 3;}
    nav.responsive ul li:nth-child(2) {order: 2;}
    nav.responsive ul li:nth-child(3) {order: 1;}

    nav.responsive .icon {
      position: relative;
      top: 0;
      right: 0;
    }
    nav.responsive ul {
      width: 100%;
      display: flex;
      flex-direction: column;
    }
    nav.responsive li a {
      float: none;
      display: block;
      text-align: right;
    }
  }
  
  /* search div container */
  .search {
    display: inline-grid; 
    grid-template-columns: auto auto; 
    column-gap: 0.5rem;
    align-items: center;
  }
  .search p:hover {
    text-decoration: underline;
  }
  .search img {
    width: 1.25rem;
    height: 1.25rem;
  }
</style>

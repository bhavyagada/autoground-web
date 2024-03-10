<script>
  import { fade } from "svelte/transition";

  export let type = "error";
</script>

<div>
  <article class={type} role="alert" transition:fade>
    {#if type === "success"}
      <img src="/success-icon.svg" alt="Close Icon" />
    {:else if type === "error"}
      <img src="/error-icon.svg" alt="Close Icon" />
    {/if}

    <div class="text">
      <slot />
    </div>
  </article>
</div>

<style>
  div {
    position: absolute;
    z-index: 3;
    width: 100%;
    margin: 5rem 0;
  }
  article {
    color: white;
    padding: 0.75rem 1.5rem;
    margin: auto;
    border-radius: 0.5rem;
    display: flex;
    align-items: center;
    width: 35rem;
  }
  img {
    margin-right: auto;
  }
  .error {
    background: IndianRed;
  }
  .success {
    background: MediumSeaGreen;
  }
  .text {
    margin-left: 1.75rem;
    font-size: 1.125rem;
  }
</style>

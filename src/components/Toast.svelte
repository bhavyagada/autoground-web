<script>
  import { fade } from "svelte/transition";

  export let type = "error";
</script>

<div class="absolute w-full my-20">
  {#if type === "success"}
    <article class="bg-[#3cb371] text-white flex items-center rounded-lg mx-auto my-6 lg:my-auto py-3 px-6 w-5/6 md:w-2/5" role="alert" transition:fade>
      <img src="/success-icon.svg" alt="Close Icon" />
      <div class="ml-7"><slot /></div>
    </article>
  {:else if type === "error"}
    <article class="bg-[#cd5c5c] text-white flex items-center rounded-lg mx-auto my-6 lg:my-auto py-3 px-6 w-5/6 md:w-2/5" role="alert" transition:fade>
      <img src="/error-icon.svg" alt="Close Icon" />
      <div class="ml-7"><slot /></div>
    </article>
  {/if}
</div>
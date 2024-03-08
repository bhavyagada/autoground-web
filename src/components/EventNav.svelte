<script lang="ts">
  import { page } from "$app/stores";
  let user = false;
  
  const eventNavItems = [
    { name: "All", route: "/events" },
    { name: "Popular", route: "/events/popular" },
    { name: "This Week", route: "/events/week" },
    { name: "Car Show", route: "/events/show" },
    { name: "Park & Chill", route: "/events/chill" },
    { name: "Competition", route: "/events/competition" },
  ];

</script>

<div class="text-white z-10 top-0 left-0 right-0 w-2/3 border rounded-2xl ring-4 ring-blue-600 bg-blend-normal">
  <ul class="flex justify-evenly list-none w-full">
    {#each eventNavItems as item}
      <a href={item.route} ><li class="inline-block text-lg p-4" class:active={$page.url.pathname == item.route}>{item.name}</li></a>
    {/each}
  </ul>
</div>

<style>
  .active {
    text-decoration: underline;
  }
</style>
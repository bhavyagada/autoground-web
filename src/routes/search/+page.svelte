<script lang="ts">
  let searchText = "";
  $: console.log(`search text: ${searchText}`);
</script>

<div class="background">
  <h1>Search</h1>
  <div class="options">
    <p class="selected">People</p>
    <p>Vehicles</p>
    <p>Events</p>
  </div>
  <input bind:value={searchText} type="text" class="search" name="search" placeholder="       Search people, vehicles, or events">
  <div class="results">
    
  </div>
</div>

<style>
  h1 {
    font-size: 1.5rem;
    line-height: 2rem;
    margin-top: 6rem;
    color: white;
  }
  .background {
    background-color: rgb(24, 24, 24);
    width: 100vw;
    height: 100vh;
    position: absolute;
    display: flex;
    flex-direction: column;
    align-items: center;
    z-index: 1;
  }
  .options {
    display: flex;
    justify-content: space-evenly;
    background-color: rgb(51, 55, 64);
    color: white;
    border-radius: 0.75rem;
    width: 95%;
    font-size: 1.125rem;
    line-height: 2rem;
    padding: 1rem;
    margin-top: 3rem;
  }
  .options p {
    flex: 30%;
    text-align: center;
    padding: 0.25rem 0;
  }
  .selected {
    background-color: rgba(217, 217, 217, 0.3);
    border-radius: 0.5rem;
  }
  .search {
    background: url("/searchicon.svg") no-repeat left;
    background-color: rgb(51, 55, 64);
    background-origin: content-box;
    color: white;
    width: 95%;
    padding: 0.25rem 0.75rem;
    border-radius: 0.75rem;
    line-height: 2rem;
    font-size: 1.125rem;
    margin-top: 3rem;
  }
  @media all and (min-width:700px) {
    h1 {
      font-size: 2.25rem;
      line-height: 2.5rem;
      margin-top: 8rem;
      color: white;
      flex-grow: 1;
      width: 100%;
      text-align: center;
    }
  }
</style>
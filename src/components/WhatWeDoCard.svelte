<script lang="ts">
  export let iconpath: string;
  export let title: string;
  export let subtitle: string;
  export let features: Array<string>;
  export let description: string;
  export let buttonText: string;
  export let buttonSubmit: any;
</script>

<div class="card">
  <img src={iconpath} alt={title} class="h-16 w-16">
  <h1>{title}</h1>
  <p>{subtitle}</p>
  <ul>
    {#each features as feature}
      <li>{feature}</li>
    {/each}
  </ul>
  <p>{description}</p>
  <button on:click={() => { buttonSubmit(); }}>{buttonText}</button>
</div>

<style>
  h1 {
    font-size: 1.5rem;
    line-height: 2rem;
    margin-bottom: 1.5rem;
  }
  p {
    margin-bottom: 1.5rem;
  }
  ul {
    display: flex;
    flex-direction: column;
    list-style: disc;
    list-style-position: inside;
    margin-bottom: 1.5rem;
    width: 100%;
  }
  button {
    font-size: 1.125rem;
    line-height: 1.75rem;
    border: 1px solid white;
    border-radius: 0.5rem;
    width: 11rem;
    height: 4rem;
    margin: 1.5rem;
  }

  .card {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    background-color: rgb(255 255 255 / 0.2);
    font-size: 1.125rem;
    line-height: 1.75rem;
    border-radius: 1rem;
    padding: 1.5rem;
    margin: 2rem 0;
  }
  .card > :last-child {
    margin-top: auto;
  }

  @media all and (min-width: 900px) {
    h1 {
      font-size: 1.875rem;
      line-height: 2.25rem; 
    }
    .card {
      width: 28%;
      margin: 5rem 0;
      padding: 2rem;
    }
  }
</style>
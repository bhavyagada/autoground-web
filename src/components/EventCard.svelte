<script lang="ts">
  export let imageSrc: string;
  export let name: string;
  export let datetime: string;
  export let location: string;
  export let price: string;
</script>

<div>
  <img alt="Event" src={imageSrc}>
  <h1>{name}</h1>
  <a href={datetime}>{datetime}</a>
  <p>{location}</p>
  <p>{price ? "From $" + price : "Free"}</p>
</div>

<style>
  div {
    width: 340px;
    height: 340px;
  }
</style>
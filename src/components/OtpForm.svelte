<script lang="ts">
  import { afterUpdate } from "svelte";
  import OtpItem from "./OtpItem.svelte";

  export let numOfInputs:number = 6;
  export let value = "";
  export let numberOnly = true;

  let codes: string[] = [
    ...value.slice(0, numOfInputs).split(""),
    ...Array(numOfInputs <= value.length ? 0 : numOfInputs - value.length).fill("")
  ];
  let inputs: (HTMLInputElement | null)[] = Array(numOfInputs).fill(null);

  afterUpdate(() => {
    codes = [
      ...value.slice(0, numOfInputs).split(''),
		  ...Array(numOfInputs <= value.length ? 0 : numOfInputs - value.length).fill('')
    ];
  });

  $: value = codes.join("");
</script>

<div class="flex items-center gap-1 md:gap-2 lg:gap-4">
  {#each codes as value, i (i)}
      <OtpItem num={numberOnly} bind:input={inputs[i]} bind:value index={i} bind:codes {inputs} />
  {/each}
</div>
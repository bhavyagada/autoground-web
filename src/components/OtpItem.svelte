<script lang="ts">
  import { onMount } from "svelte";

  export let input: HTMLElement | null = null;
  export let index: number;
  export let value: string;
  export let codes: string[];
  export let inputs: (null | HTMLInputElement)[];
  export let num: boolean;

  let key: string;

  onMount(() => inputs[0]?.focus());

  // shift focus to the next input box
  function shiftFocus(key: string) {
    if ((!/[0-9]/.test(key) && num && key) || key === "ArrowRight" || key === "ArrowLeft" || key === "Backspace") return;
    if (value === " ") {
      value = '';
      return;
    }
    if (index !== inputs.length - 1) (inputs[index + 1] as HTMLInputElement).focus();
  }

  // prevent undo
  function keyDownHandler(e: KeyboardEvent) {
    if (e.ctrlKey && e.key === "z") e.preventDefault();
    key = e.key;
    if (value.length >= 1 && !e.ctrlKey) shiftFocus(key);
  }

  // do not insert text if its not a number
  function typeHandler(e: KeyboardEvent) {
    if (value.length >= 1 || (!/[0-9]/.test(e.key) && num)) e.preventDefault();
  }

  // update codes array based on input value and shift focus
  function changeHandler(e: Event) {
    const val = (e.target as HTMLInputElement).value;
    if (/[0-9]/.test(val) || !num || !val) {
      codes = codes.map((c, i) => {
        if (i < index) return c === "" ? "" : c;
        else if (i === index) return val[0];
        return c;
      });
      // value = val[0]
      if (!val) {
        const len = codes.length;
        const filtered = codes.filter((_, i) => i !== index);
        codes = [...filtered, ...Array(len - filtered.length).fill("")]
      }
      shiftFocus(key);
    }
  }

  // shift focus on arrow button clicks or backspace
  function keyUpHandler(e: KeyboardEvent) {
    if ((e.key === "Backspace" || e.key === "ArrowLeft") && index !== 0) inputs[index - 1]?.focus();
    else if (e.key === "ArrowRight" && index !== inputs.length - 1) inputs[index + 1]?.focus();
  }

  // handle code paste from clipboard
  function pasteHandler(e: ClipboardEvent) {
    e.preventDefault();
    const paste = e.clipboardData?.getData('text');
    if (!paste) return;
    let pasteValue = paste.replace(num ? /[^0-9]/g : "", "").slice(0, codes.length - index);
    const newCodes = [
      ...codes.slice(0, index),
      ...pasteValue.split(""),
      ...codes.slice(index + pasteValue.length)
    ];
    codes = newCodes;
  }
</script>

<input class="bg-[#3b3b3be6] text-white text-center text-xl border border-white border-solid rounded-lg w-10 md:w-12 h-12 md:h-16"
  bind:this={input}
  on:keydown={keyDownHandler}
  on:keyup={keyUpHandler}
  on:keypress={typeHandler}
  on:input={changeHandler}
  on:paste={pasteHandler}
  {value}
/>
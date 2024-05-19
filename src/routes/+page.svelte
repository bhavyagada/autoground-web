<script lang="ts">
  import logo from "$lib/assets/logo-xcelerate.svg";
  import { goto } from "$app/navigation";
  import { add_toast, auth_store } from "$lib/stores/auth";
  import { all_cars_store } from "$lib/stores/car";

  let index: number = 0; // index state for cars in virtual garage

  const handleEventButtonClick = () => {
    if (!$auth_store.isLoggedIn) {
      add_toast("error", "Please Sign in to Book or Host Events!");
      goto("/login");
    } 
    else goto("/events");
  }
</script>

<!-- Main page-->
<div class="bg-[url('/bg-home.jpg')] bg-[length:100%_100%] bg-center bg-no-repeat h-screen flex flex-col justify-center items-center text-white text-center">
  <h1 class="text-3xl md:text-4xl lg:text-5xl p-1">Drive your passion</h1>
  <h2 class="text-base md:text-lg lg:text-xl p-1">Book, create and view events through Xcelerate. An all in one place for all car enthusiasts.</h2>
  <button class="border border-white border-solid rounded-lg h-16 w-44 text-lg m-6" on:click={() => goto("/events")}>Explore Events</button>
</div>

<!-- What We Do -->
<div class="bg-[url('/bg-what-we-do.jpg')] bg-[length:100%_100%] bg-center bg-no-repeat flex flex-col justify-center items-center text-white">
  <h1 class="text-2xl md:text-3xl lg:text-4xl p-1 mt-16">What We Do</h1>
  <div class="flex flex-col lg:flex-row w-4/5 lg:w-full lg:justify-evenly">
    <div class="flex flex-col justify-center items-center bg-white/20 text-lg rounded-2xl p-6 lg:p-8 my-8 lg:my-20 lg:w-[30%]">
      <img src="/eventsbook.svg" alt="Find Events" class="h-16 w-16">
      <h1 class="text-2xl mb-6 lg:text-3xl">Find Events</h1>
      <p class="mb-6">Discover your next car show experience with our all-in-one platform</p>
      <ul class="flex flex-col list-disc list-inside w-full mb-6">
        <li>Purchasing Tickets</li>
        <li>Entering Contests</li>
        <li>QR code for seamless event entry</li>
      </ul>
      <p class="mb-6">
        Whether you're a passionate enthusiast or an avid attendee, our comprehensive solution
        simplifies the process, ensuring you never miss out on the excitement of the automative
        world. Join us and elevate your car show experience today.
      </p>
      <button class="border border-white border-solid rounded-lg h-16 w-44 text-lg mt-auto m-6" 
        on:click={handleEventButtonClick}>Book Events</button>
    </div>
    <div class="flex flex-col justify-center items-center bg-white/20 text-lg rounded-2xl p-6 lg:p-8 my-8 lg:my-20 lg:w-[30%]">
      <img src="/eventshost.svg" alt="Host Events" class="h-16 w-16">
      <h1 class="text-2xl mb-6 lg:text-3xl">Host Events</h1>
      <p class="mb-6">Empower your automative community by hosting and creating events effortlessly with our platform</p>
      <ul class="flex flex-col list-disc list-inside w-full mb-6">
        <li>Plan and organize car shows, meets and gatherings</li>
        <li>Invite enthusiasts to connect and share their passion for cars</li>
      </ul>
      <p class="mb-6">
        From setting up event details to managing attendee RSVPs, our user-friendly interface simplifies
        the event creation process, ensuring a smooth experience for both organizers and participants.
      </p>
      <button class="border border-white border-solid rounded-lg h-16 w-44 text-lg mt-auto m-6" 
        on:click={handleEventButtonClick}>Host Events</button>
    </div>
  </div>
</div>

<!-- My Garage -->
<div class="bg-[url('/bg-my-garage.jpg')] bg-[length:100%_100%] bg-center bg-no-repeat h-screen flex flex-col justify-center items-center text-white text-center mygarage">
  <div class="justify-self-start mt-10 mb-8">
    <h1 class="text-2xl md:text-3xl lg:text-4xl p-1">My Garage</h1>
    {#if !$auth_store.isLoggedIn}
      <h2 class="text-base md:text-lg lg:text-xl p-1">Sign in to see your cars in My Garage. Record all your modifications in one place to increase your points and allow others to see.</h2>
    {/if}
  </div>
  {#if $auth_store.isLoggedIn}
    {#if $all_cars_store.length > 0}
      <div class="flex justify-evenly w-5/6 h-3/5">
        <button class="w-5 md:w-6 h-5 md:h-6 self-center mx-8" on:click={() => { index = index > 0 ? index - 1 : $all_cars_store.length - 1; }}>
          <img src="/chevron-left.svg" alt="Left Arrow">
        </button>
        <button class="w-2/4 md:w-2/6 h-1/5 md:h-1/5 mt-56 lg:mt-32" on:click={() => goto(`/garage/${index+1}`)}>
          <img src={$all_cars_store[index].coverPhoto} alt="My Garage Car">
        </button>
        <button class="w-5 md:w-6 h-5 md:h-6 self-center mx-8" on:click={() => { index = index < $all_cars_store.length - 1 ? index + 1 : 0; }}>
          <img src="/chevron-right.svg" alt="Right Arrow">
        </button>
      </div>
      <p class="text-xl md:text-2xl">{$all_cars_store[index].year} {$all_cars_store[index].make} {$all_cars_store[index].model}</p>
      <p>{$all_cars_store[index].points} points</p>
    {:else}
      <p>Cars added to Your Garage will be shown here!</p>
    {/if}
    <button class="border border-white border-solid rounded-xl h-14 w-44 text-lg m-6"
      on:click={() => { goto("/garage"); }}>View My Garage</button>
  {:else}
    <div class="flex justify-center h-2/5 mt-auto">
      <img class="w-5 md:w-6 h-5 md:h-6 self-center" src="/chevron-left.svg" alt="Left Arrow">
      <img class="w-5/6 h-5/6 self-end" src="/homepage-car.svg" alt="My Garage Example Car">
      <img class="w-5 md:w-6 h-5 md:h-6 self-center" src="/chevron-right.svg" alt="Right Arrow">
    </div>
    <p class="text-xl md:text-2xl">2020 BMW M4</p>
    <p>1200 points</p>
    <div class="mt-auto mb-16 h-16 w-44"></div>
  {/if}
</div>

<!-- Message Us -->
<div class="bg-[url('/bg-message-us.jpg')] bg-[length:100%_100%] bg-center bg-no-repeat h-screen flex flex-col justify-center items-center text-white messageus">
  <h1 class="text-2xl md:text-3xl lg:text-4xl p-1 mt-16 mb-12">Message Us</h1>
  <form class="flex flex-col justify-center w-4/5 md:w-1/3 lg:w-1/2 xl:w-1/3">
    <label class="p-2 text-lg" for="name">Name</label>
    <input class="p-2 bg-white/20 rounded-xl text-lg w-full h-12" type="text" name="name" />
    <label class="p-2 text-lg" for="email">Email</label>
    <input class="p-2 bg-white/20 rounded-xl text-lg w-full h-12" type="email" name="email" />
    <label class="p-2 text-lg" for="message">Message</label>
    <textarea class="p-2 bg-white/20 rounded-xl text-lg w-full" name="message" rows="8" cols="10"></textarea>
    <button class="bg-white text-xl text-black rounded-2xl font-medium h-12 w-full my-12 p-2" type="submit">Submit</button>
  </form>
</div>

<!-- Footer -->
<div class="flex flex-col lg:flex-row justify-evenly bg-black text-white p-4">
  <img class="w-28 h-28 self-center" src={logo} alt="Xcelerate Logo">
  <div>
    <p class="font-bold text-lg mt-auto text-center py-4">Contact</p>
    <address class="text-center py-1">
      10551 Garden Grove Blvd<br>
      Garden Grove, CA, 90000
    </address>
    <p class="text-center py-1">info@email.com</p>
  </div>
  <div>
    <p class="font-bold text-lg mt-auto text-center py-4">Information</p>
    <p class="text-center py-1">About Us</p>
    <p class="text-center py-1">Terms of Service</p>
    <p class="text-center py-1">FAQ</p>
  </div>
  <div class="flex flex-col items-center">
    <button class="flex justify-center items-center w-full md:w-1/2 lg:w-full border-none rounded-xl bg-white/20 font-bold px-4 my-3"
      on:click={() => { window.open("https://play.google.com/store/apps/details?id=com.xcelerate.xcelerate", "_blank"); }}>
      <span class="w-8"><img src="/logo-google.svg" alt="Google Logo"></span>
      <p class="p-4">Download App</p>
    </button>
    <button class="flex justify-center items-center w-full md:w-1/2 lg:w-full border-none rounded-xl bg-white/20 font-bold px-4 my-3"
      on:click={() => { window.open("https://apps.apple.com/us/app/autolnk/id6478376890", "_blank"); }}>
      <span class="w-8"><img src="/logo-apple.svg" alt="Apple Logo"></span>
      <p class="p-4">Download App</p>
    </button>
  </div>
</div>
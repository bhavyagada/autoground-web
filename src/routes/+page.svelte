<script lang="ts">
  import { goto } from "$app/navigation";
  import { addToast, authData } from "$lib/stores/auth";
  import { allCarsStore } from "$lib/stores/car";
  import Card from "../components/WhatWeDoCard.svelte";

  const bookEvents = [
    "Purchasing Tickets",
    "Entering Contests",
    "QR code for seamless event entry"
  ];

  const hostEvents = [
    "Plan and organize car shows, meets and gatherings",
    "Invite enthusiasts to connect and share their passion for cars",
  ];

  const buttonSubmit = () => {
    if (!$authData.isLoggedIn) {
      addToast("error", "Please Sign in to Book or Host Events!");
      goto("/login");
    } 
    else goto("/events");
  }

  let coverPhotos: Array<string | null> = [];
  let photosLength: number;
  let years: Array<number | null> = [];
  let makes: Array<string | null> = [];
  let models: Array<string | null> = [];
  let modificationCounts: Array<number | undefined> = [];
  let points: Array<number | null> = [];
  let index: number = 0;

  console.log($allCarsStore);
  $allCarsStore.forEach(car => coverPhotos.push(car.coverPhoto));
  $allCarsStore.forEach(car => years.push(car.year));
  $allCarsStore.forEach(car => makes.push(car.make));
  $allCarsStore.forEach(car => models.push(car.model));
  $allCarsStore.forEach(car => modificationCounts.push(car.modifications?.length));
  $allCarsStore.forEach(car => points.push(car.points));
  photosLength = coverPhotos.length;

  const onPrev = () => {
    index = index > 0 ? index - 1 : photosLength - 1;
    console.log(`prev index ${index}`);
  }

  const onNext = () => {
    index = index < photosLength - 1 ? index + 1 : 0;
    console.log(`next index ${index}`);
  }

  const handleCarClick = () => {
    goto(`/garage/${index+1}`);
  }
</script>

<!-- Main page-->
<div class="background home">
  <h1>Drive your passion</h1>
  <h2>Book, create and view events through Xcelerate. An all in one place for all car enthusiasts.</h2>
  <button on:click={() => goto("/events")}>Explore Events</button>
</div>

<!-- Scroll to What We Do -->
<div class="background whatwedo">
  <h1>What We Do</h1>
  <div class="cards">
    <Card 
      iconpath="/eventsbook.svg"
      title="Find Events"
      subtitle="Discover your next car show experience with our all-in-one platform"
      features={bookEvents}
      description="Whether you're a passionate enthusiast or an avid attendee, our comprehensive solution
      simplifies the process, ensuring you never miss out on the excitement of the automative
      world. Join us and elevate your car show experience today."
      buttonText="Book Events"
      {buttonSubmit}
    />
    <Card
      iconpath="/eventshost.svg"
      title="Host Events"
      subtitle="Empower your automative community by hosting and creating events effortlessly with our platform"
      features={hostEvents}
      description="From setting up event details to managing attendee RSVPs, our user-friendly interface simplifies
      the event creation process, ensuring a smooth experience for both organizers and participants."
      buttonText="Host Events"
      {buttonSubmit}
    />
  </div>
</div>

<!-- Scroll to My Garage -->
<div class="background mygarage">
    <div class="titles">
      <h1>My Garage</h1>
      {#if !$authData.isLoggedIn}
        <h2>Sign in to see your cars in My Garage. Record all your modifications in one place to increase your points and allow others to see.</h2>
      {/if}
    </div>
    {#if $authData.isLoggedIn}
      {#if $allCarsStore.length > 0}
        <div class="in-carwitharrows">
          <button class="lefticon" on:click={onPrev}><img src="/chevron-left.svg" alt="Left Arrow" class="lefticon"></button>
          <button class="car" on:click={handleCarClick}><img src={coverPhotos[index]} alt="My Garage Example Car"></button>
          <button class="righticon" on:click={onNext}><img src="/chevron-right.svg" alt="Right Arrow" class="righticon"></button>
        </div>
        <p class="in-car-details">{years[index]} {makes[index]} {models[index]}</p>
        <p class="in-car-details">{points[index]} points</p>
      {:else}
        <p>Cars added to Your Garage will be shown here!</p>
      {/if}
      <button on:click={() => { goto("/garage"); }}>View My Garage</button>
    {:else}
      <div class="carwitharrows">
        <img src="/chevron-left.svg" alt="Left Arrow" class="lefticon">
        <img src="/homepage-car.svg" alt="My Garage Example Car" class="out-car">
        <img src="/chevron-right.svg" alt="Right Arrow" class="righticon">
      </div>
      <p>2020 BMW M4</p>
      <p>1200 points</p>
      <div class="empty"></div>
    {/if}
</div>

<!-- Scroll to Message Us -->
<div class="background messageus">
  <h1>Message Us</h1>
  <form>
    <lable for="name">Name</lable>
    <input type="text" name="name" />
    <lable for="email">Email</lable>
    <input type="email" name="email" />
    <lable>Message</lable>
    <textarea rows="8" cols="10"></textarea>
    <button type="submit" class="submit">Submit</button>
  </form>
</div>

<div class="footer">
  <img src="/logo-xcelerate.svg" alt="Xcelerate Logo">
  <div class="contact-info">
    <p class="title">Contact</p>
    <address>
      10551 Garden Grove Blvd<br>
      Garden Grove, CA, 90000
    </address>
    <p>info@email.com</p>
  </div>
  <div class="contact-info">
    <p class="title">Information</p>
    <p>About Us</p>
    <p>Terms of Service</p>
    <p>FAQ</p>
  </div>
  <div class="apps">
    <button on:click={() => { window.open("https://play.google.com/store/apps/details?id=com.xcelerate.xcelerate", "_blank"); }}>
      <span>
        <img src="/logo-google.svg" alt="Google Logo">
      </span>
      <p>Download App</p>
    </button>
    <button on:click={() => { window.open("https://apps.apple.com/us/app/autolnk/id6478376890", "_blank"); }}>
      <span>
        <img src="/logo-apple.svg" alt="Apple Logo">
      </span>
      <p>Download App</p>
    </button>
  </div>
</div>

<style>
  h1 {
    font-size: 2rem;
    line-height: 1;
  }
  h2 {
    font-size: 1rem;
    line-height: 1.375rem;
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
  .background {
    width: var(--bgwidth);
    height: var(--bgheight);
    position: relative;
    z-index: 1; 
    color: white;
  }
  .home {
    background: var(--homebg1) center / var(--bgsize) var(--bgrepeat);
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    height: 100vh;
  }
  .home > * {
    text-align: center;
    padding: 0.25rem;
  }
  .whatwedo {
    background: var(--homebg2) center / var(--bgsize) var(--bgrepeat);
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
  }
  .whatwedo h1 {
    margin-top: 3rem;
  }
  .cards {
    display: flex;
    flex-direction: column;
    width: 85%;
  }
  .mygarage {
    background: var(--homebg3) center / var(--bgsize) var(--bgrepeat);
    display: flex;
    flex-direction: column;
    align-items: center;
    height: 100vh;
  }
  .mygarage .titles > * {
    text-align: center;
    padding: 0.75rem;
  }
  .titles {
    justify-self: flex-start;
    margin-top: 2.5rem;
    margin-bottom: 2rem;
  }
  .carwitharrows {
    display: flex;
    justify-content: center;
    height: 40%;
    margin-top: auto;
  }
  .in-carwitharrows {
    display: flex;
    justify-content: center;
    width: 100%;
    height: 60%;
  }
  .in-carwitharrows .car {
    width: 30%;
    height: 30%;
    margin-top: 7rem;
  }
  .in-carwitharrows button {
    border: none;
  }
  .out-car {
    width: 85%;
    height: 85%;
    align-self: flex-end;
  }
  .lefticon, .righticon {
    width: 1.25rem;
    height: 1.25rem;
    align-self: center;
  }
  .mygarage p:first-of-type {
    font-size: 1.25rem;
    line-height: 2rem;
  }
  .empty {
    margin-top: auto;
    margin-bottom: 4rem;
    width: 11rem;
    height: 4rem;
  }
  .messageus {
    background: var(--homebg4) center / var(--bgsize) var(--bgrepeat);
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    height: 100vh;
  }
  .messageus h1 {
    margin-bottom: 3rem;
  }
  .messageus form {
    display: flex;
    flex-direction: column;
    justify-content: center;
    width: 80%;
  }
  .messageus form > * {
    padding: 0.5rem;
  }
  .messageus form input, textarea {
    background-color: rgba(255, 255, 255, 0.2);
    border-radius: 0.5rem;
    font-size: large;
    width: 100%;
  }
  .messageus form input {
    height: 2rem;
  }
  .submit {
    background-color: white;
    color: black;
    border-radius: 1rem;
    font-weight: 700;
    height: 3rem;
    width: 100%;
    margin: 3rem 0;
  }
  .footer {
    background-color: black;
    color: white;
    display: flex;
    flex-direction: column;
    justify-content: space-evenly;
    padding: 1rem;
  }
  .footer img:first-of-type {
    width: 7rem;
    height: 7rem;
    align-self: center;
  }
  .contact-info .title {
    padding: 1rem 0;
    font-size: large;
    font-weight: 700;
    margin-top: auto;
    text-align: center;
  }
  .contact-info address {
    text-align: center;
  }
  .contact-info > p:not(:first-child) {
    text-align: center;
  }
  .apps {
    display: flex;
    flex-direction: column;
    align-items: center;
  }
  .apps button {
    border: none;
    background-color: rgba(255, 255, 255, 0.2);
    font-weight: 700;
    display: flex;
    justify-content: center;
    align-items: center;
    width: 100%;
    padding: 0 1rem;
    margin: 0.75rem 0;
  }
  .apps button span {
    width: 2rem;
  }
  .apps button p {
    padding: 1rem;
  }
  .contact-info *:not(:first-child) {
    padding: 0.25rem 0;
  }
  @media all and (min-width: 700px) {
    h1 {
      font-size: 2.25rem;
    }
    h2 {
      font-size: 1.125rem;
      line-height: 1.75rem;
    }
    .lefticon, .righticon {
      width: 1.5rem;
      height: 1.5rem;
    }
    .mygarage p:first-of-type {
      font-size: 1.5rem;
    }
    .messageus form {
      width: 30%;
    }
    .messageus form input {
      height: 3rem;
    }
    .apps button {
      width: 50%;
    }
  }
  @media all and (min-width: 900px) {
    h1 {
      font-size: 3rem;
    }
    h2 {
      font-size: 1.25rem;
      line-height: 1.75rem;
    }
    .cards {
      flex-direction: row;
      justify-content: space-evenly;
      width: 100%;
    }
    .messageus form {
      width: 50%;
    }
    .footer {
      flex-direction: row;
    }
    .apps button {
      width: 100%;
    }
  }
  @media all and (min-width: 1300px) {
    .carwitharrows {
      height: 45%;
    }
    .car {
      width: 100%;
    }
    .messageus form {
      width: 30%;
    }
  }
</style>

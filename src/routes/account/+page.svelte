<script lang="ts">
  import { userStore } from "$lib/stores/auth";
  import { callFunction, uploadPic } from "$lib/functions/util";
  import { addToast, authData } from "$lib/stores/auth";
  import UpdateForm from "../../components/UpdateForm.svelte";
  import { AuthProviderId } from "$lib/types";
  import { cloudFunctions } from "$lib/functions/all";

  let userPhoto: any = $userStore.userPhoto ? $userStore.userPhoto : "/default-photo.svg";
  let name: string | null = $userStore.name ? $userStore.name : "";
  let userName: string | null = $userStore.userName ? $userStore.userName : "";
  let phoneNumber: string | null = $userStore.phone ? $userStore.phone : "";
  let email: string | null = $userStore.email ? $userStore.email : "" ;
  let bio: string | null = $userStore.bio ? $userStore.bio : "" ;
  let type: any;

  $: userPhoto = $userStore.userPhoto;
  $: name = $userStore.name;
  $: userName = $userStore.userName;
  $: phoneNumber = $userStore.phone;
  $: email = $userStore.email;
  $: bio = $userStore.bio;

  let profilePhoto: HTMLElement;
  const handleFileUpload = () => {
    profilePhoto.click();
  }

  const loadFile = async (e: any) => {
    const imageFile: any = e.target.files[0];
    userPhoto = await uploadPic(imageFile, `UsersProfilePhoto/${$authData?.user?.uid}`);
    const result = await callFunction(cloudFunctions.UPDATE_USER_PHOTO, { userPhoto: userPhoto });
    if (result?.isError) {
      addToast("error", "Server Error! Please Try Again!");
    } else {
      addToast("success", "Photo updated successfully!");
      $userStore = { ...$userStore, userPhoto };
    }
  }

  let clicked = false;
  const toggleModal = () => {
    clicked = !clicked;
  }

  const openNameModal = () => { type = "name"; toggleModal(); };
  const openUserNameModal = () => { type = "username"; toggleModal(); };
  const openBioModal = () => { type = "bio"; toggleModal(); };
  const openPhoneModal = () => { type = "phone"; toggleModal(); };
  const openEmailModal = () => { type = "email"; toggleModal(); };
</script>

<div class="update-form">
  {#if clicked}
    <UpdateForm {type} {clicked} {toggleModal} />
  {/if}
</div>
<div class="background">
  <div class={clicked ? "blured banner" : "banner"}>
    <img class="banner-photo" alt="Profile" src={$userStore.userPhoto}>
    <div class="name-username">
      <p>{$userStore.name}</p>
      <p>{$userStore.userName}</p>
    </div>
    <div class="points">
      <img alt="Points Icon" src="/points-icon.svg">
      <p>{$userStore.points} points</p>
    </div>
    <img class="qr" alt="Username QR Code" src="https://api.qrserver.com/v1/create-qr-code/?size=150x150&data={userName}">
  </div>
  <form class={clicked ? "blured" : ""}>
    <div class="form-top">
      <button on:click={handleFileUpload} class="photo">
        <input bind:this={profilePhoto} bind:value={userPhoto} on:change={loadFile} type="file" class="hidden" name="photo" accept="image/*">
        <img alt="Upload Profile" src={userPhoto ? userPhoto : "/default-photo.svg"}>
      </button>
      <div class="name-phone-container">
        <label for="name">Name</label>
        <input bind:value={name} on:click|preventDefault={openNameModal} class="edit" type="text" name="name" maxlength="50" readonly>
        <div class="name-phone">
          <div class="username">
            <label for="">Username</label>
            <input bind:value={userName} on:click|preventDefault={openUserNameModal} class="edit" type="text" name="username" minlength="3" maxlength="20" readonly>
          </div>
          <div class="phonenumber">
            <label for="phone">Phone Number</label>
            <input bind:value={phoneNumber} on:click|preventDefault={openPhoneModal} id="phone" class={$authData.user?.providerData[0].providerId === AuthProviderId.PHONE ? "phone" : "phone edit"} type="tel" name="phonenumber" disabled={$authData.user?.providerData[0].providerId === AuthProviderId.PHONE}>
          </div>
        </div>
      </div>
    </div>
    <div class="email">
      <label for="email">Email</label>
      <input bind:value={email} on:click|preventDefault={openEmailModal} class={$authData.user?.providerData[0].providerId === AuthProviderId.GOOGLE || $authData.user?.providerData[0].providerId === AuthProviderId.APPLE ? "" : "edit"} type="email" name="email" disabled={$authData.user?.providerData[0].providerId === AuthProviderId.GOOGLE || $authData.user?.providerData[0].providerId === AuthProviderId.APPLE}>
    </div>
    <div class="bio">
      <label for="bio">Bio</label>
      <textarea bind:value={bio} on:click|preventDefault={openBioModal} class="edit-top" name="bio" maxlength="1000" readonly/>
    </div>
  </form>
</div>

<style>
  .update-form {
    position: absolute;
    display: flex;
    justify-content: center;
    align-items: center;
    width: 100vw;
    height: 100vh;
  }
  .background {
    width: var(--bgwidth);
    height: var(--bgheight);
    background-color: rgb(24, 24, 24);
    width: 100vw;
    height: 100vh;
    display: flex;
    flex-direction: column;
    justify-content: space-evenly;
    align-items: center;
    position: relative;
  }
  .banner {
    background-color: rgba(59, 59, 59, 0.9);
    border-radius: 1rem;
    padding: 1rem 0;
    width: 90vw;
    display: flex;
    justify-content: space-evenly;
    align-items: center;
    color: white;
    position: relative;
  }
  .banner-photo {
    width: 4rem;
    height: 4rem;
    border-radius: 3rem;
    align-self: center;
  }
  .points {
    display: flex;
    flex-direction: column;
    justify-content: center;
  }
  .points img {
    width: 1.5rem;
    height: 1.5rem;
    align-self: center;
  }
  .blured {
    filter: blur(2px);
    pointer-events: none;
  }
  form {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    height: 50%;
    width: 100%;
    padding: 1rem;
    z-index: 1;
  }
  form label {
    font-size: 1rem;
    line-height: 1rem;
    margin: 0.5rem 0;
    color: white;
  }
  input, textarea {
    background-color: rgb(51, 55, 64);
    width: 100%;
    border-radius: 0.5rem;
    padding: 0.5rem;
    color: white;
  }
  input:hover, textarea:hover {
    cursor: pointer;
  }
  input:focus, textarea:focus {
    cursor: none;
    outline: none;
  }
  textarea {
    height: 150px;
  }
  .form-top, .name-phone-container, .name-phone, .username, .phonenumber, .email, .bio {
    display: flex;
    flex-direction: column;
    width: 100%;
  }
  .form-top button {
    align-self: center;
  }
  .photo img {
    width: 6rem;
    height: 6rem;
    border-radius: 3rem;
    align-self: center;
  }
  .name-phone-container label * {
    align-self: flex-start;
  }
  *:disabled {
    background-color: dimgrey;
    opacity: 0.9;
  }
  .edit {
    background: url("/edit-icon.svg") no-repeat right;
    background-color: rgb(51, 55, 64);
    background-origin: content-box;
    color: white;
  }
  .edit-top {
    background: url("/edit-icon.svg") no-repeat right top;
    background-color: rgb(51, 55, 64);
    background-origin: content-box;
    color: white;
  }
  .qr {
    width: 65px;
    height: 65px;
  }
  @media all and (min-width: 600px) {
    .background {
      display: flex;
      flex-direction: column;
      justify-content: space-evenly;
      align-items: center;
    }
    form {
      align-items: center;
    }
    .form-top {
      flex-direction: row;
      justify-content: space-between;
    }
    .photo {
      width: 7rem;
      height: 7rem;
    }
    .form-top button {
      margin: 0.25rem;
    }
    .name-phone-container {
      width: 75%;
      margin: 0.25rem;
    }
    .username, .phonenumber {
      display: flex;
      flex-direction: column;
      width: 50%;
      margin: 0.25rem;
    }
    .name-phone {
      flex-direction: row;
    }
    .email, .bio {
      padding: 0.125rem;
    }
    input, textarea {
      padding: 0.25rem;
      border-radius: 0.75rem;
    }
  }
  @media all and (min-width: 900px) {
    .banner {
      width: 50%;
    }
    .points {
      flex-direction: row;
    }
    .points > p {
      padding: 0 0.5rem;
    }
    form {
      justify-content: center;
      align-items: center;
      width: 60%;
    }
    input, textarea {
      padding: 0.5rem;
    }
  }
  @media all and (min-width: 1200px) {
    .banner {
      width: 40%;
    }
    .points {
      flex-direction: row;
    }
    .points > p {
      padding: 0 0.5rem;
    }
    form label {
      font-size: 1.25rem;
      line-height: 1rem;
      margin: 0.5rem 0;
    }
    .form-top button {
      margin: auto;
    }
    input {
      font-size: 1.25rem;
      padding: 0.5rem 0.75rem;
    }
  }
</style>

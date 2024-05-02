import { authData } from '$lib/stores/auth';
import { functions, storage } from '$lib/firebase/client';
import { httpsCallable } from 'firebase/functions';
import { get } from 'svelte/store';
import { getDownloadURL, ref, uploadBytes, type UploadResult } from 'firebase/storage';

// response object
const cloudResponse = {
  isError: false,
  result: {},
  errorType: ""
}

// function to call any firebase cloud function
export async function callFunction(functionKey: string, sendData: object) {
  const result = get(authData)

  const data = {
    "userId": result.user?.uid || "",
    "data": sendData || {}
  }

  const callable = httpsCallable(functions, functionKey);

  try {
    const response: any = await callable(data);
    console.log(`response data for ${functionKey}: ${JSON.stringify(response.data)}`);
    const result = response.data;

    let code: number = 400;
    if (result.statusCode) {
      code = result.statusCode;
    }
    if (code !== 200) {
      const errorType = result.errorType ? result.errorType : "";
      return { ...cloudResponse, errorType, isError: true}
    } 
    if (result) {
      return { ...cloudResponse, result};
    } else {
      return cloudResponse;
    }
  } catch (error: any) {
    const code = error.code;
    const message = error.message;
    const details = error.details;
    console.error(`error for ${functionKey} with ${code} => ${message}`);
    console.error(`error detials: ${details}`);
  }
}

// function to upload image to firebase storage
export async function uploadPic(imageFile: any, uploadLocation: string) {
  const reference = ref(storage, uploadLocation);
  const uploadResult: UploadResult = await uploadBytes(reference, imageFile);
  console.log(uploadResult);
  const newURL = await getDownloadURL(reference);
  console.log(newURL);
  return newURL;
}
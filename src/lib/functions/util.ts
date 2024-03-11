import { authData } from '$lib/stores/auth';
import { functions, storage } from '$lib/firebase/client';
import { httpsCallable } from 'firebase/functions';
import { get } from 'svelte/store';
import { getDownloadURL, ref, uploadBytes, type UploadResult } from 'firebase/storage';

const cloudResponse = {
  isError: false,
  result: {},
  errorType: ""
}

export async function callFunction(functionKey: string, sendData: Object) {
  const result = get(authData)

  const data = {
    "userId": result.user?.uid ? result.user?.uid : "",
    "data": sendData ? sendData : {}
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

export async function uploadPic(imageAddress: string, uploadLocation: string) {
  const image: File = new File([imageAddress], "userPhoto.jpg");
  const reference = ref(storage, uploadLocation);
  const uploadResult: UploadResult = await uploadBytes(reference, image);
  console.log(uploadResult);
  const newURL = await getDownloadURL(reference);
  console.log(newURL);
  return newURL;
}

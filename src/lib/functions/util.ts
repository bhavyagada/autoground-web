import { authData } from '$lib/stores/auth';
import { functions, storage } from '$lib/firebase/client';
import { get } from 'svelte/store';
import { httpsCallable, type HttpsCallable, type HttpsCallableResult } from 'firebase/functions';
import { ref, uploadBytes, getDownloadURL, type StorageReference, type UploadResult } from 'firebase/storage';

/**
 * Function to handle calls to the Firebase Cloud Functions
 * @param functionName - The name of the Firebase cloud function
 * @param sendData - The data object to be sent to the server
 * @returns Server response consisting of the result object, isError boolean and the errorType description
 */
export const callCloudFunction = async (functionName: string, sendData: object): Promise<{ isError: boolean, errorType: string, result: any }> => {
  try {
    const callable: HttpsCallable<unknown, unknown> = httpsCallable(functions, functionName);
    const callableResult: HttpsCallableResult<unknown> = await callable({ userId: get(authData).user?.uid || "", data: sendData });
    console.log(`${functionName} response data => `, callableResult.data);
    const { statusCode, errorType }: any = callableResult.data || {};
    if (statusCode !== 200) return { isError: true, errorType: errorType || "", result: callableResult.data};
    return { isError: false, errorType: "", result: callableResult.data || {} };
  } catch (error) {
    console.error(`${functionName} error =>`, error);
    return { isError: true, errorType: (error as Error).message, result: {} }
  }
}

/**
 * Upload an image to Firebase Storage
 * @param imageFile - The image File {@link https://developer.mozilla.org/en-US/docs/Web/API/File}
 * @param uploadLocation - Firebase Storage Path where the image is to be saved.
 * @returns The image URL string after it is stored (firebasestorage/image/url)
 */
export const uploadImage = async (imageFile: File, uploadLocation: string): Promise<string> => {
  const storageRef: StorageReference = ref(storage, uploadLocation);
  const uploadResult: UploadResult = await uploadBytes(storageRef, imageFile);
  const newURL: string = await getDownloadURL(storageRef);
  console.log("image upload result => ", uploadResult);
  console.log("download URL after image upload => ", newURL);
  return newURL;
}
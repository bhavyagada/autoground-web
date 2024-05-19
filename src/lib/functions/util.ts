import { auth_store } from '$lib/stores/auth';
import { functions, storage } from '$lib/firebase/client';
import { get } from 'svelte/store';
import { httpsCallable, type HttpsCallable, type HttpsCallableResult } from 'firebase/functions';
import { ref, uploadBytes, getDownloadURL, type StorageReference, type UploadResult } from 'firebase/storage';

/**
 * Function to handle calls to the Firebase Cloud Functions
 * @param function_name - The name of the Firebase cloud function
 * @param send_data - The data object to be sent to the server
 * @returns Server response consisting of the result object, isError boolean and the errorType description
 */
export const call_cloud_function = async (function_name: string, send_data: object): Promise<{ isError: boolean, errorType: string, result: any }> => {
  try {
    const callable: HttpsCallable<unknown, unknown> = httpsCallable(functions, function_name);
    const callable_result: HttpsCallableResult<unknown> = await callable({ userId: get(auth_store).user?.uid || "", data: send_data });
    console.log(`${function_name} response data => `, callable_result.data);
    const { statusCode, errorType }: any = callable_result.data || {};
    if (statusCode !== 200) return { isError: true, errorType: errorType || "", result: callable_result.data};
    return { isError: false, errorType: "", result: callable_result.data || {} };
  } catch (error) {
    console.error(`${function_name} error =>`, error);
    return { isError: true, errorType: (error as Error).message, result: {} }
  }
}

/**
 * Upload an image to Firebase Storage
 * @param image_file - The image File {@link https://developer.mozilla.org/en-US/docs/Web/API/File}
 * @param upload_location - Firebase Storage Path where the image is to be saved.
 * @returns The image URL string after it is stored (firebasestorage/image/url)
 */
export const upload_image = async (image_file: File, upload_location: string): Promise<string> => {
  const storage_ref: StorageReference = ref(storage, upload_location);
  const upload_result: UploadResult = await uploadBytes(storage_ref, image_file);
  const new_url: string = await getDownloadURL(storage_ref);
  console.log("image upload result => ", upload_result);
  console.log("download URL after image upload => ", new_url);
  return new_url;
}
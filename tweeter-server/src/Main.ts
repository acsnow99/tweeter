import { GetUserRequest } from "tweeter-shared";
import { handler as getUserHandler } from "./lambda/getUser/GetUser"
import { handler as registerHandler } from "./lambda/auth/Register"
import { RegisterRequest } from "tweeter-shared";

function generateRandomString(length: number): string {
    let result = '';
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    const charactersLength = characters.length;
  
    for (let i = 0; i < length; i++) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
  
    return result;
  }

const getUserTest = async () => {
    const getUserRequest: GetUserRequest = {
        authToken: {
          token: "abcdefg",
          timestamp: 1234
        },
        alias: "Me"
      }
    console.log(await getUserHandler(getUserRequest));
}

const registerTest = async () => {
    const registerRequest: RegisterRequest = {
        firstName: generateRandomString(4),
        lastName: generateRandomString(4),
        alias: `${generateRandomString(10)}`,
        password: 'password',
        userImageBytes: new Uint8Array(0),
        imageFileExtension: 'jpg'
      }
    console.log(await registerHandler(registerRequest));
}

registerTest();

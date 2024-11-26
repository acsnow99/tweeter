import { GetUserRequest, LoginRequest } from "tweeter-shared";
import { handler as getUserHandler } from "./lambda/getUser/GetUser"
import { handler as registerHandler } from "./lambda/auth/Register"
import { RegisterRequest } from "tweeter-shared";
import { handler as loginHandler } from "./lambda/auth/Login";
import { ImageDaoS3 } from "./model/dao/ImageDaoS3";
import fs from 'fs';

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
  const loginRequest: LoginRequest = {
    alias: "bI9jCRnZVP",
    password: "password"
  };
  const loginResponse = await loginHandler(loginRequest);
    const getUserRequest: GetUserRequest = {
        authToken: {
          token: loginResponse.token,
          timestamp: Date.now()
        },
        alias: "eLNen2ZVrK"
      }
    console.log(await getUserHandler(getUserRequest));
}

const registerTest = async () => {
    let uint8Array: Uint8Array = new Uint8Array();
    const filePath = "test-images/spr_select.png";
    fs.readFile(filePath, (err, data) => {
          if (err) {
              console.error('Error reading file:', err);
              return;
          }
          uint8Array = new Uint8Array(data);
      console.log("Data from file 1", uint8Array);
      });
    console.log("Data from file", uint8Array);
    const alias = generateRandomString(10);
    const registerRequest: RegisterRequest = {
        firstName: generateRandomString(4),
        lastName: generateRandomString(4),
        alias: `${alias}`,
        password: 'password',
        userImageBytes: uint8Array,
        imageFileExtension: 'jpg'
      }
    console.log(await registerHandler(registerRequest));
    console.log("Got image", await new ImageDaoS3().getImage(alias))
}

const loginTest = async () => {
  const loginRequest: LoginRequest = {
    alias: "bI9jCRnZVP",
    password: "password"
  };
  console.log(await loginHandler(loginRequest));
}

registerTest();

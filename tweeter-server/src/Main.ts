import { FollowRequest, GetUserRequest, LoginRequest, PagedUserItemRequest } from "tweeter-shared";
import { handler as getUserHandler } from "./lambda/getUser/GetUser"
import { handler as registerHandler } from "./lambda/auth/Register"
import { handler as followHandler } from "./lambda/follow/Follow"
import { handler as unfollowHandler } from "./lambda/follow/Unfollow"
import { RegisterRequest } from "tweeter-shared";
import { handler as loginHandler } from "./lambda/auth/Login";
import { ImageDaoS3 } from "./model/dao/ImageDaoS3";
import fs from 'fs';
import { handler as getFollowersHandler } from "./lambda/follow/GetFollowersLambda";
import { handler as getFolloweesHandler } from "./lambda/follow/GetFolloweesLambda";

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

const followTest = async () => {
  const loginRequest: LoginRequest = {
    alias: "bI9jCRnZVP",
    password: "password"
  };
  const loginResponse = await loginHandler(loginRequest);
  const followRequest: FollowRequest = {
    token: loginResponse.token,
    user: {
      firstName: "Me",
      lastName: "Son",
      alias: "me",
      imageUrl: "google.com"
    }
  }
  console.log(await followHandler(followRequest));
}

const populateFollowers = async () => {
  for (let i = 0; i < 10; i++) {
    const alias = generateRandomString(10);
    const registerRequest: RegisterRequest = {
        firstName: generateRandomString(4),
        lastName: generateRandomString(4),
        alias: `${alias}`,
        password: 'password',
        userImageBytes: new Uint8Array(),
        imageFileExtension: 'jpg'
      }
    await registerHandler(registerRequest);
    const loginRequest: LoginRequest = {
      alias: alias,
      password: "password"
    };
    const loginResponse = await loginHandler(loginRequest);
    const followRequest: FollowRequest = {
      token: loginResponse.token,
      user: {
        firstName: "Me",
        lastName: "Son",
        alias: "bI9jCRnZVP",
        imageUrl: "google.com"
      }
    }
    console.log(await followHandler(followRequest));
  }
}

const populateFollowees = async () => {
  const loginRequest: LoginRequest = {
    alias: "bI9jCRnZVP",
    password: "password"
  };
  const loginResponse = await loginHandler(loginRequest);
  for (let i = 0; i < 10; i++) {
    const followRequest: FollowRequest = {
      token: loginResponse.token,
      user: {
        firstName: generateRandomString(4),
        lastName: generateRandomString(4),
        alias: generateRandomString(10),
        imageUrl: "google.com"
      }
    }
    console.log(await followHandler(followRequest));
  }
}

const unfollowTest = async () => {
  const loginRequest: LoginRequest = {
    alias: "bI9jCRnZVP",
    password: "password"
  };
  const loginResponse = await loginHandler(loginRequest);
  const followRequest: FollowRequest = {
    token: loginResponse.token,
    user: {
      firstName: "Me",
      lastName: "Son",
      alias: "me",
      imageUrl: "google.com"
    }
  }
  console.log(await unfollowHandler(followRequest));
}

const getFollowersTest = async () => {
  const alias = "bI9jCRnZVP";
  const loginRequest: LoginRequest = {
    alias: alias,
    password: "password"
  };
  const loginResponse = await loginHandler(loginRequest);
  const token = loginResponse.token;
  const getFollowersRequest: PagedUserItemRequest = {
    token: token,
    userAlias: "me",
    pageSize: 10,
    lastItem: {
      firstName: "what",
      lastName: "no",
      alias: "kT2Jzkdioq",
      imageUrl: "google.com"
    }
  }
  console.log(await getFollowersHandler(getFollowersRequest));
}

const getFolloweesTest = async () => {
  const alias = "bI9jCRnZVP";
  const loginRequest: LoginRequest = {
    alias: alias,
    password: "password"
  };
  const loginResponse = await loginHandler(loginRequest);
  const token = loginResponse.token;
  const getFolloweesRequest: PagedUserItemRequest = {
    token: token,
    userAlias: "bI9jCRnZVP",
    pageSize: 10,
    lastItem: null
  }
  console.log(await getFolloweesHandler(getFolloweesRequest));
}

populateFollowers();

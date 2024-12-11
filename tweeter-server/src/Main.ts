import { FollowRequest, GetIsFollowerStatusRequest, GetUserRequest, LoginRequest, PagedUserItemRequest, PostStatusRequest, StatusRequest } from "tweeter-shared";
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
import { handler as getIsFollowerStatusHandler } from "./lambda/follow/GetIsFollowerStatus";
import { handler as postStatusHandler } from "./lambda/status/PostStatusLambda";
import { handler as getStoryHandler } from "./lambda/status/LoadMoreStoryItems";
import { handler as getFeedHandler } from "./lambda/status/LoadMoreFeedItems";
import { FeedDaoDynamo } from "./model/dao/FeedDaoDynamo";

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
    const filePath = "/Users/alexsnow/Desktop/cs340/tweeter-web-current/tweeter-server/src/test-images/test.png";
    fs.readFile(filePath, (err, data) => {
          if (err) {
              console.error('Error reading file:', err);
              return;
          }
          uint8Array = new Uint8Array(data);
          console.log("Data from file", uint8Array);
      });
    const alias = 'imagetest' + generateRandomString(5);
    console.log("ALIAS: ", alias);
    const registerRequest: RegisterRequest = {
        firstName: generateRandomString(4),
        lastName: generateRandomString(4),
        alias: `${alias}`,
        password: 'password',
        userImageBytes: Buffer.from(uint8Array).toString("base64"),
        imageFileExtension: 'png'
      }
    console.log(await registerHandler(registerRequest));
    console.log("Got image", await new ImageDaoS3().getImage(alias))
}

const loginTest = async () => {
  const loginRequest: LoginRequest = {
    alias: "imagetestw5vmM",
    password: "password"
  };
  console.log(await loginHandler(loginRequest));
}

const followTest = async () => {
  const loginRequest: LoginRequest = {
    alias: "imagetestw5vmM",
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
        userImageBytes: Buffer.from(new Uint8Array()).toString("base64"),
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
  const alias = "@daisy";
  const loginRequest: LoginRequest = {
    alias: alias,
    password: "pass"
  };
  const loginResponse = await loginHandler(loginRequest);
  const token = loginResponse.token;
  const getFollowersRequest: PagedUserItemRequest = {
    token: token,
    userAlias: "@daisy",
    pageSize: 10,
    lastItem: null
  }
  console.log("Starting request...");
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

const getIsFollowerStatusTest = async () => {
  const alias = "bI9jCRnZVP";
  const loginRequest: LoginRequest = {
    alias: alias,
    password: "password"
  };
  const loginResponse = await loginHandler(loginRequest);
  const token = loginResponse.token;
  const request: GetIsFollowerStatusRequest = {
    authToken: {
      token: token,
      timestamp: 0,
    },
    user: {
      firstName: "what",
      lastName: "no",
      alias: "bI9jCRnZVP",
      imageUrl: "google.com"
    },
    selectedUser: {
      firstName: "what",
      lastName: "no",
      alias: "me",
      imageUrl: "google.com"
    }
  }
  console.log(await getIsFollowerStatusHandler(request));
}

const postStatusTest = async () => {
  await (new FeedDaoDynamo()).deleteAllFeedItems();
  const alias = "@daisy";
  const loginRequest: LoginRequest = {
    alias: alias,
    password: "pass"
  };
  const loginResponse = await loginHandler(loginRequest);
  const token = loginResponse.token;
  const request: PostStatusRequest = {
    authToken: {
      token: token,
      timestamp: 0,
    },
    newStatus: {
      post: "Another day",
      user: {
        firstName: "Daisy",
        lastName: "Duck",
        alias: "@daisy",
        imageUrl: "https://cs340tweeter-images.s3.us-east-1.amazonaws.com/image/%40daisy",
      },
      timestamp: Date.now(),
      segments: []
    }
  }
  console.log(await postStatusHandler(request));
}

const getStoryTest = async () => {
  const alias = "bI9jCRnZVP";
  const loginRequest: LoginRequest = {
    alias: alias,
    password: "password"
  };
  const loginResponse = await loginHandler(loginRequest);
  const token = loginResponse.token;
  const request: StatusRequest = {
    authToken: {
      token: token,
      timestamp: 0,
    },
    userAlias: "bI9jCRnZVP",
    pageSize: 2,
    // lastItem: null,
    lastItem: {
      post: "A new post from testing",
      user: {
        firstName: "Me",
        lastName: "Son",
        alias: "bI9jCRnZVP",
        imageUrl: "google.com",
      },
      timestamp: 1733001979430,
      segments: []
    }

  };
  console.log(await getStoryHandler(request));
}

const getFeedTest = async () => {
  const alias = "8bJyy7FkNi";
  const loginRequest: LoginRequest = {
    alias: alias,
    password: "password"
  };
  const loginResponse = await loginHandler(loginRequest);
  const token = loginResponse.token;
  const request: StatusRequest = {
    authToken: {
      token: token,
      timestamp: 0,
    },
    userAlias: "8bJyy7FkNi",
    pageSize: 4,
    // lastItem: null,
    lastItem: {
      post: "A new post from testing",
      user: {
        firstName: "Me",
        lastName: "Son",
        alias: "bI9jCRnZVP",
        imageUrl: "google.com",
      },
      timestamp: 1733001982710,
      segments: []
    }

  };
  console.log(await getFeedHandler(request));
}

getFollowersTest();

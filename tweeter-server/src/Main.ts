import { GetUserRequest } from "tweeter-shared";
import { handler } from "./lambda/getUser/GetUser"

const test0 = async () => {
    const getUserRequest: GetUserRequest = {
        authToken: {
          token: "abcdefg",
          timestamp: 1234
        },
        alias: "Me"
      }
    console.log(await handler(getUserRequest));
}

test0();

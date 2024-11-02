import { AuthToken, User } from "tweeter-shared";
import { UserService } from "../model/service/UserService";
import { Presenter, View } from "./Presenter";

export interface UserNavigationView extends View {
    setDisplayedUser: (user: User) => void;
}

export class UserNavigationPresenter extends Presenter<UserNavigationView> {
    service: UserService;

    public constructor(view: UserNavigationView) {
      super(view);
        this.service = new UserService();
    }

    public async navigateToUser (authToken: AuthToken | null, currentUser: User | null, event: React.MouseEvent): Promise<void> {
        event.preventDefault();

        this.doFailureReportingOperation(async () => {
          const alias = this.extractAlias(event.target.toString());
    
          const user = await this.service.getUser(authToken!, alias);
          console.log("User from presenter layer", user);
    
          if (!!user) {
            if (currentUser!.equals(user)) {
              this.view.setDisplayedUser(currentUser!);
            } else {
              this.view.setDisplayedUser(user);
            }
          }
        }, "get user");
      }
    
      private extractAlias = (value: string): string => {
        const index = value.indexOf("@");
        return value.substring(index);
      };

}

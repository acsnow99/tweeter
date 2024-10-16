import { ReactNode, useContext } from "react";
import { UserInfoContext } from "../userInfo/UserInfoProvider";
import { useState, useEffect } from "react";
import InfiniteScroll from "react-infinite-scroll-component";
import useToastListener from "../toaster/ToastListenerHook";
import { ItemPresenter, ItemView } from "../../presenters/ItemPresenter";

interface Props<S, U extends ItemView<V>, V> {
    generatePresenter: (view: ItemView<V>) => ItemPresenter<V, U, S>
    generateItemComponent: (item: V) => ReactNode,
}

export const ItemScroller = <S, U extends ItemView<V>, V,>(props: Props<S, U, V>) => {
    const { generatePresenter, generateItemComponent } = props;
    const { displayErrorMessage } = useToastListener();
    const [items, setItems] = useState<V[]>([]);
    const [newItems, setNewItems] = useState<V[]>([]);
    const [changedDisplayedUser, setChangedDisplayedUser] = useState(true);
  
    const { displayedUser, authToken } =
      useContext(UserInfoContext);
  
    // Initialize the component whenever the displayed user changes
    useEffect(() => {
      reset();
    }, [displayedUser]);
  
    // Load initial items whenever the displayed user changes. Done in a separate useEffect hook so the changes from reset will be visible.
    useEffect(() => {
      if(changedDisplayedUser) {
        showMoreItems();
      }
    }, [changedDisplayedUser]);
  
    // Add new items whenever there are new items to add
    useEffect(() => {
      if(newItems) {
        setItems([...items, ...newItems]);
      }
      console.log("New Items");
    }, [newItems])
  
    const reset = async () => {
      setItems([]);
      setNewItems([]);
      presenter.reset();
      setChangedDisplayedUser(true);
      console.log("Resetting");
    }
  
    const showMoreItems = async () => {
      presenter.loadMoreItems(authToken!, displayedUser!.alias);
      setChangedDisplayedUser(false);
    };

    const view: ItemView<V> = {
      addItems: (newItems: V[]) =>
        setNewItems(newItems),
      displayErrorMessage: displayErrorMessage,
    }
    const [presenter] = useState(generatePresenter(view));

    return (
        <div className="container px-0 overflow-visible vh-100">
          <InfiniteScroll
            className="pr-0 mr-0"
            dataLength={items.length}
            next={showMoreItems}
            hasMore={presenter.hasMoreItems}
            loader={<h4>Loading...</h4>}
          >
            {items.map((item, index) => (
              <div
                key={index}
                className="row mb-3 mx-0 px-0 border rounded bg-white"
              >
                {generateItemComponent(item)}
              </div>
            ))}
          </InfiniteScroll>
        </div>
      );
}

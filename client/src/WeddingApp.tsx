import React, { Component } from "react";
import { GuestList } from "./GuestList";
import { GuestDetails } from "./GuestDetails";
import { AddGuest } from "./AddGuest";


// TODO: When you're ready to get started, you can remove all the example 
//   code below and start with this blank application:

// for switching pages
type Page = "Add" | "GuestList" | {kind: "Details", name: string};

type WeddingAppState = {
  page: Page
}

/** Displays the UI of the Wedding rsvp application. */
export class WeddingApp extends Component<{}, WeddingAppState> {

  // constructs WeddingApp
  constructor(props: {}) {
    super(props);

    this.state = {page: "GuestList"};
  }

  // render different pages depends on Page
  render = (): JSX.Element => {
    if (this.state.page === 'Add') {
      return <AddGuest onBackClick={this.doBackClick}/>
    } 
    else if (this.state.page === 'GuestList') {
      return <GuestList onNewClick={this.doAddClick}
                        onDetailsClick={this.doDetailsClick}/>
    } 
    else {
      return <GuestDetails  name={this.state.page.name}
                            onBackClick={this.doBackClick}/>
    }
      
  };

  // when click guest names in GuestList
  doDetailsClick = (name: string) : void => {
    this.setState({page: {kind: "Details", name: name}})
  }

  // when lick add in GuestList
  doAddClick = () : void => {
    this.setState({page: "Add"})
  }

  // when click back in details/add
  doBackClick = (): void => {
    this.setState({page: "GuestList"})
  }

}

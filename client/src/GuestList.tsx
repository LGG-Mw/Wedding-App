import React from "react";
import { Component, MouseEvent } from "react";
import { isRecord } from "./record";
import { Guest, parseGuest } from "./guest";

// props
type ListProps = {
    onNewClick: () => void,
    onDetailsClick: (name: string) => void
};
  
// state
type ListState = {
    guests: Map<string, Guest> | undefined
};

// Shows the list of all the guests.
export class GuestList extends Component<ListProps, ListState> {

    // constructs GuestList
    /**
     * @effects guests initiated as undefined
     */
    constructor(props: ListProps) {
        super(props)
        this.state = {guests: undefined}
    }

    componentDidMount = (): void => {
        this.doRefreshClick();
    }

    // renders Guest List
    render = (): JSX.Element => {
        return (
          <div>
            <h2>Guest List</h2>
            {this.renderGuests()}
            <h3>Summary:</h3>
            {this.renderSummary()}
            <button type="button" onClick={this.doRefreshClick}>Refresh</button>
            <button type="button" onClick={this.doAddClick}>Add Guest</button>
          </div>);
    };

    // Renders guests
    renderGuests = (): JSX.Element => {
        if (this.state.guests === undefined) {
            return <p>Loading guest list...</p>;
        } else {
            const guests: JSX.Element[] = [];
            for (const guest of Array.from(this.state.guests.values())) {
                const guestOf: string = guest.guestOf;
                const addedG: string = "+" + (guest.addedG === "unknown" ? "1?" : (guest.addedG === "1" ? "1" : "0"));
                guests.push(
                    <li key={guest.name}>
                      <a href="#" onClick={(evt) => this.doDetailsClick(evt, guest.name)}>{guest.name}</a><a> Guest of {guestOf} {addedG}</a>
                    </li>);
            }
            return <ul>{guests}</ul>;
        }
    }

    // renders summary
    renderSummary = (): JSX.Element => {
        if (this.state.guests === undefined) {
            return <p>Loading guests list...</p>;
        } else {
            const mollyGuests = Array.from(this.state.guests.values()).filter(guest => guest.guestOf === "Molly");
            const jamesGuests = Array.from(this.state.guests.values()).filter(guest => guest.guestOf === "James");

            const mollyGuestCount = mollyGuests.length;
            const jamesGuestCount = jamesGuests.length;

            const mollyFamilyCount = mollyGuests.filter(guest => guest.family).length;
            const jamesFamilyCount = jamesGuests.filter(guest => guest.family).length;

            const mollyUnconfirmedCount = mollyGuests.filter(guest => guest.addedG === "unknown").length;
            const jamesUnconfirmedCount = jamesGuests.filter(guest => guest.addedG === "unknown").length;

            const mollyTotalCount = mollyGuestCount + mollyUnconfirmedCount;
            const jamesTotalCount = jamesGuestCount + jamesUnconfirmedCount;

            const mollySummary = mollyUnconfirmedCount > 0 
            ? `${mollyGuestCount}-${mollyTotalCount} guest(s) of Molly`
            : `${mollyGuestCount} guest(s) of Molly`;

            const jamesSummary = jamesUnconfirmedCount > 0 
                ? `${jamesGuestCount}-${jamesTotalCount} guest(s) of James`
                : `${jamesGuestCount} guest(s) of James`;

            return (
                <div>
                    <p>{mollySummary} ({mollyFamilyCount} family)</p>
                    <p>{jamesSummary} ({jamesFamilyCount} family)</p>
                </div>
            );
        }
    }

    // when clicks add to add a new guest
    doAddClick = (_evt: MouseEvent<HTMLButtonElement>): void => {
        this.props.onNewClick();  
    };

    // when clicks refresh
    doRefreshClick = (): void => {
        fetch("/api/list").then(this.doListResp)
            .catch(() => this.doListError("failed to connect to server"));
    }

    // deals with resposne from server
    doListResp = (resp: Response): void => {
        if (resp.status === 200) {
          resp.json().then(this.doListJson)
              .catch(() => this.doListError("200 response is not JSON"));
        } else if (resp.status === 400) {
          resp.text().then(this.doListError)
              .catch(() => this.doListError("400 response is not text"));
        } else {
          this.doListError(`bad status code from /api/list: ${resp.status}`);
        }
    };

    // check with returned data
    doListJson = (data: unknown): void => {
        if (!isRecord(data)) {
          console.error("bad data from /api/list: not a record", data);
          return;
        }
    
        if (!Array.isArray(data.guests)) {
          console.error("bad data from /api/list: guests is not an array", data);
          return;
        }
        
        const guests: Map<string, Guest> = new Map();
        for (const val of data.guests) {
            const guest = parseGuest(val);
            if (guest === undefined)
              return;
            guests.set(guest.name, guest);
        }
        
        this.setState({guests: guests});
    };

    // deal and report errors
    doListError = (msg: string): void => {
        console.error(`Error fetching /api/list: ${msg}`);
    };

    // when click on details of the guest
    doDetailsClick = (evt: MouseEvent<HTMLAnchorElement>, name: string): void => {
        evt.preventDefault();
        this.props.onDetailsClick(name);
    };
}


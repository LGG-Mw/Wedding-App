import { ChangeEvent, Component, MouseEvent } from "react";
import { isRecord } from "./record";
import React from "react";
import { Guest, parseGuest } from "./guest";

// props
type DetailsProps = {
    name: string
    onBackClick: () => void
};
  
// state
type DetailsState = {
    guest: Guest | undefined
    dRes: string
    addedG: string
    addedGName: string
    addedGRes: string
    message: string
    error: string
};

//allows the user to edit the details of guests
export class GuestDetails extends Component<DetailsProps, DetailsState> {
    componentDidMount = (): void => {
        this.doRefreshClick();
    }

    // constructs GuestDetails
    /**
     * @effects guest initiated as undefined, dRes, addedG, addedGName, addedGRes, message, error initiated as ""
     */
    constructor(props: DetailsProps) {
        super(props)
        this.state = {dRes: "", addedG: "", addedGName: "", addedGRes: "", guest: undefined, message: "", error: ""}
    }

    // renders the GuestDetails page
    render = (): JSX.Element => {
        if (this.state.guest === undefined) {
          return <p>Loading guest "{this.props.name}"...</p>
        } else {
          return (
            <><h2>Guest Details</h2><div>
                <div>{this.state.guest.name}, guest of {this.state.guest.guestOf}{this.state.guest.family ? ", family" : ""}</div>
                <div>
                  <label htmlFor="name">Dietary Restrictions ('none' if none):</label>
                  </div>
                  <input id="dRes" type="text" value={this.state.dRes}
                      onChange={this.doDResChange}></input>
                    <div>
                  <label htmlFor="name">Wanna leave a message? (any Qs or something)</label>
                  </div>
                  <input id="message" type="text" value={this.state.message}
                      onChange={this.doMessageChange}></input>
                      <div>
                            <label htmlFor="addedG">Additional Guest?</label>
                            <select id="addedG" value={this.state.addedG} onChange={this.doAddedGChange}>
                                <option value="unknown">unknown</option>
                                <option value="0">0</option>
                                <option value="1">1</option>
                            </select>
                        </div>
                        {this.state.addedG === "1" && (
                            <>
                                <div>
                                    <label htmlFor="addedGName">Guest Name:</label>
                                    <input id="addedGName" type="text" value={this.state.addedGName} onChange={this.doAddedGNameChange}></input>
                                </div>
                                <div>
                                    <label htmlFor="addedGRes">Guest Dietary Restrictions ('none' if none):</label>
                                    <div>
                                    <input id="addedGRes" type="text" value={this.state.addedGRes} onChange={this.doAddedGResChange}></input>
                                    </div>
                                </div>
                            </>
                        )}
              </div>
            <button type="button" onClick={this.doSaveClick}>Save</button>
                <button type="button" onClick={this.doBackClick}>Back</button>
                {this.renderError()}
              </>
          )
        }
    };

    // when entering restrictions for 'name'
    doDResChange = (evt: ChangeEvent<HTMLInputElement>): void => {
        this.setState({dRes: evt.target.value, error: ""});
    };

    // has additional guests or not
    doAddedGChange = (evt: ChangeEvent<HTMLSelectElement>): void => {
        const addedG = evt.target.value
        this.setState({addedG: addedG, error: ""});
        if (addedG !== "1") {
            this.setState({addedGName: "", addedGRes: ""});
        }
    };

    // when entering additional guest name
    doAddedGNameChange = (evt: ChangeEvent<HTMLInputElement>): void => {
        this.setState({addedGName: evt.target.value, error: ""});
    };

    // when entering additional guest's restrictions
    doAddedGResChange = (evt: ChangeEvent<HTMLInputElement>): void => {
        this.setState({addedGRes: evt.target.value, error: ""});
    };

    // when enterting message text box
    doMessageChange = (evt: ChangeEvent<HTMLInputElement>): void => {
        this.setState({message: evt.target.value, error: ""});
    };

    // when clicking back button
    doBackClick = (_: MouseEvent<HTMLButtonElement>): void => {
        this.props.onBackClick();
    };

    // when clicking save button
    doSaveClick = (_: MouseEvent<HTMLButtonElement>): void => {
        if (this.state.guest === undefined) {
            throw new Error("impossible");
        }

        if (this.state.dRes.trim().length === 0 ||
            (this.state.addedG === "1" && (this.state.addedGName.trim().length === 0 || this.state.addedGRes.trim().length === 0))) {
            this.setState({error: "a required field is missing."});
            return;
        }

        const args = {name: this.props.name, dRes: this.state.dRes, addedG: this.state.addedG, 
            addedGName: this.state.addedGName, addedGRes: this.state.addedGRes, message: this.state.message};
        fetch("/api/save", {
            method: "POST", body: JSON.stringify(args),
            headers: {"Content-Type": "application/json"} })
            .then(this.doSaveResp)
            .catch(() => this.doSaveError("failed to connect to server"));
    }

    // deals with save response from server
    doSaveResp = (res: Response): void => {
        if (res.status === 200) {
          res.json().then(this.doSaveJson)
              .catch(() => this.doSaveError("200 response is not JSON"));
        } else if (res.status === 400) {
          res.text().then(this.doSaveError)
              .catch(() => this.doSaveError("400 response is not text"));
        } else {
          this.doSaveError(`bad status code from /api/bid: ${res.status}`);
        }
    };

    // deals with save json response
    doSaveJson = (data: unknown): void => {
        if (this.state.guest === undefined)
            throw new Error("impossible");

        if (!isRecord(data)) {
            console.error("bad data from /api/save: not a record", data);
            return;
        }

        this.props.onBackClick();
    };

    // displays error for save
    doSaveError = (msg: string): void => {
        console.error(`Error fetching /api/save: ${msg}`);
    };
    
    // refreshes and get response from server
    doRefreshClick = (): void => {
        fetch("/api/get?name=" + encodeURIComponent(this.props.name))
            .then(this.doGetResp)
            .catch(() => this.doGetError("failed to connect to server"));
    }

    // deals with guest details response from server
    doGetResp = (res: Response): void => {
        if (res.status === 200) {
          res.json().then(this.doGetJson)
              .catch(() => this.doGetError("200 res is not JSON"));
        } else if (res.status === 400) {
          res.text().then(this.doGetError)
              .catch(() => this.doGetError("400 response is not text"));
        } else {
          this.doGetError(`bad status code from /api/get: ${res.status}`);
        }
    };

    // checks if the response is record
    doGetJson = (data: unknown): void => {
        if (!isRecord(data)) {
            console.error("bad data from /api/get: not a record", data);
            return;
        }
        const guest = parseGuest(data.guest)
        if (guest === undefined) {
            throw new Error("impossible")
        }
        this.setState({guest: guest, dRes: guest.dRes, addedG: guest.addedG, addedGName: guest.addedGName, addedGRes: guest.addedGRes, message: guest.message})
    }

    // displays get's error from server
    doGetError = (msg: string): void => {
        console.error(`Error fetching /api/get: ${msg}`);
    };

    // renders error msg if any
    renderError = (): JSX.Element => {
        if (this.state.error.length === 0) {
          return <div></div>;
        } else {
          const style = {width: '300px', backgroundColor: 'rgb(246,194,192)',
              border: '1px solid rgb(137,66,61)', borderRadius: '5px', padding: '5px' };
          return (<div style={{marginTop: '15px'}}>
              <span style={style}><b>Error</b>: {this.state.error}</span>
            </div>);
        }
    };
}
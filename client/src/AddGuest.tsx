import React, { ChangeEvent } from "react";
import { Component, MouseEvent } from "react";
import { isRecord } from "./record";

// props
type AddProps = {
    onBackClick: () => void
};

// state
type AddState = {
    name: string,
    guestOf: string,
    family: boolean,
    error: string
};

// allows the user to add new guests
export class AddGuest extends Component<AddProps, AddState> {
    /**
     * @effects name, guestOf, error initiated as "", family initiated as false
     */
    constructor(props: AddProps) {
        super(props)
        this.state = {name: "", guestOf: "", family: false, error: ""}
    }

    // renders the AddGuest page
    render = (): JSX.Element => {
        return (
          <div>
            <h2>Add Guest</h2>
            <div>
              <label htmlFor="name">Name:</label>
              <input id="name" type="text" value={this.state.name}
                  onChange={this.doNameChange}></input>
            </div>
            <div>
            <div>Guest Of:</div>
            <div>
            <label>
            <input
                type="radio"
                value="Molly"
                checked={this.state.guestOf === 'Molly'}
                onChange={this.doGuestOfChange}
            />
            Molly
            </label>
            </div>
            <label>
            <input
                type="radio"
                value="James"
                checked={this.state.guestOf === 'James'}
                onChange={this.doGuestOfChange}
            />
            James
            </label>
            </div>
            <div>
                <label>
                <input
                    type="checkbox"
                    checked={this.state.family}
                    onChange={this.doFamilyChange}
                />
                Family
                </label>
            </div>
            <button type="button" onClick={this.doAddClick}>Add</button>
            <button type="button" onClick={this.doBackClick}>Back</button>
            {this.renderError()}
          </div>);
    };

    // when enters name
    doNameChange = (evt: ChangeEvent<HTMLInputElement>): void => {
        this.setState({name: evt.target.value, error: ""});
    };

    // when selecting guestOf
    doGuestOfChange = (evt: ChangeEvent<HTMLInputElement>): void => {
        this.setState({guestOf: evt.target.value, error: ""});
    };

    // when choosing is family or not
    doFamilyChange = (evt: ChangeEvent<HTMLInputElement>): void => {
        this.setState({family: evt.target.checked, error: ""});
    };

    // when clicking add
    doAddClick = (_: MouseEvent<HTMLButtonElement>): void => {
        if (this.state.name.trim().length === 0 || 
            this.state.guestOf === "") {
            this.setState({error: "a required field is missing."});
            return;
        }

        const args = { name: this.state.name,
            guestOf: this.state.guestOf, family: this.state.family,
            dRes: "", addedG: "unknown", addedGRes: "", addedGName: "", message: "" };
        
        fetch("/api/add", {
            method: "POST", body: JSON.stringify(args),
            headers: {"Content-Type": "application/json"} })
            .then(this.doAddResp)
            .catch(() => this.doAddError("failed to connect to server"));
    }

    // deals with response from server for add
    doAddResp = (resp: Response): void => {
        if (resp.status === 200) {
          resp.json().then(this.doAddJson)
              .catch(() => this.doAddError("200 response is not JSON"));
        } else if (resp.status === 400) {
          resp.text().then(this.doAddError)
              .catch(() => this.doAddError("400 response is not text"));
        } else {
          this.doAddError(`bad status code from /api/add: ${resp.status}`);
        }
    };

    // check if is record and back
    doAddJson = (data: unknown): void => {
        if (!isRecord(data)) {
            console.error("bad data from /api/add: not a record", data);
            return;
        }
        this.props.onBackClick();
    };

    // displays error by setting error state
    doAddError = (msg: string): void => {
        this.setState({error: msg})
    };

    // when clicks back
    doBackClick = (_: MouseEvent<HTMLButtonElement>): void => {
        this.props.onBackClick();
    };

    // renders error
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
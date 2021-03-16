import './App.css';
import * as React from "react";
import {v4 as uuidv4} from "uuid";

class App extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            isSendingData: false,
            uniqueIDs: 0,
            dataSendInterval: 1000,
            endpoint: "http://0.0.0.0:8080/v1/track/",
            href: "https://demo.com/"
        };

        // binding is necessary to make `this` work in the callback
        this.handleChange = this.handleChange.bind(this);
        this.sendDataTick = this.sendDataTick.bind(this);
        this.handleClick = this.handleClick.bind(this);
    }


    handleChange(e) {
        this.setState({
            [e.target.name]: e.target.value
        });
    }

    sendDataTick() {
        const xhr = new XMLHttpRequest();

        xhr.open("POST", this.state.endpoint);
        xhr.setRequestHeader("Content-Type", "application/json; charset=UTF-8");

        const session = {
            type: "session",
            anonymousID: uuidv4(),
            loadTime: new Date().now,
            unloadTime: new Date().now,
            language: "us-en",
            platform: "Datagen",
            port: 4000,
            referer: "Simulator",
            location: "/",
            href: this.state.href,
            origin: "localhost:3000",
            title: "test",
            endpoint: this.state.endpoint,
        };
        xhr.send(JSON.stringify(session));

        this.setState({
            uniqueIDs: this.state.uniqueIDs + 1
        });
    }

    handleClick(e) {
        e.preventDefault();
        if (this.state.isSendingData === false) {
            this.intervalID = setInterval(this.sendDataTick, this.state.dataSendInterval);
        } else {
            clearInterval(this.intervalID);
        }
        this.setState({
            isSendingData: !this.state.isSendingData
        });
    }

    render() {
        return (
            <div className={"container"}>
                <p>Send data every
                    <input type="number"
                           name="dataSendInterval"
                           value={this.state.dataSendInterval}
                           onChange={e => this.handleChange(e)}/>
                    milliseconds to
                    <input type="text"
                           name="endpoint"
                           value={this.state.endpoint}
                           onChange={e => this.handleChange(e)}/>
                    endpoint.
                </p>

                <p>Sending every {this.state.dataSendInterval} seconds to endpoint {this.state.endpoint}</p>
                <p>There have been {this.state.uniqueIDs} unique simulated visitors sent.</p>
                <button type={"submit"}
                        onClick={this.handleClick}>{this.state.isSendingData ? 'STOP' : 'START'}</button>
            </div>
        );
    }
}

export default App;

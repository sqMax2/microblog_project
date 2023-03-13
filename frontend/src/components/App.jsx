import * as React  from "react";
import Posts from "./Posts";

export default class App extends React.Component {
    constructor(props) {
        super(props);
    }
    render() {
        return(
                <>
                    <Posts />
                </>
            )
    }
}
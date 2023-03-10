import { Component } from "react";
import { Container } from "react-bootstrap";
import Console from "../components/Console";

class Home extends Component{

    constructor(props: object) {
        super(props);
    }

    render() {
        return <Console></Console>;
    }
}

export default Home;
import { TextField } from "@mui/material";
import { Component } from "react";
import { Container, Row } from "react-bootstrap";

class Console extends Component {
    constructor(props: object) {
        super(props);
    }

    render() {
        return <Container fluid>
            <Row style={{height: '100%'}}>
            </Row>
            <Row style={{height: '2em'}}>
                <TextField></TextField>
            </Row>
        </Container>;
    }
}

export default Console;
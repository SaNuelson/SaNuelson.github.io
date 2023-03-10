import React, { Component } from "react";
import { Container, Nav, Navbar } from "react-bootstrap";
import { NavLink } from "react-router-dom";
import { LinkContainer } from 'react-router-bootstrap';

class Navigation extends Component {
    constructor(props: object) {
        super(props);
    }

    render() {
        return (
            <Navbar bg="light" expand="lg">
                <Container>
                    <LinkContainer to="/">
                        <Navbar.Brand href="#home">
                            <img
                                alt=""
                                src="/logo.svg"
                                height="30"
                                className="d-inline-block align-top"
                            />
                            
                        </Navbar.Brand>
                    </LinkContainer>
                    <Navbar.Toggle aria-controls="basic-navbar-nav" />
                    <Navbar.Collapse id="basic-navbar-nav">
                        <Nav className="me-auto">
                            <LinkItem name="Home" path="/" />
                        </Nav>
                    </Navbar.Collapse>
                </Container>
            </Navbar>
        );
    }
}

type LinkItemProps = {
    name: string,
    path: string
}

function LinkItem(props: LinkItemProps) {
    return (<Nav.Link as={NavLink} to={props.path}>{props.name}</Nav.Link>);
}

export default Navigation;

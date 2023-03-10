import { Component } from "react";
import { Container } from "react-bootstrap";
import { BrowserRouter, Route, Routes, Link } from "react-router-dom";

import "./App.scss";
import Navigation from "./components/Navigation";
import Home from "./pages/Home";

class App extends Component {
  render() {
    return (
      <Container fluid>
        <BrowserRouter>
          <Navigation></Navigation>
          <Routes>
            <Route path="/" element={<Home />}></Route>
          </Routes>
        </BrowserRouter>
      </Container>
    );
  }
}

export default App;

import React, {Component} from "react";
import 'bootstrap/dist/css/bootstrap.min.css';
import "../../App.css";

import Container from 'react-bootstrap/Container';
import Carousel from "react-bootstrap/Carousel";
import Image from 'react-bootstrap/Image'
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import Form from 'react-bootstrap/Form';
import FormControl from 'react-bootstrap/FormControl';
import Button from 'react-bootstrap/Button';
import Dropdown from 'react-bootstrap/Dropdown';

import sampleImage1 from '../../Image/sampleImage1.jpg';
import sampleImage2 from '../../Image/sampleImage2.jpg';
import sampleImage3 from '../../Image/sampleImage3.jpg';
import profile from '../../Image/profile.png';
import docIcon from '../../Image/documents.png';

import DocCard from '../documentsCard.js';

class ManagePage extends Component {
    constructor(){
        super();
        this.state = {
            editBio : false,
            filter : "Title",
        }
        this.handleEditBio = this.handleEditBio.bind(this);
        this.handleSubmiteBio = this.handleSubmiteBio.bind(this);
    }

    handleEditBio = () => {
        this.setState({ editBio: true });
    }

    handleSubmiteBio = () => {
        this.setState({ editBio: false });
    }

    handleFilterOnTitle = () => {
        this.setState({filter: "Title"});
    }

    handleFilterOnTime = () => {
        this.setState({filter: "Time"});
    }

    handleFilterOnElse = () => {
        this.setState({filter: "Else"});
    }

    render(){

        const documents = [{Title: "sample documents 1"}, {Title: "sample documents 2"}, {Title: "sample documents 3"},{Title: "sample documents 4"},{Title: "sample documents 5"},{Title: "sample documents 6"},{Title: "sample documents 7"}];
        let docCards = documents.map(card =>{
          return(
            <Col sm='4'>
              <DocCard note={card}/>  
            </Col>
          )
        })

        return(
            <body>
                <Container>
                <Carousel>
                    <Carousel.Item>
                        <img
                        className="d-block w-100"
                        src= {sampleImage1}
                        alt="First slide"
                        />
                        <Carousel.Caption>
                        <h3>First slide label</h3>
                        <p>Nulla vitae elit libero, a pharetra augue mollis interdum.</p>
                        </Carousel.Caption>
                        <input type="file" id="BtnBrowseHidden" name="files" style={{display: "none"}} />
                        <label htmlFor="BtnBrowseHidden" className="imageUpload">
                            upload image
                        </label>
                    </Carousel.Item>

                    <Carousel.Item>
                        <img
                        className="d-block w-100"
                        src= {sampleImage2}
                        alt="Third slide"
                        />
                        <Carousel.Caption>
                        <h3>Second slide label</h3>
                        <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>
                        </Carousel.Caption>
                        <input type="file" id="BtnBrowseHidden" name="files" style={{display: "none"}} />
                        <label for="BtnBrowseHidden" className="imageUpload">
                            upload image
                        </label>
                    </Carousel.Item>
                    <Carousel.Item>
                        <img
                        className="d-block w-100"
                        src= {sampleImage3}
                        alt="Third slide"
                        />
                        <Carousel.Caption>
                        <h3>Third slide label</h3>
                        <p>Praesent commodo cursus magna, vel scelerisque nisl consectetur.</p>
                        </Carousel.Caption>
                        <input type="file" id="BtnBrowseHidden" name="files" style={{display: "none"}} />
                        <label for="BtnBrowseHidden" className="imageUpload">
                            Upload image
                        </label>
                    </Carousel.Item>
                </Carousel>
                </Container>
                <Container>
                <Row>
                    <Col xs={6} md={6}>
                        <Row>
                            <Image src={profile} roundedCircle />
                        </Row>     
                        
                        <input type="file" id="BtnBrowseHidden" name="files" style={{display: "none"}} />
                        <label htmlFor="BtnBrowseHidden" className="profileUpload">
                            Upload profile
                        </label>              
                    </Col >
                    <Col xs={6} md={6}>
                        <Button variant="info" onClick={this.handleEditBio}>Edit</Button>
                        <h1>Bio info</h1>
                        {this.state.editBio ? (
                            <Form>
                                <Form.Label>Enter your bio here</Form.Label>
                                <Form.Control as="textarea" rows="3" />
                                <Button variant="outline-info" onClick={this.handleSubmiteBio}>submit</Button>
                            </Form>
                        ):
                        (<p>here is your bio information</p>)}
                    </Col>
                </Row>
                </Container>
                
                <Container>
                <Row>
                    <Col xs={6} md={4}>
                        <Row>
                            <img src={docIcon}/>  
                        </Row>
                        <input type="file" id="BtnBrowseHidden" name="files" style={{display: "none"}} />
                        <label htmlFor="BtnBrowseHidden" className="docUpload">
                            Upload Documents
                        </label>
                    </Col >
                    <Col xs={6} md={8}>
                    <Row>
                    <Form inline>
                        <FormControl type="text" placeholder="Search for documents" className="mr-sm-2" />
                        <Dropdown>
                        <Dropdown.Toggle variant="success" id="dropdown-basic">
                            {this.state.filter}
                        </Dropdown.Toggle>
                        <Dropdown.Menu>
                            <Dropdown.Item onClick={this.handleFilterOnTitle}>Title</Dropdown.Item>
                            <Dropdown.Item onClick={this.handleFilterOnTime}>Time</Dropdown.Item>
                            <Dropdown.Item onClick={this.handleFilterOnElse}>something else</Dropdown.Item>
                        </Dropdown.Menu>
                        </Dropdown>
                    </Form>
                    </Row>
                    <Container fluid style={{overflow:"scroll", height:'20rem'}}> 
                    <Row>
                        {docCards}
                    </Row>
                    </Container>
                    
                    </Col>
                </Row>
                </Container>
            </body>
        )
    }
}

export default ManagePage;
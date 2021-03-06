import React, {Component} from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import "../../App.css";
import "./docViewer.css";
import "./docEditor.css";

import axios from 'axios';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import InputGroup from 'react-bootstrap/InputGroup';
import FormControl from 'react-bootstrap/FormControl';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import Container from 'react-bootstrap/Container';
import Collapse from 'react-bootstrap/Collapse';
import Spinner from 'react-bootstrap/Spinner';

import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import FileViewer from 'react-file-viewer';
import { CustomErrorComponent } from 'custom-error';
import Tag from './../Tags/Tag.js';

import {pathForRequest} from '../http.js';

let http = pathForRequest();

class singleDoc extends Component {
    constructor(props){
        super(props);
        this.handleViewerClose = this.handleViewerClose.bind(this);
        this.handleViewerShow = this.handleViewerShow.bind(this);
        this.handleEditorClose = this.handleEditorClose.bind(this);
        this.handleEditorShow = this.handleEditorShow.bind(this);
        this.handleViewerEdit = this.handleViewerEdit.bind(this);
        this.handleSaveChanges = this.handleSaveChanges.bind(this);
        this.handleAbruptLeave = this.handleAbruptLeave.bind(this);
        this.handleRemoveHighlight = this.handleRemoveHighlight.bind(this);
        this.handleHighlight = this.handleHighlight.bind(this);
        this.handleAddTags = this.handleAddTags.bind(this);
        this.handleSetTags = this.handleSetTags.bind(this);
        this.handleRemoveHighlight = this.handleRemoveHighlight.bind(this);
        this.handleHighlight = this.handleHighlight.bind(this);
        this.handleCheckDelete = this.handleCheckDelete.bind(this);
        this.handleDelete = this.handleDelete.bind(this);
        this.onChangeDescripton = this.onChangeDescripton.bind(this);
        this.onChangeName = this.onChangeName.bind(this);
        this.updateDoc = this.updateDoc.bind(this);
        this.handleRemoveAchievement = this.handleRemoveAchievement.bind(this);
        this.handleAchievement = this.handleAchievement.bind(this);
        this.onChangeInstitution = this.onChangeInstitution.bind(this);
        this.onChangeTags = this.onChangeTags.bind(this);

        this.state = {
            login: false,
            /*Viewer mode State*/
            docEditor: false,
            checkEdit: false,
            checkDelete: false,
            addTags: false,
            docViewer: true,
            /*Document Properties*/
            docname: "Untitled",
            docdate: "",
            tags: [],
            highlighted: false,
            docdesc: "",
            achievement: false,
            acinst: "",
            acdate: "",
            owner: "",
            docId: this.props.match.params.id,
            /*All Tags Created*/
            allTags: [],
            allTagColors: [],
            fileType: "",
            filePath: "",
            loaded: false,
            dateChange: false,
            tagColors: [],
            updateTagColor: [],
            /*update properties*/
            updateDocname: "Untitled",
            updateDocdate: "",
            updateTags: [],
            updateHighlighted: false,
            updateDocdesc: "",
            updateAchievement: false,
            updateAcinst: "",
            updateAcdate: "",

        }

    }

    componentDidMount(){
        const getDoc = http+'/api/OneDocument/'+this.state.docId;
        axios.get(getDoc)
        .then(res=>{
            var tempTag = [];
            var i;
            for(i=0; i<res.data.document.tags.length; i++){
                tempTag.push(res.data.document.tags[i].name)
            }
            var parts = res.data.document.path.split('.');
            var pathParts = res.data.document.path.split('/');
            this.setState({
                docname: res.data.document.name,
                updateDocname: res.data.document.name,
                docdate: res.data.document.dateCreated.split("T")[0],
                updateDocdate: res.data.document.dateCreated.split("T")[0],
                highlighted: res.data.document.highlighted,
                updateHighlighted: res.data.document.highlighted,
                docdesc: res.data.document.description,
                updateDocdesc: res.data.document.description,
                achievement: res.data.document.achivement,
                updateAchievement: res.data.document.achivement,
                acinst: res.data.document.institution,
                updateAcinst: res.data.document.institution,
                acdate: res.data.document.dateAchieved.split("T")[0],
                updateAcdate: res.data.document.dateAchieved.split("T")[0],
                tags: tempTag,
                updateTags: tempTag,
                owner: res.data.document.owner,
                filePath: pathParts[pathParts.length-1],
                fileType: parts[parts.length-1]

            },()=>{
                this.setState({
                    loaded: true
                })
                var i;
                var currentColor = [];
                for(i=0; i<res.data.document.tags.length; i++){
                    currentColor.push(res.data.document.tags[i].color);
                }
                this.setState({
                    tagColors: currentColor,
                    updateTagColor:currentColor,
                })

                const tagUrl = http+'/api/tags/' + this.state.owner;
                axios.get(tagUrl)
                .then(res =>{
                    var tempTag = [];
                    var tempTagColors = [];

                    for(i=0; i<res.data.length; i++){
                      tempTag.push(res.data[i].name);
                      tempTagColors.push(res.data[i].color);
                    }
                    this.setState({
                      allTags: tempTag,
                      allTagColors: tempTagColors
                    })
                })
                .catch(function(error) {
                  console.log(error);
                })
            })

        })
        .catch(function(error) {
            console.log(error);
        });

        const check = http+'/api/users/check';
        axios.get(check, { withCredentials: true })
        .then(response => {
            if (response.data.logIn){
                this.setState({
                    login: true,
                })
            }
        })


    }

    handleViewerShow = () => {
        this.setState({ docViewer: true });

    }
    handleViewerClose = () => {
        this.setState({ docViewer: false});
        this.props.history.goBack();
    }
    handleEditorClose = () => {
        this.setState({ checkEdit: true});
    }
    /*Returns From checkEdit or checkDelete to re-edit document*/
    handleEditorShow = () => {
        this.setState({ checkEdit: false, checkDelete: false, docEditor: true});
    }
    /*Goes into Edit Mode*/
    handleViewerEdit = () => {
        this.setState({ docViewer: true , docEditor: true});

    }
    /* Save Changes before going back to Viewer Mode*/
    handleSaveChanges = () => {
        this.updateDoc()
        this.setState({docEditor:false, docViewer: true});
    }

    /* Leaves abruptly w/o saving Changes */
    handleAbruptLeave = () => {
        this.setState({
            docEditor:false,
            docViewer: true,
            checkEdit: false,
            updateAcdate: this.state.acdate,
            updateAchievement: this.state.achievement,
            updateAcinst: this.state.acinst,
            updateDocdate: this.state.docdate,
            updateDocdesc: this.state.docdesc,
            updateDocname: this.state.docname,
            updateHighlighted: this.state.highlighted,
            updateTagColor: this.state.tagColors,
            updateTags: this.state.tags,
        });
    }

    handleAddTags = () =>{
        this.setState({addTags: true});
    }
    /*Edit Tag state after selecting Relevant tags*/
    handleSetTags = () =>{
        this.setState({addTags: false});
    }
    handleRemoveHighlight = () =>{
        this.setState({highlighted: false});
    }

    handleHighlight = () =>{
        this.setState({highlighted: true});
    }

    handleCheckDelete =() =>{
        this.setState({checkDelete: true});
    }

    /*Delete document and close Editor*/
    handleDelete =() =>{
        const deleteDoc = http+'/api/documents/'+this.state.owner+'/'+this.state.docId;
        console.log(deleteDoc);
        axios.delete(deleteDoc, { withCredentials: true })
        .then(res => {
            console.log(res);
            this.setState({
                checkDelete: false,
                docEditor: false,
                docViewer: false
            }, ()=>{
                this.props.history.goBack();
            });
        });
    }

    handleAchievement =()=>{
        this.setState({updateAchievement: true})
    }

    handleRemoveAchievement =()=>{
        this.setState({updateAchievement: false})
    }

  updateDoc(){
    var date;

    if(this.state.dateChange){
        date = this.state.updateAcdate.toISOString().split('T')[0];
    }else{
        date = this.state.updateAcdate;
    }

      // wait for backend for updating tags
    const docForm = {
        'name': this.state.updateDocname,
        'highlighted': this.state.updateHighlighted,
        'description': this.state.updateDocdesc,
        'achivement': this.state.updateAchievement,
        'institution': this.state.updateAcinst,
        'dateAchieved': date,
        'tagName': this.state.updateTags,
    }

    const putDoc = http+'/api/editDocument/' + this.props.match.params.id;
    axios.put(putDoc, docForm, { withCredentials: true } )
    .then(res=>{
        this.setState({
            docname: this.state.updateDocname,
            docdate: this.state.updateDocdate,
            highlighted: this.state.updateHighlighted,
            docdesc: this.state.updateDocdesc,
            achievement: this.state.updateAchievement,
            acinst: this.state.updateAcinst,
            acdate: date,
            tagColors: this.state.updateTagColor,
        })
    })
    .catch(function(error) {
      console.log(error);
    });

  }

  onChangeDescripton(e){
    this.setState({
        updateDocdesc: e.target.value
    });
  }

  onChangeName(e){
    this.setState({
        updateDocname: e.target.value
    });
  }

  onChangeInstitution(e){
    this.setState({
        updateAcinst: e.target.value
    })
  }

  onChangeTags(e){
    var chosetag = this.state.updateTags;
    var chooseTagColors = this.state.updateTagColor;
    var colorIndex = this.state.allTags.indexOf(e.target.value);
    if(e.target.checked){
        chosetag.push(e.target.value);
        chooseTagColors.push(this.state.allTagColors[colorIndex])
    }else{
        var index = chosetag.indexOf(e.target.value);
        chosetag.splice(index, 1);
        chooseTagColors.splice(index, 1);
    }
    this.setState({
        updateTags: chosetag,
        updateTagColor: chooseTagColors
    })
  }

  onError = (e) => {
    console.log(e, "error in file-viewer");
  };

  render(){
    var tags;
    var tagColors;

    if(this.state.docEditor){
        tags = this.state.updateTags;
        tagColors = this.state.updateTagColor;
    }else{
        tags = this.state.tags;
        tagColors = this.state.tagColors;
    }

    let tagsMap = tags.map((tags, idx) =>{
        return(
            <Tag note={tags} variant={tagColors[idx]}/>
        )
    })

    let showtagButtons = tags.map(onetag =>{
        return(
          <Button
            variant = "outline-danger"
            style = {{border: "0px solid red"}}>
            <Tag note={onetag} />
          </Button>
        )
    })

    var allTags = this.state.allTags;
    var allTagColors = this.state.allTagColors;

    let SelectTags = allTags.map((onetag, idx) =>{
        var check = this.state.tags.includes(onetag);
        return(
            <InputGroup className = "select-tags">
              <InputGroup.Prepend>
                <InputGroup.Checkbox onChange={this.onChangeTags} value={onetag} checked={check}/>
              </InputGroup.Prepend>
              <InputGroup.Append>
                  <Tag note={onetag} variant={allTagColors[idx]}/>
              </InputGroup.Append>
            </InputGroup>
        )
    })

    var path = this.state.filePath;
    // change line 501 {require("/usr/src/uploads/images/"+path)}

    return(
        <body>
        <Modal
            dialogClassName = "docedit"
            show = {this.state.docViewer}
            onHide={this.handleViewerClose}
            backdrop="static"
            keyboard={false}
        >
        { this.state.docEditor ?(
            <Modal.Header className = "docedit-header">
                <Modal.Title className = "doc-highlight">
                    <InputGroup size ="lg">
                        <FormControl
                        defaultValue = {this.state.docname}
                        placeholder = "Name"
                        aria-label= "name"
                        onChange = {this.onChangeName}/>
                        <InputGroup.Append>
                        {this.state.highlighted? (
                            <Button variant= "warning" onClick = {this.handleRemoveHighlight}>
                                Remove Highlight
                            </Button>
                        ):(
                            <Button variant= "outline-dark" onClick = {this.handleHighlight}>
                              Highlight
                            </Button>)
                        }
                        </InputGroup.Append>
                    </InputGroup>
                </Modal.Title>
                  {/*Change doc-date to document added date*/}
                  <h6> Added on: <span> {this.state.docdate} </span> </h6>
            </Modal.Header>
        ):(
            <Modal.Header className = "docview-header">
                {/*Change doc-name to document name*/}
                {this.state.highlighted ?(
                    <Modal.Title className = "doc-highlighted">
                    <h4>{this.state.docname}</h4>
                    </Modal.Title>
                ):(
                    <Modal.Title ><h4>{this.state.docname}</h4></Modal.Title>)
                }
                {/*Change doc-date to document added date*/}
                <h6> Added on: <span> {this.state.docdate} </span> </h6>
            </Modal.Header>
        )}

        <Modal.Body className = "docedit-body" >
            <Container fluid>
            <Row>
                <Col className = "docview-image" xs ={5} md = {5} style={{height: "35vmax"}}>
                    {this.state.loaded? (
                        <FileViewer
                            fileType={this.state.fileType}
                            filePath={require("/usr/src/uploads/images/"+path)}
                            errorComponent={CustomErrorComponent}
                            onError={this.onError}
                            key={this.props.match.params.id}
                        />
                    ):(
                        <Spinner animation="border" variant="secondary" />
                    )}

                    { this.state.docEditor ? (
                        <Row>
                            <Button
                             block
                             variant = "outline-danger"
                             onClick = {this.handleCheckDelete}>
                                Delete Document
                            </Button>
                            </Row>
                    ):(
                        <Row></Row>
                    )}
                </Col>

                {this.state.docEditor?(
                    <Col className = "docedit-properties">
                        <Row>
                            <h4>Attached Tags</h4>
                        </Row>

                        <Row className = "doc-tags">
                            <h4>{showtagButtons}</h4>
                            <Button block variant = "success" onClick ={this.handleAddTags}>Alter Tags</Button>
                        </Row>

                        <Row>
                            <h4> Description</h4>
                        </Row>

                        <Row className = "doc-description">
                        <FormControl
                            as = "textarea"
                            rows = "4"
                            placeholder = "About the Document"
                            defaultValue = {this.state.docdesc}
                            aria-label= "description"
                            onChange={this.onChangeDescripton}
                        />
                        </Row>

                        <Row>
                            {this.state.updateAchievement ? (
                                <Button variant='outline-warning' onClick={this.handleRemoveAchievement} style={{marginRight: "1vmax"}}> Remove  </Button>
                            ):(
                                <Button variant='outline-success' onClick={this.handleAchievement} style={{marginRight: "1vmax"}}> Add </Button>
                            )}
                            <h4>Achievement Details</h4>
                        </Row>
                            {/* only show this row when document is an achievement is checked out */}
                        <Collapse in={this.state.updateAchievement}>
                            <Row className = "doc-achievement">
                                <FormControl
                                    placeholder = "Issuing Institution"
                                    defaultValue = {this.state.acinst}
                                    style ={{marginBottom: "0.6vmax"}}
                                    onChange = {this.onChangeInstitution}/>
                                <DatePicker
                                selected={new Date(this.state.updateAcdate)}
                                onChange={date  => this.setState({updateAcdate: date, dateChange: true})}
                                dateFormat={'yyyy/MM/dd'}
                                />
                            </Row>
                        </Collapse>
                    </Col>
                ):(
                    <Col className = "docview-properties">
                        <Row>
                            <h4>Attached Tags</h4>

                        </Row>
                        <Row className = "doc-tags">
                            <h4>{tagsMap}</h4>
                        </Row>

                        <Row>
                            <h4> Description</h4>
                        </Row>

                        <Row className = "doc-description">
                            <p>
                                {this.state.docdesc}
                            </p>
                        </Row>

                        <Row>
                        {this.state.achievement ?(
                            <h4>Achievement Details</h4>
                        ):(
                            <h4 style = {{color: "rgba(200,200,200,0.6)", textDecoration: "line-through"}}>
                                Achievement Details
                            </h4>
                        )}

                                {/* If the field is not an achievemnt change the opacity of h4*/}
                        </Row>
                            {/* only show this row when document is an achievement is checked out */}
                        <Collapse in={this.state.achievement}>
                            <Row className = "doc-achievement">
                                <h5>Institution: <span>{this.state.acinst}</span></h5>
                                <h5>Date: <span>{this.state.acdate}</span></h5>
                            </Row>
                        </Collapse>

                    </Col>
                )}


            </Row>
            </Container>
        </Modal.Body>
        {this.state.docEditor?(
            <Modal.Footer className = "docedit-footer">
                <Button variant = "outline-dark" onClick ={this.handleEditorClose} >Close</Button>
                <Button variant = "outline-dark" onClick ={this.handleSaveChanges}>Save Changes</Button>
             </Modal.Footer>

        ):(
            <Modal.Footer className = "docview-footer">
            <Button variant = "outline-dark" onClick ={this.handleViewerClose} >Close</Button>
            {this.state.login ? (
                <Button variant = "outline-dark" onClick ={this.handleViewerEdit}>Edit</Button>
            ):(
                <div></div>
            )}
            </Modal.Footer>
        )}


        <Modal
            show={this.state.checkEdit}
            className = "docedit-leave">
            <Modal.Header>
                <h4> All unsaved changes will be lost </h4>
            </Modal.Header>

            <Modal.Footer className = "docedit-footer">
                <Button variant = "outline-dark" onClick ={this.handleEditorShow} >Return</Button>
                <Button
                    variant = "outline-danger"
                    onClick ={this.handleAbruptLeave}>Close</Button>
            </Modal.Footer>
        </Modal>

        <Modal
            show = {this.state.addTags}
            className = "docedit-add-tags">
            <Modal.Header>
                <h4>Select Relevant tags</h4>
            </Modal.Header>
            <Modal.Body>
                {SelectTags}
            </Modal.Body>
            <Modal.Footer className = "docedit-footer-tags">
                <Button
                    variant = "outline-success"
                    onClick ={this.handleSetTags}>Save</Button>
                </Modal.Footer>
        </Modal>


        </Modal>
    </body>
    )
 }
}
export default singleDoc;

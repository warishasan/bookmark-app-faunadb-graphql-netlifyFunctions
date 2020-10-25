import React, {useState,useRef} from "react"
import "bootstrap/dist/css/bootstrap.min.css"
import Navbar from "react-bootstrap/Navbar"
import Jumbotron from "react-bootstrap/Jumbotron"
import Container from "react-bootstrap/Container"
import { useQuery, useMutation, gql } from "@apollo/client"
import Modal from 'react-bootstrap/Modal'
import Button from 'react-bootstrap/Button'
import Form from 'react-bootstrap/Form'
import ListGroup from 'react-bootstrap/ListGroup'
import Spinner from 'react-bootstrap/Spinner'
const styles = require("./index.module.css")

export default function Home() {
  const AddBookMarkMutation = gql`
    mutation addBookmark($url: String!, $desc: String!, $title: String!) {
      addBookmark(url: $url, desc: $desc, title: $title) {
        url
        desc
        title
        id
      }
    }
  `
  const BookMarksQuery = gql`
    {
      bookmark {
        id
        url
        desc
        title
      }
    }
  `

  const [addBookmark] = useMutation(AddBookMarkMutation)
  const { loading, error, data } = useQuery(BookMarksQuery)
  const [show, setShow] = useState(false);
  const inputTitle = useRef<HTMLInputElement>();
  const inputUrl = useRef<HTMLInputElement>();
  const inputDesc = useRef<HTMLInputElement>();


  

  return (
    <div>
      <Navbar bg="dark" variant="dark">
        <Navbar.Brand href="#home">BOOKMARKS!</Navbar.Brand>
      </Navbar>

      <Container>
        <Jumbotron className = {styles.jumbotron}>
        
        <div className = {styles.titleContainer}>          
          <h2>My Bookmarks</h2>
          <svg onClick ={()=>{setShow(true)}} width="2em" height="2em" viewBox="0 0 16 16" className = {styles.addIcon} fill="currentColor" xmlns="http://www.w3.org/2000/svg">
  <path fillRule="evenodd" d="M2 0a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2H2zm6.5 4.5a.5.5 0 0 0-1 0v3h-3a.5.5 0 0 0 0 1h3v3a.5.5 0 0 0 1 0v-3h3a.5.5 0 0 0 0-1h-3v-3z"/>
</svg>
</div>



<ListGroup className = {styles.list} variant="flush">
  {loading? <div className = {styles.loader}><Spinner animation="border" /></div>:
  error? <div className = {styles.msgText} >An unexpected error occured, please refresh the page!</div>:
  data.bookmark.length === 0 ? <h5 className = {styles.msgText} >You have no saved bookmarks</h5>:

  data.bookmark.map((val,ind)=>

  <ListGroup.Item key = {ind}>
    <h5><a  target="_blank" href={val.url}>{val.title}</a></h5>
    <p>{val.desc}</p>
  </ListGroup.Item>
  )

}
 
</ListGroup>


        </Jumbotron>
      </Container>


      <Modal
        show={show}
        onHide={()=>{setShow(false)}}
        backdrop="static"
        keyboard={false}
      >
        <Modal.Header closeButton>
          <Modal.Title>Add a Bookmark</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          
        <Form.Group controlId="title">

    <Form.Control  ref={inputTitle} type="text" placeholder="Enter Title" />
 
  </Form.Group>

  <Form.Group controlId="url">

    <Form.Control  ref={inputUrl}  type="text" placeholder="Enter Url" />
 
  </Form.Group>

  <Form.Group controlId="description">

    <Form.Control  ref={inputDesc} type="text" placeholder="Enter Description" />
 
  </Form.Group>

        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={()=>{setShow(false)}}>
            Close
          </Button>
          <Button variant="primary" onClick={() => {
                var res = inputUrl.current.value.slice(0, 8);
                if (res !== "https://"){
                  inputUrl.current.value = `https://${inputUrl.current.value}`
                }

              addBookmark({
                variables: { url: inputUrl.current.value, desc: inputDesc.current.value, title: inputTitle.current.value },
                refetchQueries: [{ query: BookMarksQuery }],
              })
              inputTitle.current.value = "";
              inputUrl.current.value = "";
              inputDesc.current.value = "";
              setShow(false)
            }} >Add</Button>
        </Modal.Footer>
      </Modal>
    </div>
  )
}

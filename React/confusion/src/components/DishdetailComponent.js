import React, {Component} from 'react';
import {Card, CardImg, CardText, CardTitle, CardBody, Breadcrumb, BreadcrumbItem,
        Button, Modal, ModalBody, ModalHeader, Col, Row, Label} from 'reactstrap';
import {LocalForm, Control, Errors} from 'react-redux-form';
import {Link} from 'react-router-dom';
import {Loading} from './LoadingComponent';

const required = (value) => value && value.length;
const minLength = (length) => (value) => (value) && (value.length >= length);
const maxLength = (length) => (value) => !(value) || (value.length <= length);

class CommentForm extends Component {

  constructor(props) {
    super(props);
    this.state = {
      isCommentModalOpen:false
    };

    this.toggleCommentModal = this.toggleCommentModal.bind(this);
    this.handleComment = this.handleComment.bind(this);
  }

  toggleCommentModal() {
    this.setState({
      isCommentModalOpen: !this.state.isCommentModalOpen
    });
  }

  handleComment(values) {
    this.toggleCommentModal();
    this.props.addComment(this.props.dishId, values.rating, values.author, values.comment);
  }

  render() {
    return (
      <React.Fragment>
        <div>
          <Button outline onClick={this.toggleCommentModal}>
            <span className="fa fa-edit fa-lg"></span> Submit Comment
          </Button>
        </div>
        <Modal isOpen={this.state.isCommentModalOpen} toggle={this.toggleCommentModal}>
          <ModalHeader isOpen={this.state.isCommentModalOpen} toggle={this.toggleCommentModal}>Submit Comment</ModalHeader>
          <ModalBody>
            <LocalForm onSubmit={(values) => this.handleComment(values)}>
              <Row className="form-group">
                <Label htmlFor="rating" md={12}>Rating</Label>
                <Col md={12}>
                  <Control.select model=".rating" name="rating" className="form-control">
                    <option>1</option>
                    <option>2</option>
                    <option>3</option>
                    <option>4</option>
                    <option>5</option>
                  </Control.select>
                </Col>
              </Row>
              <Row className="form-group">
                <Label htmlFor="author" md={12}>Your Name</Label>
                <Col md={12}>
                  <Control.text model=".author" name="author"
                    className="form-control" placeholder="Your Name"
                    validators={{minLength: minLength(3),
                      maxLength: maxLength(15)}}
                    />
                    <Errors
                      className="text-danger" model=".author"
                      show="touched" messages={{
                        required: "Required",
                        minLength: "Must be greater than 2 characters",
                        maxLength: "Must be 15 characters or less"
                      }}
                    />
                </Col>
              </Row>
              <Row className="form-group">
                <Label htmlFor="comment" md={12}>Comment</Label>
                <Col md={12}>
                  <Control.textarea model=".comment" id="comment" name="comment"
                    rows="6"  className="form-control"/>
                </Col>
              </Row>
              <Row className="form-group">
                <Col md={2}>
                  <Button type="submit" value="submit" color="primary">Submit</Button>
                </Col>
              </Row>
            </LocalForm>
          </ModalBody>
        </Modal>
      </React.Fragment>
    );
  }
}


function RenderDish({dish}) {
  return (
    <Card>
      <CardImg width="100%" src={dish.image} alt={dish.name}/>
      <CardBody>
        <CardTitle>{dish.name}</CardTitle>
        <CardText>{dish.description}</CardText>
      </CardBody>
    </Card>
  );
}


function RenderComments({comments, addComment, dishId}) {
  const commentList = comments.map((comment) => {
    return (
      <li key={comment.id}>
        <p>{comment.comment}</p>
        <p>-- {comment.author}, {new Intl.DateTimeFormat('en-US', { year: 'numeric', month: 'short', day: '2-digit'}).format(new Date(Date.parse(comment.date)))}</p>
      </li>
    );
  });

  if (comments != null) {
    return (
      <div>
        <h4>Comments</h4>
        <ul className="list-unstyled">
          {commentList}
        </ul>
        <CommentForm addComment={addComment} dishId={dishId}/>
      </div>
    );
  } else {
    return (<div><CommentForm addComment={addComment} dishId={dishId} /></div>);
  }
}

const DishDetail = (props) => {
  if (props.dishesLoading) {
    return (
      <div className="container">
        <div className="row">
          <Loading />
        </div>
      </div>
    );
  } else if (props.dishesErrMessage) {
    return (
      <div className="container">
        <div className="row">
          <h4>{props.dishesErrMessage}</h4>
        </div>
      </div>
    );
  } else if (props.dish != null) {
    return (
      <div className="container">
        <div className="row">
          <Breadcrumb>
            <BreadcrumbItem><Link to="/menu">Menu</Link></BreadcrumbItem>
            <BreadcrumbItem active>{props.dish.name}</BreadcrumbItem>
          </Breadcrumb>
          <div className="col-12">
            <h3>{props.dish.name}</h3>
            <hr/>
          </div>
          <div className="col-12 col-md-5 m-1">
            <RenderDish dish={props.dish}/>
          </div>
          <div className="col-12 col-md-5 m-1">
            <RenderComments comments={props.comments}
              addComment={props.addComment}
              dishId={props.dish.id}/>
          </div>
        </div>
      </div>
    );
  } else {
    return (<div></div>);
  }
}


export default DishDetail;

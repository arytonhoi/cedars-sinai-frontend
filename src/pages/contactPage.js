import React, { Component } from "react";
import PropTypes from "prop-types";
import axios from "axios";

// redux
import { connect } from "react-redux";
import {
  // departments
  getDepartments,
  patchDepartment,
  postDepartment,
  deleteDepartment,
  // contacts
  getContacts,
  patchContact,
  postContact,
  deleteContact,
  // search
  getSearchedContacts,
} from "../redux/actions/dataActions";

// Components
import DepartmentSection from "../components/contacts/departmentSection";
import AddDepartmentModal from "../components/contacts/addDepartmentModal";
import EditDepartmentModal from "../components/contacts/editDepartmentModal";
import AddContactModal from "../components/contacts/addContactModal";
import EditContactModal from "../components/contacts/editContactModal";

// css styles
import "../css/contactPage.css";

// Ant design
import { Button, Input, Layout } from "antd";
import { SearchOutlined } from "@ant-design/icons";
const { Content, Footer } = Layout;
const defaultContactPic = `https://firebasestorage.googleapis.com/v0/b/fir-db-d2d47.appspot.com/o/
cedars_robot_1080x1080.jpg?alt=media&token=0932153f-e1e3-4f47-b419-fd5ae76abd34`;

class ContactPage extends Component {
  componentDidMount() {
    this.props.getDepartments();
    this.props.getContacts();
  }

  constructor() {
    super();
    this.state = {
      // departments
      addingDepartment: false,
      targettedDepartmentId: "",
      departmentName: "",
      // contacts
      targettedContactId: "",
      addingContact: false,
      contactName: "",
      contactImgUrl: "",
      contactDepartmentId: "",
      contactPhone: "",
      contactEmail: "",
      // search
      searchTerm: "",
      // editing
      isEditing: true,
      visible: false,
      // errors
      errors: {},
    };
  }

  toggleEditing = () => {
    this.setState({
      isEditing: !this.state.isEditing,
    });
  };

  // images
  handleClickImageUpload = () => {
    const fileInputDocument = document.getElementById("imageInput");
    fileInputDocument.click();
  };

  handleImageChange = (event) => {
    const image = event.target.files[0];
    const formData = new FormData();
    formData.append("image", image, image.name);
    axios
      .post(`/images`, formData)
      .then((res) => {
        this.setState({
          contactImgUrl: res.data.imgUrl,
        });
      })
      .catch((err) => {
        console.log(err);
      });
  };

  // contact functions
  handleAddNewContact = (departmentId) => {
    this.setState({
      addingContact: true,
      targettedContactId: "",
      contactName: "",
      contactImgUrl: "",
      contactDepartmentId: departmentId,
      contactPhone: "",
      contactEmail: "",
    });
  };

  handleSubmitNewContact = (event) => {
    event.preventDefault();
    const newContact = {
      name: this.state.contactName,
      imgUrl: this.state.contactImgUrl,
      departmentId: this.state.contactDepartmentId,
      phone: this.state.contactPhone,
      email: this.state.contactEmail,
    };
    this.props.postContact(newContact);
    this.setState({
      addingContact: false,
      contactName: "",
      contactImgUrl: "",
      contactDepartmentId: "",
      contactPhone: "",
      contactEmail: "",
      searchTerm: "",
    });
  };

  handleEditThisContact = (contactId) => {
    const contacts = this.props.data.contacts;
    const contact = contacts.find((c) => c.id === contactId);
    this.setState({
      addingContact: false,
      targettedContactId: contactId,
      contactName: contact.name,
      contactImgUrl: contact.imgUrl,
      contactDepartmentId: contact.departmentId,
      contactPhone: contact.phone,
      contactEmail: contact.email,
    });
  };

  handleSubmitContactChange = (event) => {
    event.preventDefault();
    const updatedContactId = this.state.targettedContactId;
    const updatedContact = {
      name: this.state.contactName,
      imgUrl: this.state.contactImgUrl,
      departmentId: this.state.contactDepartmentId,
      phone: this.state.contactPhone,
      email: this.state.contactEmail,
    };
    this.props.patchContact(updatedContactId, updatedContact);
    this.setState({
      targettedContactId: "",
    });
  };

  handleCancelContactChange = (event) => {
    this.setState({
      targettedContactId: "",
      addingContact: false,
      contactName: "",
      contactImgUrl: "",
      contactDepartmentId: "",
      contactPhone: "",
      contactEmail: "",
    });
  };

  handleDeleteContact = (contactId) => {
    const confirmDeleteContact = window.confirm("Are you sure?");
    if (confirmDeleteContact) {
      this.props.deleteContact(contactId);
      this.setState({
        targettedContactId: "",
      });
    }
  };

  // department functions
  handleAddNewDepartment = (event) => {
    this.setState({
      addingDepartment: true,
      departmentName: "",
    });
  };

  handleSubmitNewDepartment = (event) => {
    event.preventDefault();
    const newDepartment = {
      name: this.state.departmentName,
    };
    this.props.postDepartment(newDepartment);
    this.setState({
      addingDepartment: false,
      departmentName: "",
    });
  };

  handleEditThisDepartment = (departmentId) => {
    const departments = this.props.data.departments;
    const department = departments.find((d) => d.id === departmentId);
    this.setState({
      targettedDepartmentId: departmentId,
      departmentName: department.name,
    });
  };

  handleSubmitDepartmentChange = (event) => {
    event.preventDefault();
    const updatedDepartmentId = this.state.targettedDepartmentId;
    const updatedDepartment = {
      name: this.state.departmentName,
    };
    this.props.patchDepartment(updatedDepartmentId, updatedDepartment);
    this.setState({
      targettedDepartmentId: "",
    });
  };

  handleCancelDepartmentChange = (event) => {
    this.setState({
      targettedDepartmentId: "",
      addingDepartment: false,
      departmentName: "",
    });
  };

  handleDeleteDepartment = (departmentId) => {
    const confirmDeleteDepartment = window.confirm("Are you sure?");
    if (confirmDeleteDepartment) {
      this.props.deleteDepartment(departmentId);
      this.setState({
        targettedDepartmentId: "",
        departmentName: "",
      });
    }
  };

  handleChange = (event) => {
    this.setState({
      [event.target.name]: event.target.value,
    });

    if (event.target.name === "searchTerm") {
      this.props.getSearchedContacts(event.target.value);
    }
  };

  render() {
    const { credentials } = this.props.user;
    const isAdmin = credentials.isAdmin;
    const { matchingSearchContacts, departments } = this.props.data;

    // insert default contact pic for contacts w/o avatars
    const matchingSearchContactsWithImgs = matchingSearchContacts.map((c) => {
      const contactWithImg = c;
      if (contactWithImg.imgUrl === "") {
        contactWithImg.imgUrl = defaultContactPic;
      }
      return contactWithImg;
    });

    // departments
    const departmentsListComponent = departments.map((d) => {
      const departmentContacts = matchingSearchContactsWithImgs.filter(
        (c) => c.departmentId === d.id
      );
      return (
        <DepartmentSection
          key={d.id}
          department={d}
          contacts={departmentContacts}
          handleEditThisDepartment={this.handleEditThisDepartment}
          handleDeleteDepartment={this.handleDeleteDepartment}
          handleAddNewContact={this.handleAddNewContact}
          handleSubmitNewContact={this.handleSubmitNewContact}
          handleEditThisContact={this.handleEditThisContact}
          handleSubmitContactChange={this.handleSubmitContactChange}
          handleCancelContactChange={this.handleCancelContactChange}
          handleDeleteContact={this.handleDeleteContact}
          handleChange={this.handleChange}
          isEditing={this.state.isEditing}
        />
      );
    }, this);

    return (
      <div className="container">
        <header className="contactHeader">
          <div className="contactHeaderTitle">
            <h1>Contacts</h1>
          </div>
          <div className="contactSearchDiv">
            <Input
              style={{ width: 300 }}
              className="contactSearchInput"
              id="searchTerm"
              name="searchTerm"
              type="text"
              placeholder="Search contacts by name"
              value={this.state.searchTerm}
              onChange={this.handleChange}
              suffix={
                <SearchOutlined
                  className="contactSearchInputIcon"
                  style={{ color: "rgba(0,0,0,.45)" }}
                />
              }
            />
            {isAdmin && !this.state.isEditing && (
              <Button
                type="primary"
                size={"medium"}
                onClick={() => this.toggleEditing()}
              >
                Edit
              </Button>
            )}
            {isAdmin && this.state.isEditing && (
              <Button
                type="primary"
                size={"medium"}
                onClick={() => this.toggleEditing()}
              >
                Done Editing
              </Button>
            )}
          </div>
        </header>
        <Layout className="verticalFillLayout">
          <Content className="contact-content-container">
            <AddDepartmentModal
              visible={isAdmin && this.state.addingDepartment}
              departmentName={this.state.departmentName}
              handleSubmitNewDepartment={this.handleSubmitNewDepartment}
              handleCancelDepartmentChange={this.handleCancelDepartmentChange}
              handleChange={this.handleChange}
            />

            <EditDepartmentModal
              visible={isAdmin && this.state.targettedDepartmentId !== ""}
              departmentId={this.state.targettedDepartmentId}
              departmentName={this.state.departmentName}
              handleSubmitDepartmentChange={this.handleSubmitDepartmentChange}
              handleCancelDepartmentChange={this.handleCancelDepartmentChange}
              handleDeleteDepartment={this.handleDeleteDepartment}
              handleChange={this.handleChange}
            />

            <AddContactModal
              visible={isAdmin && this.state.addingContact}
              contactDepartmentId={this.state.contactDepartmentId}
              departments={departments}
              contactImgUrl={this.state.contactImgUrl}
              contactPhone={this.state.contactPhone}
              contactEmail={this.state.contactEmail}
              handleSubmitNewContact={this.handleSubmitNewContact}
              handleCancelContactChange={this.handleCancelContactChange}
              handleClickImageUpload={this.handleClickImageUpload}
              handleImageChange={this.handleImageChange}
              handleChange={this.handleChange}
            />

            <EditContactModal
              visible={isAdmin && this.state.targettedContactId !== ""}
              contactDepartmentId={this.state.contactDepartmentId}
              departments={departments}
              contactId={this.state.targettedContactId}
              contactName={this.state.contactName}
              contactImgUrl={this.state.contactImgUrl}
              contactPhone={this.state.contactPhone}
              contactEmail={this.state.contactEmail}
              handleCancelContactChange={this.handleCancelContactChange}
              handleSubmitContactChange={this.handleSubmitContactChange}
              handleDeleteContact={this.handleDeleteContact}
              handleClickImageUpload={this.handleClickImageUpload}
              handleImageChange={this.handleImageChange}
              handleChange={this.handleChange}
            />
            {isAdmin && this.state.isEditing && (
              <div style={{ textAlign: "right", padding: " 10px 20px" }}>
                <Button
                  type="primary"
                  size={"medium"}
                  onClick={() => this.handleAddNewDepartment()}
                >
                  Add Department
                </Button>
              </div>
            )}
            {departmentsListComponent}
          </Content>
          <Footer style={{ textAlign: "center" }}>DevelopForGood ©2020</Footer>
        </Layout>
      </div>
    );
  }
}

ContactPage.propTypes = {
  data: PropTypes.object.isRequired,
  user: PropTypes.object.isRequired,
  // departments
  getDepartments: PropTypes.func.isRequired,
  postDepartment: PropTypes.func.isRequired,
  patchDepartment: PropTypes.func.isRequired,
  deleteDepartment: PropTypes.func.isRequired,
  // contacts
  getContacts: PropTypes.func.isRequired,
  patchContact: PropTypes.func.isRequired,
  postContact: PropTypes.func.isRequired,
  deleteContact: PropTypes.func.isRequired,
  getSearchedContacts: PropTypes.func.isRequired,
};

const mapStateToProps = (state) => {
  return {
    data: state.data,
    user: state.user,
  };
};

export default connect(mapStateToProps, {
  // departments
  getDepartments,
  postDepartment,
  patchDepartment,
  deleteDepartment,
  // contacts
  getContacts,
  patchContact,
  postContact,
  deleteContact,
  // search
  getSearchedContacts,
})(ContactPage);
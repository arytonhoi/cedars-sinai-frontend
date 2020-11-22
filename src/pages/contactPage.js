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
import DepartmentList from "../components/contacts/departmentList";
import DepartmentEditorModal from "../components/contacts/departmentEditorModal";
import ContactEditorModal from "../components/contacts/contactEditorModal";

// css styles
import "../css/page.css";

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
      isEditingPage: false,
      // departments
      // addingDepartment: false,
      confirmDeleteDepartment: false,
      departmentId: "",
      departmentName: "",
      // contacts
      contactDepartmentId: "",
      contactId: "",
      contactName: "",
      contactImgUrl: "",
      contactPhone: "",
      contactEmail: "",
      // confirmDeleteContact: false,
      // search
      searchTerm: "",
      // modals
      showContactEditorModal: false,
      showDepartmentEditorModal: false,
      // image
      isUploading: false,
      // errors
      errors: {},
    };
  }

  // images
  // handleClickImageUpload = () => {
  //   const fileInputDocument = document.getElementById("imageInput");
  //   fileInputDocument.click();
  // };

  handleImageChange = (event) => {
    console.log(event);
    // const image = event.target.files[0];
    const image = event;
    const formData = new FormData();
    // const reader = new FileReader();
    // reader.addEventListener(
    //   "load",
    //   () =>
    //     this.setState({
    //       contactImgUrl: reader.result,
    //       isUploading: true,
    //     }),
    //   false
    // );
    // if (typeof image !== "undefined") {
    //   reader.readAsDataURL(image);
    // }
    formData.append("image", image, image.name);
    axios
      .post(`/images`, formData)
      .then((res) => {
        this.setState({
          contactImgUrl: res.data.imgUrl,
          isUploading: false,
        });
      })
      .catch((err) => {
        console.log(err);
      });
  };

  // general form changes
  handleChange = (event) => {
    const value = event.target.value.trim();
    this.setState({
      [event.target.name]: value,
    });

    if (event.target.name === "searchTerm") {
      this.props.getSearchedContacts(value);
    }
  };

  toggleEditPage = () => {
    this.setState({
      isEditingPage: !this.state.isEditingPage,
    });
  };

  // department functions
  handleAddorEditDepartment = (departmentId = null) => {
    this.setState({
      showDepartmentEditorModal: true,
    });
    console.log(departmentId);
    if (departmentId === null) {
      this.setState({
        departmentName: "",
      });
    } else {
      const departments = this.props.data.departments;
      const department = departments.find((d) => d.id === departmentId);
      this.setState({
        departmentId: departmentId,
        departmentName: department.name,
      });
    }
  };

  handlePostOrPatchDepartment = (formValues) => {
    const newDepartment = {
      name: formValues.departmentName,
    };
    if (this.state.departmentId === "") {
      // posting new department
      this.props.postDepartment(newDepartment);
    } else {
      // editing exisitng department
      this.props.patchDepartment(this.state.departmentId, newDepartment);
    }

    this.handleCancelAddorEditDepartment();
  };

  handleDeleteDepartment = () => {
    this.props.deleteDepartment(this.state.departmentId);
    this.handleCancelAddorEditDepartment();
  };

  handleCancelAddorEditDepartment = () => {
    this.setState({
      showDepartmentEditorModal: false,
      departmentId: "",
      departmentName: "",
    });
  };

  // contact functions
  handleAddorEditContact = (departmentId, contactId = null) => {
    this.setState({
      departmentId: departmentId,
      showContactEditorModal: true,
    });

    if (contactId === null) {
      // adding new contact
      this.setState({
        contactDepartmentId: departmentId,
        contactId: "",
        contactName: "",
        contactImgUrl: defaultContactPic,
        contactPhone: "",
        contactEmail: "",
      });
    } else {
      // editing existing contact
      const contacts = this.props.data.contacts;
      const contact = contacts.find((c) => c.id === contactId);
      this.setState({
        contactId: contactId,
        contactName: contact.name,
        contactImgUrl: contact.imgUrl,
        contactDepartmentId: contact.departmentId,
        contactPhone: contact.phone,
        contactEmail: contact.email,
      });
    }
  };

  handlePostOrPatchContact = (formValues) => {
    const newContact = {
      departmentId: formValues.contactDepartmentId,
      name: formValues.contactName,
      phone: formValues.contactPhone,
      email: formValues.contactEmail,
      imgUrl: formValues.contactImgUrl,
    };
    console.log(newContact);
    if (this.state.contactId === "") {
      // posting new contact
      this.props.postContact(newContact);
    } else {
      // editing exisitng contact
      this.props.patchContact(this.state.contactId, newContact);
    }

    this.handleCancelAddorEditContact();
  };

  handleDeleteContact = () => {
    this.props.deleteContact(this.state.contactId);
    this.handleCancelAddorEditContact();
  };

  handleCancelAddorEditContact = () => {
    this.setState({
      showContactEditorModal: false,
      departmentId: "",
      contactId: "",
      contactName: "",
      contactImgUrl: "",
      contactDepartmentId: "",
      contactPhone: "",
      contactEmail: "",
    });
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

    return (
      <div className="page-container">
        <header className="page-header-container">
          <div className="page-header-main-items">
            <h1>Contact Us</h1>
            <span className="page-header-interactive-items">
              <Input
                style={{ width: 300 }}
                id="searchTerm"
                name="searchTerm"
                type="text"
                placeholder="Search contacts by name"
                value={this.state.searchTerm}
                onChange={this.handleChange}
                suffix={<SearchOutlined style={{ color: "rgba(0,0,0,.45)" }} />}
              />
              {isAdmin && !this.state.isEditingPage && (
                <Button
                  type="primary"
                  size={"medium"}
                  onClick={() => this.toggleEditPage()}
                >
                  Edit
                </Button>
              )}
              {isAdmin && this.state.isEditingPage && (
                <Button
                  size={"medium"}
                  onClick={() => this.handleAddorEditDepartment()}
                >
                  Add Department
                </Button>
              )}

              {isAdmin && this.state.isEditingPage && (
                <Button
                  type="primary"
                  size={"medium"}
                  onClick={() => this.toggleEditPage()}
                >
                  Done Editing
                </Button>
              )}
            </span>
          </div>
        </header>
        <Layout className="vertical-fill-layout">
          <Content className="content-card">
            <DepartmentEditorModal
              // flags
              visible={isAdmin && this.state.showDepartmentEditorModal}
              isEditingExistingDepartment={this.state.departmentId !== ""}
              // department info
              departmentName={this.state.departmentName}
              handlePostOrPatchDepartment={this.handlePostOrPatchDepartment}
              handleDeleteDepartment={this.handleDeleteDepartment}
              handleCancelAddorEditDepartment={
                this.handleCancelAddorEditDepartment
              }
            />

            <ContactEditorModal
              // flags
              visible={isAdmin && this.state.showContactEditorModal}
              isEditingExistingContact={this.state.contactId !== ""}
              // contact info
              departments={departments}
              contactDepartmentId={this.state.contactDepartmentId}
              contactName={this.state.contactName}
              contactImgUrl={this.state.contactImgUrl}
              contactPhone={this.state.contactPhone}
              contactEmail={this.state.contactEmail}
              // form functions
              handlePostOrPatchContact={this.handlePostOrPatchContact}
              handleDeleteContact={this.handleDeleteContact}
              handleCancelAddorEditContact={this.handleCancelAddorEditContact}
              handleImageChange={this.handleImageChange}
            />
            <DepartmentList
              // data
              departments={departments}
              contacts={matchingSearchContactsWithImgs}
              // departments
              handleAddorEditDepartment={this.handleAddorEditDepartment}
              // contacts
              handleAddorEditContact={this.handleAddorEditContact}
              // general
              isEditingPage={this.state.isEditingPage}
              searchTerm={this.state.searchTerm}
            />
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

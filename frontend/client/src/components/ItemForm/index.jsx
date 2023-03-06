import { useState, useEffect } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import {format} from 'date-fns';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import "./itemForm.css";
const ItemForm = () => {

	return (
        <>
            <div className="container d-flex col-6 offset-3 mt-5 mb-3 main-container flex-column">
                <h1 className="d-flex col-12 justify-content-center mt-2 font-white">ADD ITEM</h1>
                <hr></hr>
                <form className="d-flex col-12 flex-column">
                    <div className="d-flex m-2 col-12 justify-content-around group" controlId="exampleForm.ControlInput1">
                        <label className="col-3 font-white">Item Name</label>
                        <input className="col-6 form-control-sm" type="text" placeholder="" />
                    </div>
                    <div className="d-flex m-2 col-12 justify-content-around group" controlId="exampleForm.ControlInput1">
                        <label className="col-3 font-white">Approximate Value</label>
                        <div className="col-6">
                            <input className="form-control-sm col-12" type="number" placeholder="e.g 9000.00 (S.P)" />
                            <p className="sub-text">How much do you evaluate your item's price (S.P)</p>
                        </div>

                    </div>
                    <div className="d-flex m-2 col-12 justify-content-around group" controlId="exampleForm.ControlInput1">
                        <label className="col-3 font-white">Location</label>
                        <div className="col-6">
                            <input className="col-12 form-control-sm" type="text" placeholder="" />
                            <p className="sub-text">Your location for the trade</p>
                        </div>
                    </div>
                    <div className="d-flex m-2 col-12 justify-content-around group" controlId="exampleForm.ControlInput1">
                        <label className="col-3 font-white">Item Description</label>
                        <div className="col-6">
                            <textarea className="col-12 form-control-sm" type="textarea" placeholder="" />
                            <p className="sub-text">Describe your item</p>
                        </div>
                    </div>
                    <div className="d-flex m-2 col-12 justify-content-around align-items-center group" controlId="exampleForm.ControlInput1">
                        <label className="col-3 font-white">Image Files</label>
                        <div className="inputContainer col-6 d-flex flex-column align-items-center justify-content-center" tabindex="0" role="button">
                            <FontAwesomeIcon icon="upload" className="mt-3 icon col-8 offset-2"></FontAwesomeIcon>
                            <p className="mt-1 col-8 offset-2 d-flex justify-content-center">Drag and drop files here</p>
                            <input className="fileupload-input col-8 offset-2 btn btn-outline-light" type="file" multiple/>
                        </div>
                    </div>
                    <input className="col-12 btn btn-light mt-5 mb-2" type="submit" value="Submit" />
                </form>
            </div>
        </>
	);
};

export default ItemForm;

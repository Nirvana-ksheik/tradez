import { useState, useEffect } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import {format} from 'date-fns';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import ItemForm from "components/ItemForm";
import "./addItem.css";

const AddItem = ({getCookie}) => {

	return (
        <>
            <ItemForm />
        </>
	);
};

export default AddItem;

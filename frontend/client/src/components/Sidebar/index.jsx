import React from "react";
import SideNav, {NavItem, NavIcon, NavText} from '@trendmicro/react-sidenav'
import "./sidebar.css";
import '@trendmicro/react-sidenav/dist/react-sidenav.css'
import { useNavigate } from "react-router-dom";

const SideBar = () => {

  const navigate = useNavigate();

  return (
    <div className="col-1 d-flex flex">
        <SideNav onSelect={(selected) => {
                console.log(selected);
                navigate(selected);
            }} className="sidenav">
            <SideNav.Toggle className="sidenav-toggle"/>
            <SideNav.Nav className="mt-5"  defaultSelected="home">
                <NavItem eventKey="home">
                    <NavIcon><i className="fa fa-home icons"></i></NavIcon>
                    <NavText>Home</NavText>
                </NavItem>
                <NavItem eventKey="items/create">
                    <NavIcon><i className="fa fa-plus-circle icons"></i></NavIcon>
                    <NavText>Create Item</NavText>
                </NavItem>
                <NavItem eventKey="items/mine">
                    <NavIcon><i className="fa fa-cube icons"></i></NavIcon>
                    <NavText>My Items</NavText>
                </NavItem>
                <NavItem eventKey="allitems">
                    <NavIcon><i className="fa fa-cubes icons"></i></NavIcon>
                    <NavText>All Items</NavText>
                </NavItem>
                <NavItem eventKey="items/archived">
                    <NavIcon><i className="fa fa-file-archive icons"></i></NavIcon>
                    <NavText>Archived Items</NavText>
                </NavItem>
            </SideNav.Nav>
        </SideNav>
    </div>
  );
}

export default SideBar;
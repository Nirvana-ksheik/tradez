import React from "react";
import ReactPaginate from 'react-paginate';
import './pagination.css'

const Pagination = ({handlePageClick, pageCount, maxItems, currentLanguage}) => {

    return(
        <div className="paginated-list-container">
            <ReactPaginate
                breakLabel="..."
                nextLabel={
                    currentLanguage === "ar" ? 
                    <i className="fas fa-chevron-circle-left page-icon"></i> :
                    <i className="fas fa-chevron-circle-right page-icon"></i>
                }
                onPageChange={handlePageClick}
                pageRangeDisplayed={maxItems}
                pageCount={pageCount}
                previousLabel={
                    currentLanguage === "ar" ? 
                    <i className="fas fa-chevron-circle-right page-icon"></i> :
                    <i className="fas fa-chevron-circle-left page-icon"></i>
                }
                renderOnZeroPageCount={null}
                containerClassName="pagination"
                pageLinkClassName="page-link"
                previousLinkClassName="previous"
                nextLinkClassName="next"
                activeLinkClassName="active"
            />
        </div>
    );
}

export default Pagination;
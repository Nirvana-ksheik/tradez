import { Slide } from 'react-slideshow-image';
import { useState } from 'react';
const Slideshow = ({slideImages}) => {

    console.log("SlideImages: ", slideImages);

    const properties = {
        duration: 5000,
        transitionDuration: 500,
        infinite: true,
        indicators: true,
        arrows: true
    }

    return (
      <Slide {...properties}>
        {
            (() => {
                let container = [];
                {
                    slideImages !== undefined && slideImages !== null && slideImages.forEach((data, index) => {
                    console.log("single data is: ", data);
                    container.push(
                        <div className="each-slide" key={index}>
                            <img className="col-4" src={"http://localhost:3000" + data} alt="Image"/>
                        </div>
                    )
                    })
                }
                return container;
            })()
        }
      </Slide>
    )
};

export default Slideshow;
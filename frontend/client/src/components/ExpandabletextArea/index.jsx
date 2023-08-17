import React from 'react'; 
import { useRef, useEffect } from 'react'; 

function ExpandableTextArea({className, name, handleChange, value}) { 
  
  const textRef = useRef();

  useEffect(() => {
    if (textRef && textRef.current) {
      textRef.current.style.height = "200px";
      const taHeight = textRef.current.scrollHeight;
      textRef.current.style.height = taHeight + "px";
    }
  }, [value]);

  function handleTextInputChange(event) { 
    handleChange({currentTarget: event.target});
  } 
  
  return (     
      <textarea 
        onChange={handleTextInputChange}
        name={name}
        value={value}
        className={className}
        ref={textRef}
        rows={10}></textarea>   
  ); 
  
} 

export default ExpandableTextArea;
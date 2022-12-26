import React from 'react';

const Star = ({ selected = false, onClick = f => f }) => {
    return (
        // <div className={selected ? "star selected" : "star"} onClick={onClick} />
        <i  className={"em em-angry emoticons" } aria-role="presentation" onClick={onClick}></i>
    )
};

  export default Star;
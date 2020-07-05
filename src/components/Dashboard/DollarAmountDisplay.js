import React from 'react';
import './DollarAmountDisplay.css'

const DollarAmountDisplay = ({ title, amount }) => {
    return (
        <div>
            {title}: ${amount}
        </div>
    )
}

export default DollarAmountDisplay;
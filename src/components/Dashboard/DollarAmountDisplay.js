import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card'
import { CardContent, Typography } from '@material-ui/core';

import './DollarAmountDisplay.css'

const useStyles = makeStyles({
    root: {
        // maxWidth: 150,
        minWidth: 100,
        display: 'flex'
    },
    title: {
        fontSize: 14,
    }
})

const DollarAmountDisplay = ({ title, amount }) => {
    const classes = useStyles();
    let cents = String(Math.round((amount * 100) % 100));
    if (cents.length === 1) {
        cents = "0" + cents;
    }
    const dollars = (Math.floor(amount / 1)).toLocaleString();
    const textColor = dollars === "0" && cents === "00" ? "#66cc99" : "";
    return (
        <div style={{ margin: "0 0 5px 0" }}>
            <Card style={{ backgroundColor: "#506680" }} className={classes.root}>
                <CardContent style={{ width: "100%" }}>
                    <Typography className={classes.title} style={{ color: "#ccc" }}>
                        {title}
                    </Typography>
                    <div style={{ display: "flex", justifyContent: "center", width: 'inherit' }}>
                        <div style={{ fontSize: "20px", verticalAlign: "top", color: textColor }}>
                            $
                        </div>
                        <div style={{ fontSize: "30px", verticalAlign: "top", lineHeight: "1em", color: textColor }}>
                            {dollars}
                        </div>
                        <div style={{ fontSize: "16px", verticalAlign: "top", color: textColor }}>
                            {cents}
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}

export default DollarAmountDisplay;
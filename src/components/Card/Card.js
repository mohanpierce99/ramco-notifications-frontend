import React from "react";
import {
  Card,
  CardActions,
  CardContent,
  CardHeader,
  makeStyles,
} from "@material-ui/core";
import Button from "@material-ui/core/Button";

const userStyles = makeStyles({
  root: {
    minWidth: "300px",
    padding: "26px",
    margin: "26px",
    minHeight: "400px",
  },
});

export default function CardComp({ orderID, items, price, status }) {
  const classes = userStyles();

  const handleList = () => {
    return items.map((item, idx) => {
      return (
        <p style={{ color: "black", padding: "16px" }} className="left-align">
          {item.name} ::: {item.quantity} x {item.price}
        </p>
      );
    });
  };

  return (
    <Card className={classes.root}>
      <CardHeader title={<h3 className="bold">Order ID {orderID}</h3>} />
      <CardContent>
        <h4 className="semi-bold">Item list</h4>
        <br></br>
        {handleList()}
        <Button
          variant="contained"
          className="semi-bold extend"
          color="secondary"
        >
          {status}
        </Button>
      </CardContent>

      <CardActions>
        <Button
          variant="outlined"
          className="semi-bold extend"
          color="primary"
          href="#outlined-buttons"
        >
          Price : {price} ₹
        </Button>
      </CardActions>
    </Card>
  );
}

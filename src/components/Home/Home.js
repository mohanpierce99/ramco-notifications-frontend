import React from "react";
import { Grid, GridList, GridListTileBar } from "@material-ui/core";
import socketIOClient from "socket.io-client";
import { useEffect, useRef, useState } from "react";
import Container from "@material-ui/core/Container";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Card from "../Card/Card";
const SOCKET_SERVER_URL = "http://localhost:3005";

export default function Home() {
  const [cardData, setCardData] = useState([]);
  const socketRef = useRef();

  useEffect(() => {
    // Creates a WebSocket connection
    socketRef.current = socketIOClient(SOCKET_SERVER_URL);

    // Listens for incoming messages
    socketRef.current.on("connect", () => {
      console.log("connected");
    });
    socketRef.current.on("price", (message) => {
      console.log("received", message);
      toast.dark(`🦄 Price update for ${message.name} - ${message.price}`, {
        position: "bottom-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
      setCardData((cardData) => {
        let temp = [...cardData];
        temp.forEach((s) => {
          s.items.forEach((x) => {
            if (x.name === message.name) {
              x.price = message.price;
            }
          });
        });
        console.log("before set");
        return temp;
      });
    });

    socketRef.current.on("status", (message) => {
      console.log("received", message);
      toast.dark(
        `🦄 Order Status update for ${message.id} - ${message.status} 🚚`,
        {
          position: "bottom-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        }
      );
      setCardData((cardData) => {
        let temp = [...cardData];
        temp.forEach((s) => {
          console.log(message, s);
          console.log("***");
          if (s.orderId === message.id) {
            s.status = message.status;
          }
        });
        return temp;
      });
    });

    socketRef.current.on("order", (message) => {
      console.log(message);
      toast.dark(`🦄 New order received ID ${message.orderId}`, {
        position: "bottom-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
      setCardData((data) => [...data, message]);
    });

    // Destroys the socket reference
    // when the connection is closed
    return () => {
      socketRef.current.disconnect();
    };
  }, []);

  useEffect(() => {
    console.log("changed", cardData);
  }, [cardData]);

  const transform = (order) => {
    const price = order.items.reduce((a, b) => {
      return a + b.price * b.quantity;
    }, 0);
    return {
      orderID: order.orderId,
      price,
      items: order.items,
      status: order.status,
    };
  };

  const handleCards = () => {
    let temp = [...cardData];

    return temp.map((d) => {
      let mod = transform(d);
      console.log("afrter set");
      console.log(mod);
      return (
        <Grid item xs={4}>
          <Card
            orderID={mod.orderID}
            price={mod.price}
            items={mod.items}
            status={mod.status}
          />
          ;
        </Grid>
      );
    });
  };

  return (
    <Container>
      <ToastContainer
        position="bottom-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
      <Grid container spacing={3}>
        {handleCards()}
      </Grid>
    </Container>
  );
}

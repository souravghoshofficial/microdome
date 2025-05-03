import { app } from "./app.js";
import dotenv from "dotenv"

dotenv.config('.env')

const studentsReview = [
    {
      name: "Sourav Ghosh",
      message: '"The Microdome classes transformed my preparation journey! Their resources and support were invaluable in my success."',
      designation: "M.Sc in Biotechnology , IIT Delhi",
      imageUrl : "https://images.pexels.com/photos/91227/pexels-photo-91227.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"
    },
    {
      name: "Abhijit Rabidas",
      message: '"Microdome classes played a crucial role in my success! Their well-structured resources and dedicated support made my preparation journey smooth and effective. Highly recommended!"',
      designation: "M.Sc in Microbiology , Banaras Hindu University",
      imageUrl : "https://images.pexels.com/photos/614810/pexels-photo-614810.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"
    },
    {
      name: "Rohit Gupta",
      message: '"An absolute game-changer! The Microdome classes provided exceptional guidance and top-notch resources that significantly boosted my confidence and performance."',
      designation: "M.Sc in Biotechnology , Delhi University",
      imageUrl : "https://images.pexels.com/photos/1121796/pexels-photo-1121796.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"
    },
    {
      name: "Sayan Ganguly",
      message: '"An absolute game-changer! The Microdome classes provided exceptional guidance and top-notch resources that significantly boosted my confidence and performance."',
      designation: "M.Sc in Biotechnology , Delhi University",
      imageUrl : "https://images.pexels.com/photos/1861594/pexels-photo-1861594.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"
    },
  ];


const port = process.env.PORT || 3000;

app.get('/' , (req, res) => {
    res.send("Hello World");
})

app.get('/api/testimonial' , (req, res) => {
    res.send(studentsReview);
})

app.listen(port, () => {
    console.log(`Server is listening on port http://localhost:${port}`);
})





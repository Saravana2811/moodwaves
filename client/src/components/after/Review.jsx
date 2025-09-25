import React from "react";
<<<<<<< HEAD
import Banner from "./Banner";
=======

>>>>>>> 51728fede5949cc21aa0d470c4ea92a01a33e4f4
const experts = [
  {
    name: "Rajesh Kumar",
    service: "Home Cleaning Service",
    experience: "2 years",
    location: "Madurai",
    img: "https://cdn-icons-png.flaticon.com/512/2922/2922510.png",
    phone: "tel:+919876543210",
  },
  {
    name: "Kamala Kannan",
    service: "Home Repair",
    experience: "3 years",
    location: "Coimbatore",
    img: "https://cdn-icons-png.flaticon.com/512/2922/2922656.png",
    phone: "tel:+919876543211",
  },
  {
    name: "Arun",
    service: "Painting",
    experience: "5 years",
    location: "Erode",
    img: "https://cdn-icons-png.flaticon.com/512/2922/2922688.png",
    phone: "tel:+919876543212",
  },
<<<<<<< HEAD
  {
    name: "Arun",
    service: "Painting",
    experience: "5 years",
    location: "Erode",
    img: "https://cdn-icons-png.flaticon.com/512/2922/2922688.png",
    phone: "tel:+919876543212",
  },
=======
>>>>>>> 51728fede5949cc21aa0d470c4ea92a01a33e4f4
  
];

function Review() {
  const pageStyle = {
    
    minHeight: "100vh",
<<<<<<< HEAD
    padding: "40px",
=======
    padding: "40px 0",
>>>>>>> 51728fede5949cc21aa0d470c4ea92a01a33e4f4
    fontFamily: "Segoe UI, Arial, sans-serif",
  };

  const headingStyle = {
    textAlign: "center",
    fontSize: "2.5rem",
    fontWeight: 800,
    marginBottom: "10px",
    color: "white",
    letterSpacing: "1px",
  };

  const subHeadingStyle = {
    textAlign: "center",
    fontSize: "1.2rem",
    color: "white",
    marginBottom: "40px",
  };

  const cardsContainerStyle = {
    display: "flex",
    gap: "32px",
    justifyContent: "center",
    flexWrap: "wrap",
  };

  const cardStyle = {
    background: "#fff",
<<<<<<< HEAD
    borderRadius: "220px",
=======
    borderRadius: "22px",
>>>>>>> 51728fede5949cc21aa0d470c4ea92a01a33e4f4
    boxShadow: "0 4px 24px rgba(0,0,0,0.08)",
    padding: "32px 24px",
    minWidth: "240px",
    maxWidth: "260px",
    textAlign: "center",
<<<<<<< HEAD
    
=======
    marginBottom: "24px",
>>>>>>> 51728fede5949cc21aa0d470c4ea92a01a33e4f4
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  };

  const imgStyle = {
    width: "60px",
    height: "60px",
    marginBottom: "18px",
    borderRadius: "50%",
    objectFit: "cover",
    background: "#f3f4f6",
  };

  const nameStyle = {
    fontWeight: 700,
    fontSize: "1.25rem",
    marginBottom: "8px",
    color: "#22223b",
  };

  const serviceStyle = {
    fontSize: "1.05rem",
    color: "#374151",
    marginBottom: "6px",
  };

  const infoStyle = {
    fontSize: "1rem",
    color: "#6b7280",
    marginBottom: "6px",
  };

  const locationStyle = {
    fontSize: "1rem",
    color: "#6b7280",
    marginBottom: "10px",
  };

  const callStyle = {
    color: "#6a11cb",
    fontWeight: 600,
    textDecoration: "none",
    fontSize: "1.05rem",
    marginTop: "8px",
    cursor: "pointer",
  };

  return (
    <div style={pageStyle}>
      <div style={headingStyle}>Reviews</div>
      <div style={subHeadingStyle}>
        Take a look at some of the user reviews
      </div>
      <div style={cardsContainerStyle}>
        {experts.map((expert, idx) => (
          <div key={idx} style={cardStyle}>
            <img src={expert.img} alt={expert.name} style={imgStyle} />
            <div style={nameStyle}>{expert.name}</div>
            <div style={serviceStyle}>{expert.service}</div>
            <div style={infoStyle}>{expert.experience}</div>
            <div style={locationStyle}>{expert.location}</div>
           
          </div>
        ))}
      </div>
<<<<<<< HEAD
      <br/><br/>
      <Banner/>
=======
>>>>>>> 51728fede5949cc21aa0d470c4ea92a01a33e4f4
    </div>
  );
}

export default Review;
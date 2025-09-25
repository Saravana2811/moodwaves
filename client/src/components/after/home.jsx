import React from "react";
import Type from "./type.jsx";
import Footer from "./footer.jsx";
import Input from "./InputBox.jsx";
import Faq from "./Faq.jsx";
import Review from "./Review.jsx";
import EmotionStats from "./EmotionStats.jsx";
import b1 from "../../assets/b1.png";

function Home() {
 const pageStyle = {
  minHeight: "100vh",              
  width: "100%",
  display: "flex",                 
  flexDirection: "column",         
  backgroundImage: `url(${b1})`,   
  backgroundSize: "cover",         
  backgroundPosition: "center",    
  backgroundRepeat: "no-repeat",   
  backgroundAttachment: "fixed",   
  overflowX: "hidden",
};

  const mainStyle = {
    flex: 1,                         
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap:"10px",
  };

  const navbarStyle = {
    width: "100%",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: "18px 40px",
    position: "sticky",
    top: 0,
    zIndex: 10,
    boxSizing: "border-box",
   // 🔹 semi-transparent bg so text is visible
      // 🔹 glassy effect (optional)
  };

  const brandStyle = {
    fontSize: "3.4rem",
    fontWeight: 900,
    fontFamily: "'Pacifico', Segoe Script, cursive",
    letterSpacing: "1px",
    background: "white",
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
    backgroundClip: "text",
    
  };

  return (
    <div style={pageStyle}>
      {/* Main Content */}
      <main style={mainStyle}>
        {/* Navbar */}
        <nav style={navbarStyle}>
          <div style={brandStyle}>MoodWaves</div>
        </nav>      
        <Type/>
        <Input />  
        <EmotionStats />
        <Review/>
        <Faq />
        <Footer />
      </main>
    </div>
  );
}

export default Home;

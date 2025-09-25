import React from "react";
<<<<<<< HEAD
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
=======
import About from "./about.jsx";
import Footer from "./footer.jsx";
import Input from "./input.jsx";
import Premium from "./Review.jsx";
import b1 from "../../assets/b1.png";
function Home() {
  const pageStyle = {
    minHeight: "100vh",              // full viewport height
    width: "100%",
    display: "flex",
    flexDirection: "column",         // stack vertically
    backgroundImage:
      `url(${b1})`, // 🔹 background image
    backgroundSize: "cover",         // cover the whole screen
    backgroundPosition: "center",    // keep centered
    backgroundRepeat: "no-repeat",   // no tiling
    overflowX: "hidden",
  };
>>>>>>> 51728fede5949cc21aa0d470c4ea92a01a33e4f4

  const mainStyle = {
    flex: 1,                         
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
<<<<<<< HEAD
    gap:"10px",
=======
>>>>>>> 51728fede5949cc21aa0d470c4ea92a01a33e4f4
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
<<<<<<< HEAD
        </nav>      
        <Type/>
        <Input />  
        <EmotionStats />
        <Review/>
        <Faq />
        <Footer />
      </main>
=======
        </nav>

        {/* Content sections */}
        
        
        <About/>
        <br/><br/><br/>
        <Input />  
        <Premium />
        
      </main>

      {/* Footer always at bottom */}
      <Footer />
>>>>>>> 51728fede5949cc21aa0d470c4ea92a01a33e4f4
    </div>
  );
}

export default Home;

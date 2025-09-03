import React from "react";
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

  const mainStyle = {
    flex: 1,                         
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
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

        {/* Content sections */}
        
        
        <About/>
        <br/><br/><br/>
        <Input />  
        <Premium />
        
      </main>

      {/* Footer always at bottom */}
      <Footer />
    </div>
  );
}

export default Home;

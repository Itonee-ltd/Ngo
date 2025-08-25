import Navbar from "./navBar";
import Hero from "./hero";
import AboutUs from "./about";
import More from "./provisionForOrphanages/more"
import Footer from "./Footer";
const Home = () => {
    return (
        <div>
          <Navbar/>
          <Hero/>
          <AboutUs/>
          <More/>
          <Footer/>
        </div>
    )
}

export default Home;
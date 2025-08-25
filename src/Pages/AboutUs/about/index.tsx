import Card from "../../home/hero/Card";
import cardItem1 from '../../../assets/image/icon cool-icon-l1.svg'
import cardItem2 from '../../../assets/image/icon cool-icon-l4.svg'
import cardItem3 from '../../../assets/image/icon cool-icon-l7.svg'
import img from '../../../assets/image/postive-caring-relationships-teachers 1.png'
import Navbar from "../../home/navBar";
import Footer from "../../home/Footer";
const AboutUs = () => {
    const CardItem = [
        {img: cardItem1, title: "Give the Gift of Education and Hope", desc: "Your support helps us uplift orphaned children — through scholarships, mentorship, and safe homes."},
        {img: cardItem2, title: "Because Every Child Deserves a Chance", desc: "We connect children in orphanages with life-changing educational opportunities and compassionate support."},
        {img: cardItem3, title: "Give the Gift of Education and Hope", desc: "Your support helps us uplift orphaned children — through scholarships, mentorship, and safe homes"}
      ]
    return (
        <div>
        <Navbar/>
        <main className="container mx-auto p-4 md:p-8 mt-4">
        {/* Who Are We Section */}
        <section className="mb-16">
          <h1 className="text-2xl md:text-5xl font-extrabold mb-6">Who Are We</h1>
          <p className="text-[20px] md:text-xl leading-relaxed max-w-5xl">
          [NGO Name] is a dedicated non-profit organization committed to transforming lives through education and care. Based in [Location], we provide scholarships to underprivileged children and deliver essential support to orphanages, ensuring that every child has the opportunity to learn, grow, and thrive. Our work goes beyond financial assistance — we invest in creating safe, nurturing environments, equipping orphanages with resources, and empowering children with the skills and confidence to shape their future. With compassion at our core and a commitment to lasting impact, [NGO Name] is building brighter futures, one child at a time.
            </p>
          <p className="text-[20px] md:text-xl leading-relaxed mt-4 max-w-5xl">
            We are committed to refining children, driving growth, and fostering peak performance through strategic insights and
            structured approaches.
          </p>
        </section>

        {/* Our Purpose Section */}
        <section className="pt-16">
          <div className="relative text-center mb-12">
            <span className="inline-block px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white text-lg font-semibold rounded-full shadow-lg">
              OUR PURPOSE
            </span>
          </div>

          <div className="flex flex-col md:flex-row justify-center items-stretch space-y-8 md:space-y-0 md:space-x-8">
            {/* Vision Card */}
            <div className="bg-[#96BB7C] p-6 md:p-8 rounded-xl shadow-xl border border-gray-700 flex-1 max-w-md">
              <h2 className="text-3xl font-bold text-blue-400 mb-4">Vision</h2>
              <p className="text-white leading-relaxed">
                To reform orphanes and less previledged in Nigeria into children to future leader.
              </p>
            </div>

            {/* Mission Card */}
            <div className="bg-[#96BB7C] p-6 md:p-8 rounded-xl shadow-xl border border-gray-700 flex-1 max-w-md">
              <h2 className="text-3xl font-bold text-blue-400 mb-4">Mission</h2>
              <p className="text-white leading-relaxed">
                Lorem ipsum dolor sit amet consectetur adipisicing elit. Dolore iste commodi ipsam iure magnam, optio expedita, quaerat recusandae aperiam esse saepe eum facilis ab. Aperiam ab nostrum numquam iure dolor aspernatur molestias commodi fugit ipsa, similique aliquam repudiandae excepturi quia a, cum dolorum ex saepe?
              </p>
            </div>
          </div>
        </section>
        <section>
                     <div className="mt-20">
                        <h2 className="text-4xl md:text-5xl font-extrabold mb-6">Meet Our Team</h2>
                        <div>
                        <div className="flex flex-wrap justify-center gap-6 py-10 object-fit">
                           {CardItem.map((card, index) => (
                                   <Card key={index} img={card.img} title={card.title} desc={card.desc}/>
                                ))}
                            </div>
                        </div>
                    </div>
        </section>
      </main>
      <Footer/>
    </div>
    );
}

export default AboutUs;
import img from "../../../assets/image/medium-shot-happy-kids-posing.jpg";
import { IoIosArrowForward } from "react-icons/io";
// import More from "../provisionForOrphanages/more";

const AboutUs = () => {
  return (
    <section className="bg-white py-16 px-6 md:px-20 flex flex-col-reverse md:flex-row">
        <div className="md:w-[40%] object-fit">
            <img src={img} alt="" />
        </div>
      <div className="max-w-4xl md:mx-auto text-justify w-[100%] md:w-[50%] mt-[3rem]">
          <h2 className="text-3xl font-bold text-gray-800 mb-[1rem] text-[30px]">Our Mission</h2>
          <div className="border-2 border-[#E74040] my-[1rem] w-[100px]"></div>
          <p className="md:text-[12px] text-[18px] text-justify">At [Your NGO Name], we believe that every child deserves a chance to thrive — regardless of their background. Our mission is to empower underprivileged and orphaned children by providing access to quality education through scholarships, mentorship, and essential support.</p>
          <br/>
          <span className="md:text-[16px] text-[18px] my-[1rem] font-semibold">Together, we can build a future where no child is left behind.</span>
          <button className="flex items-center text-[#96BB7C] mt-[1rem] justify-center">Learn More <IoIosArrowForward className="ml-[12px] mt-[2px]" /></button>
      </div>
    </section>
  );
};

export default AboutUs;